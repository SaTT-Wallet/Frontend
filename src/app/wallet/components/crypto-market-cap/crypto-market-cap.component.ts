import { Component, OnInit } from '@angular/core';
import { CryptoInfoService } from '@app/core/services/crypto-info.service';
import { ChartOptions, ChartType, Chart, plugins, ChartDataSets, ChartScales } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
@Component({
  selector: 'app-crypto-market-cap',
  templateUrl: './crypto-market-cap.component.html',
  styleUrls: ['./crypto-market-cap.component.scss']
})
export class CryptoMarketCapComponent implements OnInit {
cryptoLists : any;


public chart: any;
  constructor(  
    private cryptoInfoService: CryptoInfoService,
    ){
  
   }

   createChart(){
  
      this.chart = new Chart("MyChart", {
        type: 'line', 
  
        data: {
          labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                           '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
            datasets: [
            {
              
              data: [6,7,20,155,0,53,45,8],
              backgroundColor: 'transparent',
              borderColor:'black',
              
            }
          ]
        },
        options: {
         
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
        }
        
      });
    }
  

  ngOnInit(): void {
    this.cryptoInfoService
    .getCryptoList().subscribe((res) => {
      this.cryptoLists = res;
     });
     this.createChart();
  
  }

}
