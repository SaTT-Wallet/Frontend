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
import { Observable, Subject, forkJoin } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  skipWhile,
  take,
  takeUntil
} from 'rxjs/operators';
import { DatePipe, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { Store } from '@ngrx/store';
import { selectCryptoList } from '@app/wallet/store/selectors/crypto-info.selectors';

import * as CryptoInfoActions from '../../store/actions/crypto-info.actions';
import { SharedDataService } from '@app/shared/service/SharedDataService';
import * as CryptoActionsList from '../../../core/store/crypto-prices/actions/crypto.actions';
import { selectCryptoPriceList } from '@app/core/store/crypto-prices/selectors/crypto.selectors';

type NetworkTranslations = {
  [key: string]: string;
};

@Component({
  selector: 'app-crypto-info',
  templateUrl: './crypto-info.component.html',
  styleUrls: ['./crypto-info.component.scss']
})
export class CryptoInfoComponent implements OnInit, AfterViewInit {
  cryptoSymbol: any;
  cryptoList$ = this.walletFacade.cryptoList$;
  cryptoListinfo$: Observable<any> | undefined;

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
  languageSelected: string = '';
  private isDestroyed = new Subject();
  fully_diluted: any;
  id_crypto: any;
  crypto_network: any;

  networkTranslations: NetworkTranslations = {
    Ethereum: 'ERC20',
    'BNB Smart Chain (BEP20)': 'ERC20',
    Polygon: 'POLYGON',
    Tron20: 'TRON'
  };

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
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private sharedDataService: SharedDataService
  ) {}
  state = {
    current: 'black'
  };
  selectedPeriod: string = 'ALL';
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
  CryptoUrl!: string;
  cryptoDetails: any;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.cryptoSymbol = this.route.snapshot.queryParamMap.get('crypto');
    this.cryptoDetails = this.sharedDataService.getCryptoDetails();

    if (this.cryptoDetails.length === 0) {
      this.store.dispatch(CryptoActionsList.fetchCryptoPriceList());
      this.store
        .select(selectCryptoPriceList)
        .pipe(
          takeUntil(this.isDestroyed),
          map((response: any) => {
            if (response && response.data) {
              return response.data;
            } else {
              return null;
            }
          })
        )
        .subscribe((data: any) => {
          if (data) {
            this.cryptoDetails = data;
            this.hadnelAllCrypto();
          }
        });
    } else this.hadnelAllCrypto();
  }

  public hadnelAllCrypto() {
    this.marketCap = this.showNumbersRule.transform(
      this.cryptoDetails[this.cryptoSymbol].market_cap
    );
    this.volume24h = this.showNumbersRule.transform(
      this.cryptoDetails[this.cryptoSymbol].volume_24h,
      true
    );
    this.disableBtn =
      (this.translateNetwork(this.cryptoDetails[this.cryptoSymbol].network) ===
        null &&
        this.cryptoSymbol !== 'BTC') ||
      ''
        ? true
        : false;
    this.crypto_network = this.cryptoDetails[this.cryptoSymbol].network;
    this.circulatingSupply = this.showNumbersRule.transform(
      this.cryptoDetails[this.cryptoSymbol].circulating_supply,
      true
    );
    this.fully_diluted = this.showNumbersRule.transform(
      this.cryptoDetails[this.cryptoSymbol].fully_diluted,
      true
    );
    this.cryptoPrice = this.showNumbersRule.transform(
      this.cryptoDetails[this.cryptoSymbol].price,
      true
    );

    this.id_crypto = this.cryptoDetails[this.cryptoSymbol].id;
    this.CryptoUrl = this.cryptoDetails[this.cryptoSymbol].urls[0];
    this.marketCapChange =
      this.cryptoDetails[this.cryptoSymbol].percent_change_24h;
    this.cryptoImgUrl = this.cryptoDetails[this.cryptoSymbol].logo;
    this.cryptoDescription = this.cryptoDetails[this.cryptoSymbol].description;
    this.cryptoName = this.cryptoDetails[this.cryptoSymbol].name;
    this.volume24hChange =
      this.cryptoDetails[this.cryptoSymbol].volume_change_24h;

    this.handleCryptoList(this.cryptoDetails[this.cryptoSymbol].id, 'ALL');
  }

  public handleCryptoList(id: any, range: string): void {
    this.selectedPeriod = range;

    this.cryptoInfoService.getCharts(id, range).subscribe((res: any) => {
      this.drawChart(res.data);
    });
  }

  public translateNetwork(network: string): string {
    if (this.networkTranslations[network]) {
      return this.networkTranslations[network];
    }
    return network;
  }

  private drawChart(res: any) {
    const chartData = Object.keys(res).map((timestamp) => ({
      x: parseInt(timestamp, 10) * 1000,
      y: res[timestamp].v[0]
    }));

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
          data: chartData // Use the parsed data for the chart series
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

  goToBuy(id: any, network: any) {
    if (id === 'SATT' && network === 'ERC20') {
      id = 'SATT-ERC20';
    }
    if (id === 'SATT' && network === 'BEP20') {
      id = 'SATT-SC';
    }

    const networkParam = id === 'BTC' ? 'BTC' : this.translateNetwork(network);

    this.router.navigate(['/wallet/buy-token'], {
      queryParams: { id: id, network: networkParam },
      relativeTo: this.activatedRoute
    });
  }

  goTosend(id: any, network: any) {
    if (id === 'SATT' && network === 'BEP20') {
      id = 'SATTBEP20';
    }

    const networkParam = id === 'BTC' ? 'BTC' : this.translateNetwork(network);
    this.router.navigate(['/wallet/send'], {
      queryParams: { id: id, network: networkParam },
      relativeTo: this.activatedRoute
    });
  }

  goTorecieve(id: any, network: any) {
    const networkParam = id === 'BTC' ? 'BTC' : this.translateNetwork(network);

    this.router.navigate(['/wallet/receive'], {
      queryParams: { id: id, network: networkParam },
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
