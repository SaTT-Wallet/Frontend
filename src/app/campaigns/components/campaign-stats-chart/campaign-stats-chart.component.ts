import { Component, Input, OnInit } from '@angular/core';
import { ChartsModule } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-campaign-stats-chart',
  templateUrl: './campaign-stats-chart.component.html',
  styleUrls: ['./campaign-stats-chart.component.css']
})
export class CampaignStatsChartComponent implements OnInit {
  
  public SystemName: string = "MF1";
  firstCopy = false;

  // data
  public lineChartData: Array<number> = [1, 8, 49];

  public labelMFL: Array<any> = [
    { data: this.lineChartData, label: this.SystemName }
  ];
  // labels
  public lineChartLabels: Array<any> = [
    "01/29",
    "01/29",
    "01/29"
  ];

  public barChartType: ChartType = "line";


  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            max: 60,
            min: 0
          }
        }
      ],
      xAxes: [{}]
    },
    plugins: {
      datalabels: {
        display: true,
        align: "top",
        anchor: "end",
        //color: "#2756B3",
        color: "#222",

        font: {
          family: "FontAwesome",
          size: 14
        }
      },
      deferred: false
    }
  };
  _lineChartColors: Array<any> = [
    {
      backgroundColor: "red",
      borderColor: "red",
      pointBackgroundColor: "red",
      pointBorderColor: "red",
      pointHoverBackgroundColor: "red",
      pointHoverBorderColor: "red"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public chartClicked(e: any): void {
  }
  public chartHovered(e: any): void {
  }

}
