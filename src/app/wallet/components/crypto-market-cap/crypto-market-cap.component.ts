import { Component, OnInit } from '@angular/core';
import { CryptoInfoService } from '@app/core/services/crypto-info.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crypto-market-cap',
  templateUrl: './crypto-market-cap.component.html',
  styleUrls: ['./crypto-market-cap.component.scss']
})
export class CryptoMarketCapComponent implements OnInit {
cryptoLists : any;
filteredCryptoList: any;
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

  constructor(  
    private cryptoInfoService: CryptoInfoService,
    private router: Router ,
    ){
  
   }


  ngOnInit(): void {
    this.cryptoInfoService
    .getCryptoList().subscribe((res) => {
      this.cryptoLists = res;
      this.filteredCryptoList = this.cryptoLists;
      
      
     });
     this.cryptoInfoService
     .getGlobalMarketCap().subscribe((res)=>{
     
      this.globalMarketCap = res
     }
     )
  

  }


  filterCryptos() {
    if (!this.searchQuery) {
      return this.cryptoLists;
    }
  
    
    const lowerCaseSearchQuery = this.searchQuery.toLowerCase();
  
    return this.cryptoLists?.filter((crypto : any) =>
    crypto.symbol.toLowerCase().includes(lowerCaseSearchQuery) ||
     crypto.name.toLowerCase().includes(lowerCaseSearchQuery)
      
    );
  }
  cryptoDtlails(crypto: string){
    const cryptoUpperCase = crypto.toUpperCase();
    this.router.navigate(['/wallet/coin-detail'], { queryParams: { crypto: cryptoUpperCase } });

  }

  getColor(variation: number){
    return variation > 0 ? '#00CC9E' :'#F52079';    
   }
  getNumberWithLeadingZeros(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
 clear(){
  this.searchQuery='';
 }
}
