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
import { environment as env } from './../../../../environments/environment';
import { Subject, of } from 'rxjs';
import { catchError, filter, takeUntil } from 'rxjs/operators';

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
  resultfilterList: any;
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
  loadingCustomToken: boolean = false;
  @ViewChild('selectToken', { static: false })
  public selectTokenModal!: TemplateRef<any>;
  tokenList: any = [];
  cryptoImageSearched: any;

  reset(e: any) {
    e.target.value = '';
    this.filterList = this.cryptoList;
    this.showSearchNewTokenContainer = false;
    this.showWarning = true;
    this.tokenNotFound = false;
  }
 
  getCryptoImage() {
    
    if (!this.res) {
      this.getCryptoList();
    }
  
    if (this.res) {
      const result = Object.keys(this.res);
  
      for (const key of result) {
        if (key === (this.cryptoSymbolCampaign === 'SATTBEP20' ? 'SATT' : this.cryptoSymbolCampaign)) {
          this.cryptoImageCamapign = this.res[key].logo
          return this.res[key].logo;
        }
      }
    }
  
    return ''; // Default logo if not found
  }


  selectCustomToken() {
    let pattern = /^0x[a-fA-F0-9]{40}$|^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$|T[A-Za-z1-9]{33}$/;
    if(pattern.test(this.smartContract)) {
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
            .includes(e.target.value.toLowerCase()) 
            || crypto.key.toString().toLowerCase().includes(e.target.value.toLowerCase())
        )
          this.filterList.push(crypto);
      });
      if (this.filterList.length === 0) {
        this.tokenNotFound = true;
        this.showWarning = true;
      }
      else this.tokenNotFound = false;
    } else this.filterList = this.campaignCryptoList;
  }

  searchPersonalizedToken() {
    this.showSearchNewTokenContainer = !this.showSearchNewTokenContainer;
    this.showWarning = false;
  }

  tokenToSelect(crypto: any) {
    this.walletFacade
      .getBalanceByToken({
        network: this.selectedNetworkValue.toLowerCase(),
        walletAddress: this.selectedNetworkValue === 'TRON' ? window.localStorage.getItem('tron-wallet') : window.localStorage.getItem('wallet_id'),
        smartContract: (this.selectedNetworkValue === 'ERC20' && crypto.key === 'SATT') ? env.addresses.smartContracts.SATT_TOKENERC20 :  ( (this.selectedNetworkValue === 'BEP20' && crypto.key === 'SATT') ? env.addresses.smartContracts.SATT_TOKENBEP20 :crypto.contract),
        isNative:
         ((crypto.key === 'ETH' && this.selectedNetworkValue === 'ERC20') || (crypto.key === 'BNB' && this.selectedNetworkValue === 'BEP20') || (crypto.key === 'BTT' && this.selectedNetworkValue === 'BTTC') || (crypto.key === 'TRX' && this.selectedNetworkValue === 'TRON') || (crypto.key === 'MATIC' && this.selectedNetworkValue === 'POLYGON'))
            ? true
            : false
      })
      .subscribe(
        (res: any) => {
         
            if(res?.name === "JsonWebTokenError") {
              this.expiredSession();
            } else {
              this.quantity = res.data;
           
            this.cryptoImageCamapign = crypto.value.logo;
            this.cryptoSymbolCampaign = crypto.key;
            this.closeTokenModal(this.tokenModal);
            this.selectCryptoValue(
              crypto.name,
              crypto?.undername2,
              crypto?.symbol,
              !!crypto.AddedToken ? crypto.AddedToken : true,
              {
                AddedToken: !!crypto.value.AddedToken ? crypto.AddedToken : true,
                balance: 0,
                contract: (this.selectedNetworkValue === 'ERC20' && crypto.key === 'SATT') ? env.addresses.smartContracts.SATT_TOKENERC20 :  ( (this.selectedNetworkValue === 'BEP20' && crypto.key === 'SATT') ? env.addresses.smartContracts.SATT_TOKENBEP20 :crypto.contract),
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
        
         
          
        },
        (err: any) => {
          this.quantity = 0;
          
          this.cryptoImageCamapign =
            crypto.value.logo || this.cryptoImageSearched;
          this.cryptoSymbolCampaign = crypto.key;
          this.closeTokenModal(this.tokenModal);
          this.selectCryptoValue(
            crypto.name,
            crypto?.undername2,
            crypto?.symbol,
            !!crypto.AddedToken ? crypto.AddedToken : true,
            {
              AddedToken: !!crypto.value.AddedToken ? crypto.AddedToken : true,
              balance: 0,
              contract: (this.selectedNetworkValue === 'ERC20' && crypto.key === 'SATT') ? env.addresses.smartContracts.SATT_TOKENERC20 :  ( (this.selectedNetworkValue === 'BEP20' && crypto.key === 'SATT') ? env.addresses.smartContracts.SATT_TOKENBEP20 :crypto.contract),
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
  expiredSession() {
    window.localStorage.clear();
    window.open(env.domainName + '/auth/login', '_self');
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
    this.getCryptoImage();
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
      
      //this.router.url.startsWith('/campaign') && this.getCryptoList();
     
    !this.router.url.startsWith('/campaigns') && this.getusercrypto();
    
    this.defaultcurr = ListTokens['SATT'].name;
    this.defaultcurrbep = ListTokens['SATTBEP20'].name;
    this.defaultcurrbtc = ListTokens['BTC'].name;
    this.defaultcurrpolygon = ListTokens['MATIC'].name;
    this.defaultcurrbtt = ListTokens['BTT'].name;
    this.defaultcurrtron = ListTokens['TRX'].name;
  }

  getCryptoList() {
    if(!this.res) {
      this.walletFacade.getCryptoPriceList().subscribe((res) => res = this.res.data);
    }
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
      this.filterList = [];
      this.tokenNotFound = false;
      this.showWarning = false;
      this.tokenSearch.setValue('');  
     
  const campaignCryptoSet = new Set();
  for(const key of Object.keys(this.res)) {
    const cryptoData = this.res[key];
    if(typeof cryptoData.networkSupported !== 'string') {
      for(const value of cryptoData.networkSupported) {
        if (
          this.selectedNetworkValue === 'ERC20' &&
          value.platform.name === 'Ethereum'
          ) {
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: value.contract_address
            });
          } else if(key === 'BNB' && this.selectedNetworkValue === 'BEP20') {
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: null
          })
          } else if(key === 'BTT' && this.selectedNetworkValue === 'BTTC') {
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: null
              }) 
          } else {
          value.platform.name
            .toString()
            .toLowerCase()
            .includes(this.selectedNetworkValue.toString().toLowerCase()) &&
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: value.contract_address
              });
            }
          }
        }
      }      
      this.campaignCryptoList = Array.from(campaignCryptoSet);
      this.campaignCryptoList = this.campaignCryptoList.filter((item:any, index:any, self:any) => {
        return index === self.findIndex((obj:any) => obj.key === item.key);
      });
      this.filterList = this.campaignCryptoList;

      const keysToDisplay = ['ETH', 'USDT', 'BNB', 'USDC', 'XRP', 'SATT'];
      this.resultfilterList = this.filterList.filter((item: { key: string; }) =>
        keysToDisplay.includes(item.key)
      );



      this.showSearchNewTokenContainer = false;
      this.openModal(content);
      }
  }

  searchCustomToken(event: any) {
    
    let pattern = /^0x[a-fA-F0-9]{40}$|^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$|T[A-Za-z1-9]{33}$/;
    if(pattern.test(event.target.value)) {
      this.loadingCustomToken = true;
      this.smartContract = event.target.value;
      this.walletFacade.checkToken(this.selectedNetworkValue, event.target.value).subscribe((res:any) => {
        if(res.message === "Token found") {
          this.customTokenNotFound = false;
          this.tokenDecimal = res.data.decimals;
          this.tokenSymbol = res.data.symbol; 
            this.cryptoImageSearched = res.data.logoimg;
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
          
        } else {
          this.customTokenNotFound = true;
          this.loadingCustomToken = false;
        };
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

      const campaignCryptoSet = new Set();
  for(const key of Object.keys(this.res)) {
    const cryptoData = this.res[key];
    if(typeof cryptoData.networkSupported !== 'string') {
      for(const value of cryptoData.networkSupported) {
        if (
          this.selectedNetworkValue === 'ERC20' &&
          value.platform.name === 'Ethereum'
          ) {
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: value.contract_address
            });
          } else if(key === 'BNB' && this.selectedNetworkValue === 'BEP20') {
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: null
          })
          } else if(key === 'BTT' && this.selectedNetworkValue === 'BTTC') {
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: null
              }) 
          } else {
          value.platform.name
            .toString()
            .toLowerCase()
            .includes(this.selectedNetworkValue.toString().toLowerCase()) &&
            campaignCryptoSet.add({
              key,
              value: this.res[key],
              contract: value.contract_address
              });
            }
          }
        }
      }      
      this.campaignCryptoList = Array.from(campaignCryptoSet);
      const crypto = this.campaignCryptoList.find((element: any) => {
        switch(this.selectedNetworkValue) {
          case 'BEP20': 
            return element.key === 'BNB';
          case 'ERC20': 
            return element.key === 'ETH';
          case 'TRON': 
            return element.key === 'TRX'; 
          case 'BTTC': 
            return element.key === 'BTT';
          case 'POLYGON': 
            return element.key === 'MATIC';

          default: 
          return false;  
        }
      })

      this.tokenToSelect(crypto);
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
