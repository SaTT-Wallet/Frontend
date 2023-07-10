import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Router } from '@angular/router';
import {  switchMap, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-crypto-market-cap',
  templateUrl: './crypto-market-cap.component.html',
  styleUrls: ['./crypto-market-cap.component.scss']
})
export class CryptoMarketCapComponent implements OnInit {
cryptoLists : any;
filteredCryptoListId: any[]=[];
sparklineIn7dCryptoList: any[]=[]
data: any
globalMarketCap:any;
searchQuery: string = '';
public chart: any;
lineChartOptions: ChartOptions = {
  aspectRatio:2.5,
  responsive:true,
  elements:{
     point:{
       radius:0,
     }
  },
  scales: {
     scaleLabel:{
       fontColor:"red"
     },

     xAxes : [{
        display:false,
       gridLines:{
          color:"transparent"
       }
     }],
     yAxes : [{
       display:false,

       gridLines:{
          color:"transparent"
       }
     }],
  }
};
lineChartType: ChartType = 'line';
lineChartLegend = false;
private ngUnsubscribe = new Subject<void>();
  constructor(  
    private router: Router ,
    private fetchservice: CryptofetchServiceService,
    private titleService: Title, private metaService: Meta
    
    ){
  
   }

  ngOnInit(): void {
    this.titleService.setTitle('SaTT-Market Cap'); 
    this.metaService.updateTag({ name: 'description', content: 'Discover the best options in the cryptocurrency market and maximize your investments.' });
    this.metaService.addTag({ name: 'keywords', content: 'cryptocurrency, Coin, Market Cap, investment, crypto, earning' });
    this.metaService.addTag({ property: 'og:image', content: 'assets/Images/global-market-cap-cov.png' });
    this.metaService.addTag({ name: 'twitter:card', content: 'assets/Images/global-market-cap-cov.png' });
    this.fetchservice.getCryptoPriceList().pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap((data: any) => {
        const cryptos = data?.data ? Object.entries(data.data) : [];
        this.cryptoLists = cryptos.slice(0, 200);
        this.cryptoLists?.forEach((crypto: any) => {
          if (crypto && crypto[1]) {
         
            
            this.filteredCryptoListId.push(crypto[1].id);
          }
        });
    
        const chunks = this.getArrayChunks(this.filteredCryptoListId, 50);
       
     
        
        return forkJoin(chunks.map(chunk => this.fetchservice.getCryptoPriceDetails(chunk)));
      })
    ).subscribe(
      (data: any) => { 
   
       
        const dataArray = Object.values(data)
    
        dataArray.forEach((response: any) => {
          
          const details = Object.values(response?.data) || [];
          details.forEach((crypto: any) => {
            if (crypto) {
              this.sparklineIn7dCryptoList.push(crypto.sparkline_in_7d);
            }
          });
        });
   
      },
      (error) => {
    
        
        console.error(error);
      }
      
    );

    this.fetchservice.getGlobalCryptoMarketInfo().pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
      this.globalMarketCap = res;
    },
    (error) => {
      console.error(error);
      
    });
  

  }
  /**
 * Split an array into chunks of a specific size.
 * @param arr The original array to split.
 * @param chunkSize The size of each chunk.
 * @returns A new array containing the chunks.
 */
  getArrayChunks<T>(arr: T[], chunkSize: number): T[][] {
      let results: T[][] = [];
    
      for (let i = 0; i < arr.length; i += chunkSize) {
        results.push(arr.slice(i, i + chunkSize));
      }
    
    return results;
  }

  filterCryptos() {
    if (!this.searchQuery) {
      return this.cryptoLists;
    }
  
    
    const lowerCaseSearchQuery = this.searchQuery.toLowerCase();
  
    return this.cryptoLists?.filter((crypto : any) =>
    crypto[0].toLowerCase().includes(lowerCaseSearchQuery) ||
     crypto[1].name.toLowerCase().includes(lowerCaseSearchQuery)
      
    );
  }
  cryptoDtlails(crypto: string, cryptoName:string){
    const cryptoUpperCase = crypto.toUpperCase();
    this.titleService.setTitle(cryptoName +' price today')
    this.router.navigate(['/wallet/coin-detail'], { queryParams: { crypto: cryptoUpperCase } });

  }

  getColor(variation: number){
    return variation > 0 ? '#00CC9E' :'#F52079';    
   }
  getNumberWithLeadingZeros(i: number): string {
    return String(i).padStart(2, '0');
  }
 clear(){
  this.searchQuery='';
 }
 tofixUsd(price: any){
 if (price < 0.1) {
    return '8';
  }
  if (price >= 0.1 && price <= 1.9) {
    return '6';
  }
  if (price >= 2 && price <= 9.9999) {
    return '5';
  }
  if (price >= 10.0 && price <= 9999.9) {
    return '2';
  }
  if (price >= 10000 && price <= 99999999999) {
    return '0';
  }
  
 return'0'
 }
 ngOnDestroy() {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.complete();
}
}
