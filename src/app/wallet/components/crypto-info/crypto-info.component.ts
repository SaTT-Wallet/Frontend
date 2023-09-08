import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { ShowNumbersRule } from '@shared/pipes/showNumbersRule';
import 'assets/js/trading-view.js';
import { CryptoInfoService } from '@core/services/crypto-info.service';
import { Chart } from 'angular-highcharts';
//declare var tradingView: any;
import * as Highcharts from 'highcharts';
// import { doc } from 'prettier';
//import line = doc.builders.line;
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DatePipe, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

@Component({
  selector: 'app-crypto-info',
  templateUrl: './crypto-info.component.html',
  styleUrls: ['./crypto-info.component.scss']
})
export class CryptoInfoComponent implements OnInit, AfterViewInit {
  cryptoSymbol: any;
  cryptoList$ = this.walletFacade.cryptoList$;
  crypto: any;
  data = [];
  chart: any;
  cryptoDescription: any;
  cryptoName: any;
  cryptoNetwork: any;
  cryptoEtheriumContract: any;
  cryptoBinanceContract: any;
  cryptoPrice: any;
  loading = true;
  disableBtn: boolean = false;
  languageSelected : string ="";

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private walletFacade: WalletFacadeService,
    public showNumbersRule: ShowNumbersRule,
    private cryptoInfoService: CryptoInfoService,
    private datePipe: DatePipe,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private activatedRoute: ActivatedRoute
  ) {}
  state = {
    current: 'black'
  };
  selectedPeriod: string = 'max';
  dataY = [1, 10, 20, 30];
  marketCap: any;
  marketCapFD: any;
  marketCapChange: any;
  marketCapFDChange: any;
  volume24h: any;
  volume24hChange: any;
  circulatingSupply: any;
  circulatingSupplyChange: any;
  cryptoImgUrl: any;
  isLoading = true;
  CryptoUrl!:string ;



  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.cryptoSymbol = this.route.snapshot.queryParamMap.get('crypto');
    
    
    this.cryptoInfoService
      .listIdToken()
      .pipe(
        map((res: any) => {
          return res.filter(
            (element: any) => element.symbol === this.cryptoSymbol.toLowerCase()
          )[0];
        })
      )
      .pipe(
        mergeMap((res: any) => {
          let todayDate = new Date();
          let yesterdayDate = new Date();
          yesterdayDate.setDate(todayDate.getDate() - 1);
          const todayDateFormatted = this.datePipe.transform(
            todayDate,
            'dd-MM-yyyy'
          );
          const yesterdayDateFormatted = this.datePipe.transform(
            yesterdayDate,
            'dd-MM-yyyy'
          );
          let arrayOfObs = [];
          arrayOfObs.push(
            this.cryptoInfoService
              .getCryptoInfoById(res?.id, 'usd')
              .pipe(map((res: any) => res[0]))
          );
          arrayOfObs.push(
            this.cryptoInfoService.tokenMarketHistory(
              res.id,
              todayDateFormatted + ''
            )
          );
          arrayOfObs.push(
            this.cryptoInfoService.tokenMarketHistory(
              res.id,
              yesterdayDateFormatted + ''
            )
          );
          arrayOfObs.push(
            this.cryptoInfoService.marketChartToken(res.id, 'usd', 'max')
          );
          arrayOfObs.push(this.cryptoInfoService.generalTokenInfos(res.id));
          
          
          return forkJoin(arrayOfObs);
        })
      )
      .subscribe((data: any) => {
      
        this.CryptoUrl = data[4].links.homepage[0];
        this.isLoading = false;
        this.data = data[3].prices;
        this.fillingMarketDatas(data);
        this.drawChart();
        let element = this.document.getElementById('crypto-description');
        //@ts-ignore
        element.innerHTML = data[4].description.en;
      });

    this.cryptoList$.subscribe((res) => {
      this.crypto = res.filter(
        (element: any) => element.symbol === this.cryptoSymbol
      )[0];
      if (!this.crypto) {
        this.disableBtn = true;
        return;
      } else {
        this.disableBtn = false;
      }
    });
    this.translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocale()) {
      // @ts-ignore
      this.languageSelected = this.tokenStorageService.getLocale();
      this.translate.setDefaultLang(this.languageSelected);
      this.translate.use(this.languageSelected);
    } else {
      this.tokenStorageService.setLocalLang('en');
      this.languageSelected = 'en';
      this.translate.setDefaultLang('en');
      this.translate.use(this.languageSelected);
    }
  }

  private drawChart() {
    this.chart = new Chart({
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      chart: {
        events: {
          click: (event: any) => {
            let elementToDelete = document.getElementById('parentSpan');
            if (!!elementToDelete) {
              //@ts-ignore
              elementToDelete.parentNode.removeChild(elementToDelete);
            }
            //@ts-ignore
            event.yAxis[0].axis.chart.yAxis[0].removePlotLine('first');
            //@ts-ignore
            event.yAxis[0].axis.chart.yAxis[0].addPlotLine({
              color: '#00CC9E',
              dashStyle: 'Dash',
              width: 2,
              value: event.yAxis[0].value,
              zIndex: 5,
              id: 'first'
            });
            // let tick = document.getElementsByClassName(
            //   'highcharts-plot-lines-5'
            // )[0];

            let span = document.createElement('span');
            let innerSpan = document.createElement('span');
            // @ts-ignore
            span.style.position = 'absolute';
            span.style.fontFamily = 'Lucida Grande';
            span.style.marginLeft = '0px';
            span.style.marginTop = '0px';
            span.style.left = parseFloat(window.innerWidth * 0.685 + '') + 'px';
            span.style.top = event.chartY - 8 + 'px';
            span.style.color = 'rgb(102, 102, 102)';
            span.style.cursor = 'pointer';
            span.style.textOverflow = 'clip';
            span.style.opacity = '1';
            span.style.zIndex = '9999999';
            span.style.background = '#00CC9E';
            span.style.borderRadius = '5px';
            span.id = 'parentSpan';

            innerSpan.innerHTML =
              parseFloat(event.yAxis[0].value + '').toFixed(2) + '$';
            innerSpan.style.fontStyle = 'normal';
            innerSpan.style.fontFamily = 'Poppins';
            innerSpan.style.padding = '0.25rem 0.5rem';
            innerSpan.style.width = '100px';
            innerSpan.style.height = '70px';
            innerSpan.style.fontWeight = '500';
            innerSpan.style.fontSize = '12px';
            innerSpan.style.color = 'white';
            span.appendChild(innerSpan);
            let yAxis = document.getElementsByClassName(
              'highcharts-axis-labels'
            )[2] as HTMLElement;
            yAxis.appendChild(span);
          }
        },
        zoomType: 'x',
        width: parseInt(
          window.innerWidth > 768
            ? window.innerWidth * 0.73 + ''
            : window.innerWidth + 15 + ''
        )
      },

      xAxis: {
        type: 'datetime'
      },
      yAxis: [
        {
          visible: window.innerWidth > 768,
          title: {
            text: ''
          },
          zoomEnabled: true,
          labels: {
            useHTML: true,
            //@ts-ignore
            formatter: (item: any) => {
              if (this.state.current === item.value) {
                return `<span style="color: black; background: #00CC9E; border-radius: 5px; padding: 0.25rem 0.5rem;font-family: Poppins;
font-style: normal; width: 100px; height: 70px;
font-weight: 500;color: white;
font-size: 12px;">${item.value.toFixed(2) + '$'}</span>`;
              } else {
                return `<span style="color: black; padding: 0.25rem 0.5rem;font-family: Poppins;
font-style: normal; width: 100px; height: 70px;
font-weight: 500;
font-size: 12px;">${item.value + '$'}</span>`;
              }
            }
          },
          gridLineWidth: 0,
          opposite: true
        }
      ],
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          label: {
            enabled: false
          },

          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, '#78e0c9'],
              [1, Highcharts.color('#78e0c9').setOpacity(0).get('rgba') + '']
            ]
          },
          marker: {
            enabled: false,
            radius: 2
          },
          lineWidth: 2,

          states: {
            hover: {
              lineWidth: 3
            }
          }
        },
        series: {
          marker: {
            enabled: false
          },
          color: '#00CC9E'
        }
      },

      series: [
        {
          type: 'area',
          data: this.data
        }
      ]
    });
    let element = this.document.getElementsByClassName(
      'crypto-info-body'
    )[0] as HTMLElement;
    element.style.width =
      window.innerWidth > 768
        ? window.innerWidth * 0.73 + 'px'
        : window.innerWidth + 'px';
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  private fillingMarketDatas(data: any) {
    this.cryptoImgUrl = data[0].image;
    this.cryptoName = data[4].name;
    this.cryptoPrice = data[0].current_price;
    this.cryptoNetwork = data[4].asset_platform_id;
    this.cryptoEtheriumContract = data[4]?.platforms?.ethereum;
    this.cryptoBinanceContract = data[4]?.platforms['binance-smart-chain'];
    this.marketCap = this.showNumbersRule.transform(data[0].market_cap, true);
    this.marketCapChange = data[0].market_cap_change_percentage_24h.toFixed(2);
    this.volume24h = this.showNumbersRule.transform(data[0].total_volume, true);
    this.circulatingSupply = this.showNumbersRule.transform(
      data[0].circulating_supply,
      true
    );
    this.circulatingSupplyChange = 90;
    this.marketCapFD = this.showNumbersRule.transform(
      data[0].fully_diluted_valuation,
      true
    );

    this.marketCapFDChange =
      data[0].market_cap_change_percentage_24h.toFixed(2);
    this.volume24hChange = (
      ((data[1].market_data.total_volume.usd -
        data[2].market_data.total_volume.usd) *
        100) /
      data[2].market_data.total_volume.usd
    ).toFixed(2);
  }

  filterChartByPeriod(period: any) {
    this.selectedPeriod = period;
    this.cryptoInfoService
      .listIdToken()
      .pipe(
        map((res: any) => {
          return res.filter(
            (element: any) => element.symbol === this.cryptoSymbol.toLowerCase()
          )[0];
        })
      )
      .pipe(
        mergeMap((res: any) => {
          return this.cryptoInfoService.marketChartToken(
            res.id,
            'usd',
            period
          );
        })
      )
      .subscribe((data: any) => {
        this.data = data.prices;
        this.drawChart();
      });
  }

  goToBuy(id: any, network: any) {
    if (id === 'SATT' && network === 'ERC20') {
      id = 'SATT-ERC20';
    }
    if (id === 'SATT' && network === 'BEP20') {
      id = 'SATT-SC';
    }
    this.router.navigate(['/wallet/buy-token'], {
      queryParams: { id: id, network: network },
      relativeTo: this.activatedRoute
    });
  }

  goTosend(id: any, network: any) {
    if (id === 'SATT' && network === 'BEP20') {
      id = 'SATTBEP20';
    }
    this.router.navigate(['/wallet/send'], {
      queryParams: { id: id, network: network },
      relativeTo: this.activatedRoute
    });
  }

  goTorecieve(id: any, network: any) {
    this.router.navigate(['/wallet/receive'], {
      queryParams: { id: id, network: network },
      relativeTo: this.activatedRoute
    });
  }

  openInBSCScan() {
    if (this.cryptoName === 'SaTT') {
      window.open(
        'https://bscscan.com/token/0x448BEE2d93Be708b54eE6353A7CC35C4933F1156',
        '_blank'
      );
    } else {
      window.open(
        'https://bscscan.com/token/' + this.cryptoBinanceContract,
        '_blank'
      );
    }
  }

  openInEtherscan() {
    window.open(
      'https://etherscan.io/token/' + this.cryptoEtheriumContract,
      '_blank'
    );
  }

  openInBitcoinOrg(cryptoUrl: string) {    
    window.open(cryptoUrl, '_blank');
  }
}
