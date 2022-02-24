import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListTokens } from '@app/config/atn.config';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dropdown-crypto-network',
  templateUrl: './dropdown-crypto-network.component.html',
  styleUrls: ['./dropdown-crypto-network.component.scss']
})
export class DropdownCryptoNetworkComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Output() selectedCrypto: EventEmitter<any> = new EventEmitter();
  selectedNetworkValue: string = 'ERC20';
  cryptoList$ = this.walletFacade.cryptoList$;
  dataList: any = [];
  defaultcurr: any;
  defaultcurrbep: any;
  defaultcurrbtc: any;
  cryptoName: any;
  cryptoPicName: string = 'SATT';
  cryptoSymbol: string = 'SATT';
  token: any;
  networkList: Array<{ network: string }>;
  cryptoDetails: any;
  private onDestoy$ = new Subject();
  @Input() cryptoFromComponent: any;
  isAddedToken: boolean = false;
  routerSub: any;
  isCryptoRouter: boolean = true;
  constructor(
    private walletFacade: WalletFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.networkList = [
      { network: 'BEP20' },
      { network: 'ERC20' },
      { network: 'BTC' }
    ];
  }

  ngOnInit(): void {
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((p: any) => {
        if (p.id) {
          this.isCryptoRouter = true;
          this.cryptoPicName = p.id;
          this.cryptoSymbol = p.id;
          this.selectedNetworkValue = p.network;
        } else {
          this.isCryptoRouter = false;
          // this.cryptoPicName = 'SATT';
          // this.cryptoSymbol = 'SATT';
          // this.selectedNetworkValue = 'ERC20';
        }
      });
    this.getusercrypto();
    this.defaultcurr = ListTokens['SATT'].name;
    this.defaultcurrbep = ListTokens['SATTBEP20'].name;
    this.defaultcurrbtc = ListTokens['BTC'].name;
  }
  //get list of crypto for user
  getusercrypto() {
    this.cryptoList$
      .pipe(
        filter((data) => data.length !== 0),
        takeUntil(this.onDestoy$)
      )
      .subscribe((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.dataList = data;
        /*----emit default cryto to receive compoent */
        this.dataList?.forEach((crypto: any) => {
          /**------ */
          crypto.price = this.filterAmount(crypto.price + '');

          crypto.quantity = this.filterAmount(crypto.quantity + '');
          crypto.type =
            crypto.network ?? ListTokens[crypto.symbol].type.toUpperCase();
          crypto.undername2 = crypto.undername2 ?? 'indispo';
          crypto.undername = crypto.undername ?? 'indispo';
          crypto.typetab = crypto.type;
          crypto.contrat = crypto.AddedToken || '';

          if (crypto.symbol === 'BTC') {
            crypto.typetab = 'BTC';
          }
          if (this.isCryptoRouter) {
            if (crypto.symbol === this.cryptoSymbol) {
              this.token = crypto.AddedToken;
              if (crypto.AddedToken) {
                if (crypto.picUrl) {
                  this.cryptoPicName = crypto.picUrl;
                } else {
                  this.cryptoPicName = crypto.undername2;
                }
              }

              if (crypto.symbol === 'SATT' || crypto.symbol === 'SATTBEP20') {
                if (crypto.network === this.selectedNetworkValue) {
                  this.selectedCrypto.emit(crypto);
                }
              } else {
                this.selectedCrypto.emit(crypto);
              }
            }
          } else if (!this.cryptoFromComponent) {
            if (crypto.symbol === 'SATT') {
              this.selectedCrypto.emit(crypto);
            }
          }
        });
      });
  }

  // fixing crypto decimals to 9
  filterAmount(input: any, nbre: any = 10) {
    if (input) {
      var out = input;
      let size = input.length;
      let toAdd = parseInt(nbre) - parseInt(size);

      if (input === 0) {
        toAdd--;
      }
      if (toAdd > 0) {
        if (input.includes('.')) {
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        } else {
          out += '.';
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        }
      } else if (toAdd < 0) {
        if (input.includes('.')) {
          if (input.split('.')[0].length > nbre) {
            out = input.substring(0, nbre);
          } else {
            out = input.substring(0, nbre);
            if (out[nbre - 1] === '.') {
              out = input.substring(0, nbre - 1);
            }
          }
        }
      }
      return out;
    } else {
      return '-';
    }
  }
  trackById(index: number, crypto: any) {
    return crypto;
  }
  trackById2(index: number, n: any) {
    return n;
  }
  //select value from the dropdown

  selectCryptoValue(
    name: string,
    picName: string,
    symbol: string,
    AddedToken: string,
    crypto: any
  ) {
    if (this.isCryptoRouter) {
      this.isCryptoRouter = false;
      this.router.navigate([], { queryParams: [] });
    }
    this.cryptoName = name;
    if (AddedToken) {
      this.cryptoPicName = crypto.picUrl;
    } else {
      this.cryptoPicName = picName;
    }
    this.cryptoSymbol = symbol;
    this.token = AddedToken;
    this.cryptoDetails = crypto;
    this.selectedCrypto.emit(crypto);
  }

  selectNetworkValue(network: string) {
    if (this.isCryptoRouter) {
      this.isCryptoRouter = false;
      this.router.navigate([], { queryParams: [] });
    }
    this.token = '';
    this.selectedNetworkValue = network;
    if (network === 'BEP20') {
      this.cryptoPicName = 'SATT';
      this.cryptoSymbol = this.defaultcurrbep;
      this.cryptoName = this.defaultcurrbep;
      this.cryptoDetails = 'SATTBEP20';
    } else if (network === 'ERC20') {
      this.cryptoSymbol = 'SATT';
      this.cryptoName = this.defaultcurr;
      this.cryptoPicName = this.defaultcurr;
      this.cryptoDetails = 'SATT';
    } else if (network === 'BTC') {
      this.cryptoSymbol = this.defaultcurrbtc;
      this.cryptoName = this.defaultcurrbtc;
      this.cryptoPicName = this.defaultcurrbtc;
      this.cryptoDetails = 'BTC';
    }
    this.dataList.forEach((crypto: any) => {
      if (crypto.symbol === this.cryptoDetails) {
        this.selectedCrypto.emit(crypto);
      }
    });
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
  ngOnChanges() {
    if (this.cryptoFromComponent) {
      this.isCryptoRouter = false;
      if (this.cryptoFromComponent[0].AddedToken) {
        this.isAddedToken = true;
        this.token = this.cryptoFromComponent[0].AddedToken;
        this.cryptoPicName = this.cryptoFromComponent[0].picUrl;
      } else {
        this.token = '';
        this.isAddedToken = false;
        this.cryptoPicName = this.cryptoFromComponent[0].undername2;
      }
      this.cryptoSymbol = this.cryptoFromComponent[0].symbol;
      this.selectedNetworkValue = this.cryptoFromComponent[0].network;
    }
  }
}
