/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { ChartOptions, ChartType, Chart, plugins } from 'chart.js';

import { Color, Label, MultiDataSet } from 'ng2-charts';

import { ConvertToWeiPipe } from '@shared/pipes/convert-to-wei.pipe';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-campaign-stats',
  templateUrl: './campaign-stats.component.html',
  styleUrls: ['./campaign-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignStatsComponent implements OnInit, OnChanges {
  @Input() totalG!: any;
  @Input() Share: any;
  @Input() View: any;
  @Input() Like: any;
  @Input() Twitter: any;
  @Input() Youtube: any;
  @Input() Instagram: any;
  @Input() Facebook: any;
  InfluencerName: any;
  @Input() Influencer: any;
  @Input() campaign_id = '';
  @ViewChild('doughnutChart') doughnutChart?: ElementRef<HTMLCanvasElement>;
  gradient!: any;
  imgSrc: any;
  statsChartData!: MultiDataSet;
  doughnutChartData!: MultiDataSet;
  lineChartColors!: Color[];
  statsChartColors!: Color[];
  chartOptions = {
    cutoutPercentage: 65,
    tooltips: {
      enabled: true
    }
  };
  SocialchartOptions = {
    cutoutPercentage: 65,
    tooltips: {
      enabled: true
    }
  };
  private isDestroyed = new Subject();

  remunerationStats: any = {};

  doughnutChartLabels: Label[] = [
    'Instagram',
    'facebook',
    'youtube',
    'Twitter'
  ];

  doughnutChartType: ChartType = 'doughnut';

  doughnutChartOptions = false;

  statsChartLabels: Label[] = ['Vues', 'Likes', 'Partages'];

  PaymentChartLabels: Label[] = ['to Pay', 'Pending', 'Payed'];
  paymentChartData: MultiDataSet = [[24, 55, 66]];
  paymentChartColors: Color[] = [
    {
      backgroundColor: ['#F52079', '#1967FF', '#00CC9E']
    }
  ];

  constructor(
    private CampaignService: CampaignHttpApiService,
    private fromWeiTo: ConvertFromWei,
    private renderer: Renderer2,
    private context: CanvasRenderingContext2D
  ) {}

  ngOnInit(): void {
    var ctx: any = this.doughnutChart?.nativeElement.getContext('2d');

    // ctx.getContext('2d');
    this.gradient = ctx.createLinearGradient(0, 0, 0, 450);
    this.gradient.addColorStop(0, 'rgba(151,122,208, 0.1 )');
    this.gradient.addColorStop(1, 'rgba(151,122,208, 1)');
  }
  ngAfterViewInit() {
    this.doughnutChart?.nativeElement.getContext('2d');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.doughnutChartData = [
        [this.Instagram, this.Facebook, this.Youtube, this.Twitter]
      ];
      this.statsChartData = [[this.View, this.Like, this.Share]];
      if (
        this.Facebook > 0 ||
        this.Youtube > 0 ||
        this.Twitter > 0 ||
        this.Instagram > 0
      ) {
        this.lineChartColors = [
          {
            backgroundColor: ['#F52079', '#1967FF', '#FF0000', '#00acee']
          }
        ];
      } else if (
        this.Facebook === 0 &&
        this.Youtube === 0 &&
        this.Twitter === 0 &&
        this.Instagram === 0
      ) {
        this.lineChartColors = [
          {
            backgroundColor: ['#cccccc']
          }
        ];
      }
      if (!this.Facebook && !this.Youtube && !this.Twitter && !this.Instagram) {
        this.lineChartColors = [
          {
            backgroundColor: ['#cccccc']
          }
        ];
        this.doughnutChartData = [[100, 0, 0, 0]];
        this.SocialchartOptions = {
          cutoutPercentage: 65,
          tooltips: {
            enabled: false
          }
        };
      }

      if (this.Share > 0 || this.Like > 0 || this.View > 0) {
        this.statsChartColors = [
          {
            backgroundColor: ['#F52079', '#1967FF', '#00CC9E']
          }
        ];
      }

      if (this.Share === 0 && this.Like === 0 && this.View === 0) {
        this.statsChartColors = [
          {
            backgroundColor: ['#cccccc']
          }
        ];
      }

      if (!this.Share && !this.Like && !this.View) {
        this.statsChartData = [[100, 0, 0]];
        this.statsChartColors = [
          {
            backgroundColor: ['#cccccc']
          }
        ];

        this.chartOptions = {
          tooltips: {
            enabled: false
          },
          cutoutPercentage: 65
        };
      }

      //this.InfluencerName = this.Influencer.meta.firstName + " " + this.Influencer.meta.lastName || this.Influencer.meta.name;
    }

    if (changes.campaign_id && changes.campaign_id.currentValue) {
      this.CampaignService.getCampaignStatics(this.campaign_id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response) {
            this.remunerationStats = response;
            if (response.toPay && response.spent && response.initialBudget) {
              let toPay = this.fromWeiTo.transform(response.toPay, 'SATT');
              let spent = this.fromWeiTo.transform(response.spent, 'SATT');
              this.paymentChartData = [[+toPay, +spent]];
            } else {
              this.paymentChartData = [[100, 0]];
              this.paymentChartColors = [
                {
                  backgroundColor: ['#cccccc']
                }
              ];
            }
          }
        });
    }
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
