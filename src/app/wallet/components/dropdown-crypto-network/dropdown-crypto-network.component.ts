import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListTokens } from '@app/config/atn.config';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  @ViewChild('tokenModal', { static: false })
  private tokenModal!: TemplateRef<any>;
  @Input() selectedNetworkValue: string = 'ERC20';
  cryptoPicName: string = 'SATT';
  cryptoSymbol: string = 'SATT';
  cryptoList$ = this.walletFacade.cryptoList$;
  cryptoListApi: any = [];
  dataList: any = [];
  defaultcurr: any;
  defaultcurrbtt: any;
  quantity: any = 0;
  tokenSearch = new FormControl('');
  @Input() cryptoSymbolCampaign: string = '';
  @Input() cryptoImageCamapign: string = '';
  // @Input() selectedToken: any = [];
  @Output() tokenSelected = new EventEmitter<any>();
  campaignCryptoList: any = [];
  filterList: any = [];
  userCrypto: any = [];
  smartContract: string = '';
  tokenDecimal: number = 0;
  tokenSymbol: string = '';
  tokenNotFound: boolean = false;
  showWarning: boolean = true;
  showSearchNewTokenContainer: boolean = false;
  @Input() res!: any;
  defaultcurrbep: any;
  defaultcurrbtc: any;
  selectedToken: any;
  customTokenNotFound: boolean = false;
  cryptoName: any;
  token: any;
  networkList: Array<{ network: string }>;
  cryptoDetails: any;
  private onDestoy$ = new Subject();
  @Input() cryptoFromComponent: any;
  @Input()
  cryptoFromDraft: any;
  isAddedToken: boolean = false;
  routerSub: any;
  isCryptoRouter: boolean = true;
  cryptoToDropdown: any;
  addedTokenNopic: boolean = false;
  private firstEmit = false;
  cryptoList: any = [];
  defaultcurrpolygon: any;
  defaultcurrtron: any;

  @ViewChild('selectToken', { static: false })
  public selectTokenModal!: TemplateRef<any>;
  tokenList: any = [];

  reset(e: any) {
    e.target.value = '';
    this.filterList = this.cryptoList;
    this.showSearchNewTokenContainer = false;
    this.showWarning = true;
    this.tokenNotFound = false;
  }
  errorNetwork() {
    this.selectedNetworkValue = 'ERC20';
    this.selectNetworkValue(this.selectedNetworkValue);
  }
  getCryptoImage() {
    let logo = '';
    if (!!this.res) {
      const result = Object.keys(this.res.data);
      result.forEach((key) => {
        if (key === this.cryptoSymbolCampaign) {
          logo = this.res.data[key].logo;
        }
      });
    }
    return logo;
  }


  selectCustomToken() {
    console.log('testtt')
    let pattern = /^0x[a-fA-F0-9]{40}$|^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$|T[A-Za-z1-9]{33}$/;
    if(pattern.test(this.smartContract)) {
      console.log('in if')
      this.walletFacade.checkToken(this.selectedNetworkValue, this.smartContract).subscribe((res:any) => {
        if(res.message === "Token found") {
          let crypto = {
            contract: this.smartContract,
            key: res.data.symbol,
            value: {
              AddedToken: true,
              price: 0,
              name: res.data.symbol
            }
          }
          this.tokenToSelect(crypto);
        }
      })
    }
   
  }

  searchToken(e: any) {
    if (e.target.value.length > 0) {
      this.filterList = [];
      this.campaignCryptoList.forEach((crypto: any) => {
        if (
          crypto.value.name
            .toString()
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) // crypto.symbol.includes(e.target.value)
        )
          this.filterList.push(crypto);
      });
      if (this.filterList.length === 0) this.tokenNotFound = true;
      else this.tokenNotFound = false;
    } else this.filterList = this.campaignCryptoList;
  }

  searchPersonalizedToken() {
    this.showSearchNewTokenContainer = !this.showSearchNewTokenContainer;
    this.showWarning = false;
  }

  tokenToSelect(crypto: any) {
    console.log({crypto})
    this.walletFacade
      .getBalanceByToken({
        network: this.selectedNetworkValue.toLowerCase(),
        walletAddress: window.localStorage.getItem('wallet_id'),
        smartContract: crypto.contract, // crypto.contract TO DO
        isNative:
          crypto.contract === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ||
          crypto.contract === '0' ||
          crypto.contract === '0x0000000000000000000000000000000000001010'
            ? true
            : false // TO DO
      })
      .subscribe(
        (res: any) => {
          this.quantity = res.data;
          console.log({crypto})
          this.cryptoImageCamapign = crypto.value.logo;
          this.cryptoSymbolCampaign = crypto.key;
          console.log({symbol: this.cryptoSymbolCampaign})
          this.closeTokenModal(this.tokenModal);
          this.selectCryptoValue(
            crypto.name,
            crypto?.undername2,
            crypto?.symbol,
            !!crypto.AddedToken ? crypto.AddedToken : true,
            {
              AddedToken: !!crypto.value.AddedToken ? crypto.AddedToken : true,
              balance: 0,
              contract: crypto.contract,
              contrat: '',
              decimal: 18,
              key: crypto.key,
              network: this.selectedNetworkValue,
              picUrl: true,
              price: crypto.value.price,
              quantity: this.quantity,
              symbol: crypto.key,
              total_balance: this.quantity * crypto.value.price,
              type: this.selectedNetworkValue,
              typetab: this.selectedNetworkValue,
              undername: crypto.value.name,
              undername2: crypto.value.name,
              variation: 0
            }
          );
        },
        (err: any) => {
          this.quantity = 0;
          this.cryptoImageCamapign = crypto.value.logo;
          this.cryptoSymbolCampaign = crypto.key;
          //this.selectNetworkValue = crypto.network;
          this.closeTokenModal(this.tokenModal);
          this.selectCryptoValue(
            crypto.name,
            crypto?.undername2,
            crypto?.symbol,
            !!crypto.AddedToken ? crypto.AddedToken : true,
            {
              AddedToken: !!crypto.value.AddedToken ? crypto.AddedToken : true,
              balance: 0,
              contract: crypto.contract,
              contrat: '',
              decimal: 18,
              key: crypto.key,
              network: this.selectedNetworkValue,
              picUrl: true,
              price: crypto.value.price,
              quantity: this.quantity,
              symbol: crypto.key,
              total_balance: this.quantity * crypto.value.price,
              type: this.selectedNetworkValue,
              typetab: this.selectedNetworkValue,
              undername: crypto.value.name,
              undername2: crypto.value.name,
              variation: 0
            }
          );
        }
      );
  }

  getUserCrypto() {
    this.walletFacade.cryptoList$.subscribe((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.userCrypto = data;
    });
  }

  constructor(
    public modalService: NgbModal,
    private walletFacade: WalletFacadeService,
    private route: ActivatedRoute,
    public router: Router,
    private cdref: ChangeDetectorRef,

    private Fetchservice: CryptofetchServiceService
  ) {
    this.networkList = [
      { network: 'BEP20' },
      { network: 'ERC20' },
      { network: 'POLYGON' },
      { network: 'BTTC' },
      { network: 'BTC' },
      { network: 'TRON' }
    ];
  }

  createTokenModal() {
    if (this.router.url.startsWith('/campaign')) {
      this.modalService.open(this.tokenModal, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  closeTokenModal(content: any) {
    this.modalService.dismissAll(content);
  }

  ngOnInit(): void {
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((p: any) => {
        if (this.router.url.startsWith('/campaign')) {
        } else {
          if (p.id) {
            this.firstEmit = true;
            this.isCryptoRouter = true;
            if ((this.cryptoPicName = 'SATTPOLYGON')) {
              this.cryptoPicName = 'SATT';
            }

            this.cryptoSymbol = p.id;
            this.selectedNetworkValue = p.network;
            if (p.pic === 'false') {
              this.addedTokenNopic = true;
            }
          } else {
            this.isCryptoRouter = false;
            // this.cryptoPicName = 'SATT';
            // this.cryptoSymbol = 'SATT';
            // this.selectedNetworkValue = 'ERC20';
          }
        }
      });
    !this.router.url.startsWith('/campaigns') && this.getusercrypto();
    this.defaultcurr = ListTokens['SATT'].name;
    this.defaultcurrbep = ListTokens['SATTBEP20'].name;
    this.defaultcurrbtc = ListTokens['BTC'].name;
    this.defaultcurrpolygon = ListTokens['MATIC'].name;
    this.defaultcurrbtt = ListTokens['BTT'].name;
    this.defaultcurrtron = ListTokens['TRX'].name;
  }
  openModal(content: any) {
    this.modalService.open(content);
  }
  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

  selectToken(content: any) {
    if (this.router.url.startsWith('/campaign')) {
      this.campaignCryptoList = [];
      const result = Object.keys(this.res.data);
      result.forEach((key) => {
        typeof this.res.data[key].networkSupported != 'string' &&
          this.res.data[key].networkSupported.forEach((value: any) => {
            if (
              this.selectedNetworkValue === 'ERC20' &&
              value.platform.name === 'Ethereum'
            ) {
              this.campaignCryptoList.push({
                key,
                value: this.res.data[key],
                contract: value.contract_address
              });
            } else {
              value.platform.name
                .toString()
                .toLowerCase()
                .includes(this.selectedNetworkValue.toString().toLowerCase()) &&
                //  &&
                // !this.campaignCryptoList.find(
                //   (e: any) => e.name === value.data[key].name
                // )
                this.campaignCryptoList.push({
                  key,
                  value: this.res.data[key],
                  contract: value.contract_address
                });
            }
          });
        this.filterList = this.campaignCryptoList;
      });
      this.openModal(content);
    }
  }

  searchCustomToken(event: any) {
    let pattern = /^0x[a-fA-F0-9]{40}$|^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$|T[A-Za-z1-9]{33}$/;
    if(pattern.test(event.target.value)) {
      this.smartContract = event.target.value;
      this.walletFacade.checkToken(this.selectedNetworkValue, event.target.value).subscribe((res:any) => {
        if(res.message === "Token found") {
          this.customTokenNotFound = false;
          this.tokenDecimal = res.data.decimals;
          this.tokenSymbol = res.data.symbol; 
          let crypto = {
            contract: this.smartContract,
            key: res.data.symbol,
            value: {
              AddedToken: true,
              price: 0,
              name: res.data.symbol
            }
          }
          this.tokenToSelect(crypto);
        } else this.customTokenNotFound = true;
      })
    }
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
        this.dataList = [
          ...this.dataList.filter(
            (data: any) =>
              data.symbol !== 'SATTPOLYGON' &&
              data.symbol !== 'SATTBTT' &&
              data.symbol !== 'SATTTRON'
          )
        ];
        /*----emit default cryto to receive compoent */
        this.dataList?.forEach((crypto: any) => {
          if (!this.cryptoFromDraft && !this.firstEmit) {
            if (crypto.symbol === 'SATT') {
              // this.selectedCrypto.emit(crypto);
              this.firstEmit = true;
            }
          }

          if (
            crypto &&
            this.cryptoFromDraft &&
            crypto.symbol === this.cryptoFromDraft
          ) {
            this.cryptoFromComponent = [crypto];
            // console.log({ hopa: this.cryptoFromComponent });
            this.cryptoSymbol = this.cryptoFromComponent[0].symbol;

            this.selectedNetworkValue = this.cryptoFromComponent[0].network;
            if (this.cryptoFromComponent[0].AddedToken) {
              this.cryptoPicName = this.cryptoFromComponent[0].picUrl;
            } else {
              this.cryptoPicName = this.cryptoFromComponent[0].undername2;
            }
            if (!this.router.url.startsWith('/campaign'))
              this.selectedCrypto.emit(crypto);
          }
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
                  if (!this.router.url.startsWith('/campaign'))
                    this.selectedCrypto.emit(crypto);
                }
              } else {
                if (!this.router.url.startsWith('/campaign'))
                  this.selectedCrypto.emit(crypto);
              }
            }
          }
          // else if (!this.cryptoFromComponent) {
          //   if (crypto.symbol === 'SATT') {
          //     this.selectedCrypto.emit(crypto);
          //   }
          // }
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
    this.firstEmit = true;
    if (this.isCryptoRouter) {
      this.isCryptoRouter = false;
      this.router.navigate([], { queryParams: [] });
    }
    this.cryptoName = name;
    if (AddedToken) {
      if (crypto.picUrl === false) {
        this.addedTokenNopic = true;
        this.cryptoPicName = crypto.undername2;
      } else {
        this.cryptoPicName = crypto.picUrl;
        this.addedTokenNopic = false;
      }
    } else {
      this.cryptoPicName = picName;
    }
    this.cryptoSymbol = symbol;
    this.token = AddedToken;
    this.cryptoDetails = crypto;
    this.selectedCrypto.emit(crypto);
    this.cdref.detectChanges();
  }

  selectNetworkValue(network: string) {
    this.firstEmit = true;
    if (this.isCryptoRouter) {
      this.isCryptoRouter = false;
      this.router.navigate([], { queryParams: [] });
    }
    this.token = '';
    this.selectedNetworkValue = network;
    if (this.router.url.startsWith('/campaign')) {
      this.campaignCryptoList = [];
      const result = Object.keys(this.res.data);
      result.forEach((key) => {
        typeof this.res.data[key].networkSupported != 'string' &&
          this.res.data[key].networkSupported.forEach((value: any) => {
            if (
              this.selectedNetworkValue === 'ERC20' &&
              value.platform.name === 'Ethereum'
            ) {
              this.campaignCryptoList.push({
                key,
                value: this.res.data[key],
                contract: value.contract_address
              });
            } else {
              value.platform.name
                .toString()
                .toLowerCase()
                .includes(this.selectedNetworkValue.toString().toLowerCase()) &&
                // !this.campaignCryptoList.find(
                //   (e: any) => e.name === value.data[key].name
                // ) &&
                this.campaignCryptoList.push({
                  key,
                  value: this.res.data[key],
                  contract: value.contract_address
                });
            }
          });
        this.filterList = this.campaignCryptoList;
      });
      this.tokenToSelect(this.campaignCryptoList[0]);
    } else {
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
      } else if (network === 'POLYGON') {
        this.cryptoSymbol = 'MATIC';
        this.cryptoName = this.defaultcurr;
        this.cryptoPicName = this.defaultcurr;
        this.cryptoDetails = 'MATIC';
      } else if (network === 'BTTC') {
        this.cryptoSymbol = 'BTT';
        this.cryptoName = this.defaultcurrbtt;
        this.cryptoPicName = this.defaultcurrbtt;
        this.cryptoDetails = 'BTT';
      } else if (network === 'TRON') {
        this.cryptoSymbol = 'TRX';
        this.cryptoName = this.defaultcurrtron;
        this.cryptoPicName = this.defaultcurrtron;
        this.cryptoDetails = 'TRX';
      }

      this.dataList.forEach((crypto: any) => {
        if (crypto.symbol === this.cryptoDetails) {
          if (!this.router.url.startsWith('/campaign'))
            this.selectedCrypto.emit(crypto);
        }
      });
      this.cdref.detectChanges();
    }
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cryptoFromDraft && this.router.url.includes('edit')) {
      if (this.cryptoFromDraft) {
        if (this.router.url.startsWith('/campaign')) {
          //this.selectedNetworkValue = 'BEP20';
          this.cryptoSymbolCampaign = this.cryptoFromDraft;
          this.cdref.detectChanges();
        } else {
          this.dataList.forEach((crypto: any) => {
            if (crypto.symbol === this.cryptoFromDraft) {
              this.cryptoFromComponent = [crypto];
            }
          });
          if (this.cryptoFromComponent) {
            this.isCryptoRouter = false;
            this.cryptoSymbol = this.cryptoFromComponent[0].symbol;
            this.selectedNetworkValue = this.cryptoFromComponent[0].network;
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
            this.cdref.detectChanges();
          }
        }
      }
    } else {
      if (this.cryptoFromComponent) {
        this.isCryptoRouter = false;
        this.cryptoSymbol = this.cryptoFromComponent.symbol;
        this.selectedNetworkValue = this.cryptoFromComponent.network;
        if (this.cryptoFromComponent.AddedToken) {
          this.isAddedToken = true;
          this.token = this.cryptoFromComponent.AddedToken;
          this.cryptoPicName = this.cryptoFromComponent.picUrl;
        } else {
          this.token = '';
          this.isAddedToken = false;
          this.cryptoPicName = this.cryptoFromComponent.undername2;
        }
        this.cryptoSymbol = this.cryptoFromComponent.symbol;
        this.selectedNetworkValue = this.cryptoFromComponent.network;
        this.cdref.detectChanges();
      }
    }
  }
}
