import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
  TemplateRef,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';

import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { filter, map, mergeMap, take, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WalletStoreService } from '@core/services/wallet-store.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';

import { ShowNumbersRule } from '@shared/pipes/showNumbersRule';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pattContact } from '@config/atn.config';
import { environment } from '@environments/environment';
import { FilterBynamePipe } from '@shared/pipes/filter-byname.pipe';
// import { data } from 'jquery';
declare var $: any;
@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.css']
})
export class CryptoListComponent implements OnInit, OnDestroy {
  idWallet = this.tokenStorageService.getIdWallet();
  buyIframSrc: SafeResourceUrl;
  arrow: string = '';
  arrowColor: string = '';
  btcCode: string = '';
  erc20: string = '';
  totalAmount: any;
  showSpinner!: boolean;
  loadingButton!: boolean;
  amountUsd: any;
  amount: any;
  dataList: any[] = [];
  liClicked: boolean = false;
  currency: any;
  showCryptoliste: boolean = true;

  datalist: any;
  isBitcoinAdress: boolean = false;
  isERC20Adress: boolean = false;
  search: any;
  etherscanUrl = environment.etherscanaddr;
  bscanUrl = environment.bscanaddr;

  @ViewChild('checkUserLegalKYCModal') checkUserLegalKYCModal!: ElementRef;
  @ViewChild('changly', { static: false })
  public chaglymodal!: TemplateRef<any>;

  cryptoList: any = [];
  convertdata: any;
  newtab: any = [];
  showBigSpinner: boolean = false;
  showWalletSpinner: boolean = true;
  network: string = '';
  routeEventSubscription: any;
  token: any;
  symbol: any;
  totalBalance$ = this.walletFacade.totalBalance$;
  allWallet$ = this.walletFacade.allWallet$;
  cryptoList$ = this.walletFacade.cryptoList$;
  txtValue: string = '';
  searched: boolean = false;
  activatedRoute: ActivatedRoute | null | undefined;
  onDestroy$ = new Subject();
  erc20Selected = false;
  bep20Selected = false;
  polygonSelected = false;
  bttSelected = false;
  tronSelected = false;
  portfeuilleList: Array<{ type: any; code: any }> = [];
  listToken2: any[] = [];
  listToken: any[] = [];
  private listAddedToken: any[] = [];
  isLodingBtn = false;
  errorAddTokenMsg = '';
  formToken: FormGroup;

  successMsg: string = '';
  selectedBlockchain = 'erc20';
  errorMsg: string = '';
  isLoading = false;
  isSubmited = false;
  showAddBtn = false;
  constructor(
    private Fetchservice: CryptofetchServiceService,
    public sidebarService: SidebarService,
    public modalService: NgbModal,
    private tokenStorageService: TokenStorageService,
    private dom: DomSanitizer,
    public translate: TranslateService,
    private clipboard: Clipboard,
    private router: Router,
    private spinner: NgxSpinnerService,
    private walletStoreService: WalletStoreService,
    private walletFacade: WalletFacadeService,
    private cdref: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private showNumbersRule: ShowNumbersRule,
    @Inject(PLATFORM_ID) private platformId: string,
    private filterByNamePipe: FilterBynamePipe
  ) {
    this.buyIframSrc = this.dom.bypassSecurityTrustResourceUrl('');
    this.formToken = new FormGroup({
      network: new FormControl('bep20', Validators.required),
      tokenAdress: new FormControl('', {
        validators: [Validators.required, Validators.pattern(pattContact)]
      }),
      symbol: new FormControl(''),
      decimal: new FormControl(''),
      tokenName: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    if (!!this.routeEventSubscription) {
      this.routeEventSubscription.unsubscribe();
    }
    this.onDestroy$.next('');
    this.onDestroy$.complete();
  }

  @Output() onMakeAnimation: EventEmitter<string> = new EventEmitter();
  @Output() hidePortfolio: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.portfeuille();
    this.getTotalBalance();
    this.getusercrypto();
    this.formToken.valueChanges.subscribe((values: any) => {
      if (values.tokenAdress !== null) {
        this.disabled = false;
        this.checkToken();
      }
    });

    //input pattern="[0-9]*"
    $('[data-toggle="tooltip"]').tooltip;
    this.spinner.show('showWalletSpinner');
  }
  ngAfterContentInit() {
    this.cdref.detectChanges();
  }
  checkLi() {
    if (this.liClicked === false) {
      this.liClicked = true;
    } else if (this.liClicked === true) {
      this.liClicked = false;
    }
  }
  parseStringToInt(ch: string) {
    return parseFloat(ch).toFixed(3);
  }

  //get list of crypto for user
  getusercrypto() {
    this.spinner.show('showWalletSpinner');
    this.showWalletSpinner === true;
    let indexSattBEP20 = 0;
    let indexSattERC20 = 0;
    let indexSattPOLYGON = 0;
    let indexSattBTT = 0;
    let indexSattTRON = 0;

    this.cryptoList$
      .pipe(
        filter((data: any) => data?.data?.length !== 0),
        takeUntil(this.onDestroy$),
        mergeMap((data: any) => {
          this.walletFacade.hideWalletSpinner();
          this.showWalletSpinner === false;
          this.dataList = data;

          Object.preventExtensions(this.dataList);
          this.dataList?.forEach((crypto: any, index: any) => {
            if (crypto.symbol === 'SATTBEP20') {
              indexSattBEP20 = index;
            }
            if (crypto.symbol === 'SATT') {
              indexSattERC20 = index;
            }
            if (crypto.symbol === 'SATTPOLYGON') {
              indexSattPOLYGON = index;
            }
            if (crypto.symbol === 'SATTBTT') {
              indexSattBTT = index;
            }
            if (crypto.symbol === 'SATTTRON') {
              indexSattTRON = index;
            }
          });
          if (this.dataList.length === 0) {
            return of(null);
          }
          ('use strict');
          const sattCryptoBEP20 = this.dataList[indexSattBEP20];
          const sattCryptoPOLYGON = this.dataList[indexSattPOLYGON];
          const sattCryptoBTT = this.dataList[indexSattBTT];
          const sattCryptoTRON = this.dataList[indexSattTRON];

          let cryptoBEP20 = JSON.parse(JSON.stringify(sattCryptoBEP20));
          let cryptoPOLYGON = JSON.parse(JSON.stringify(sattCryptoPOLYGON));
          let cryptoBTT = JSON.parse(JSON.stringify(sattCryptoBTT));
          let cryptoTRON = JSON.parse(JSON.stringify(sattCryptoTRON));

          const cloneData = JSON.parse(JSON.stringify(this.dataList));
          cloneData[indexSattERC20].cryptoBEP20 = cryptoBEP20;
          cloneData[indexSattERC20].cryptoPOLYGON = cryptoPOLYGON;
          cloneData[indexSattERC20].cryptoBTT = cryptoBTT;
          cloneData[indexSattERC20].cryptoTRON = cryptoTRON;

          this.dataList = cloneData;
          this.dataList = this.dataList.filter(
            (element) =>
              element.symbol !== 'SATTBEP20' &&
              element.symbol !== 'SATTPOLYGON' &&
              element.symbol !== 'SATTBTT' &&
              element.symbol !== 'SATTTRON'
          );
          this.cryptoList = [
            ...this.dataList.filter((data: any) => data.symbol === 'SATT'),
            ...this.dataList.filter((data: any) => data.symbol === 'SATTBEP20'),
            ...this.dataList.filter(
              (data: any) => data.symbol === 'SATTPOLYGON'
            ),
            ...this.dataList.filter((data: any) => data.symbol === 'SATTBTT'),
            ...this.dataList.filter((data: any) => data.symbol === 'SATTTRON'),

            ...this.dataList.filter((data: any) => data.symbol === 'WSATT'),
            ...this.dataList.filter((data: any) => data.symbol === 'BITCOIN'),
            ...this.dataList.filter((data: any) => data.symbol === 'BNB'),
            ...this.dataList.filter((data: any) => data.symbol === 'ETH'),
            ...this.dataList
              .filter(
                (data: any) =>
                  data.symbol !== 'WSATT' &&
                  data.symbol !== 'SATTBEP20' &&
                  data.symbol !== 'SATTPOLYGON' &&
                  data.symbol !== 'SATTBTT' &&
                  data.symbol !== 'SATT' &&
                  data.symbol !== 'SATTTRON' &&
                  data.symbol !== 'BITCOIN' &&
                  data.symbol !== 'BNB' &&
                  data.symbol !== 'ETH'
              )
              .reverse()
          ];
          this.cryptoList.forEach((crypto: any) => {
            crypto.selected = false;
          });

          this.dataList?.forEach((crypto: any) => {
            crypto.price = this.filterAmount(crypto.price + '');
            crypto.variation = parseFloat(crypto.variation + '');
            var cryptoVariations = crypto?.variation?.toFixed(8) ?? '0';

            crypto.variation = !!crypto.variation
              ? crypto?.variation?.toFixed(2)
              : '0.00';
            crypto.quantity = this.filterAmount(crypto.quantity + '');
            crypto.total_balance = parseFloat(crypto.total_balance + '');
            crypto.total_balance = crypto?.total_balance?.toFixed(2);
            crypto.undername2 = crypto.undername2 ?? 'indispo';
            crypto.undername = crypto.undername ?? 'indispo';
            crypto.contrat = crypto.AddedToken || '';
            if (cryptoVariations < 0) {
              crypto.arrow = '';
              crypto.arrowColor = '#F52079';
            } else {
              crypto.arrow = '+';
              crypto.arrowColor = '#00CC9E';
            }

            if (crypto.symbol === 'SATT') {
              Object.preventExtensions(crypto);

              crypto.cryptoBEP20.quantity = this.filterAmount(
                crypto?.cryptoBEP20.quantity + ''
              );
              crypto.cryptoBEP20.total_balance = parseFloat(
                crypto.cryptoBEP20.total_balance + ''
              );
              crypto.cryptoBEP20.total_balance =
                crypto?.cryptoBEP20.total_balance?.toFixed(2);
            }
          });
          setTimeout(() => {
            this.dataList.forEach((crypto) => {
              let element = this.document.getElementById(
                crypto.symbol + crypto.name
              ) as HTMLElement;
              if (!!element) {
                element.hidden = true;
              }
            });
          }, 100);

          let divCrypto = this.document.getElementById('cryptoList');
          if (divCrypto) {
            divCrypto.style.height = 'auto';
          }
          this.spinner.hide('showWalletSpinner');
          this.showWalletSpinner = false;
          return this.walletFacade.getCryptoPriceList();
        }),
        filter((res: any) => {
          if (!res) return false;
          if (!!res) {
            if (!!res.data) return true;
          }
          return false;
        })
      )
      .subscribe((data: any) => {
        this.listToken2 = data.data;
        for (let key in this.listToken2) {
          if (data.data.hasOwnProperty(key)) {
            this.listToken2[key].symbol = key;
            if (this.listToken2[key].tokenAddress) {
              this.listToken.push(this.listToken2[key]);
            }
          }
        }
      });
  }
  getTotalBalance() {
    this.totalBalance$
      .pipe(
        // tap((params: any) => {
        //   console.log("params",params)
        // }),

        takeUntil(this.onDestroy$),

        map((response) => response.data?.Total_balance),
        filter((res) => res !== null && res !== undefined)
      )
      .subscribe((totalBalance: any) => {
        this.totalAmount = parseFloat(totalBalance);
      });
  }
  // hideBalances(event: any): void {
  //   if (event.target.checked === true) {
  //     this.cryptoList = this.cryptoList.filter((crypto: any, index: any) => {
  //       return crypto.total_balance !== '0.00';
  //     });
  //   } else {
  //     this.cryptoList = this.cryptoStorage;
  //   }
  // }
  selectedAccounts = localStorage.getItem('wallet_id');


  goTosend(id: any, network: any, pic: any) {
    if (id === 'SATT' && network === 'BEP20') {
      id = 'SATTBEP20';
    }
    this.router.navigate(['/wallet/send'], {
      queryParams: { id: id, network: network, pic: pic },
      relativeTo: this.activatedRoute
    });
  }
  goTorecieve(id: any, network: any) {
    this.router.navigate(['/wallet/receive'], {
      queryParams: { id: id, network: network },
      relativeTo: this.activatedRoute
    });
  }
  goToBuy(id: any, network: any) {
    if (id === 'SATT' && network === 'ERC20') {
      id = 'SATT-ERC20';
    }
    if (id === 'SATT' && network === 'BEP20') {
      id = 'SATT-SC';
    }
    if (id === 'MKR' && network === 'ERC20') {
      id = 'MAKER';
    }
    if (id === 'USDT' && network === 'ERC20') {
      id = 'TETHER';
    }
    this.router.navigate(['/wallet/buy-token'], {
      queryParams: { id: id, network: network },
      relativeTo: this.activatedRoute
    });
  }
  public copyaddresse() {
    if (this.isBitcoinAdress) {
      this.clipboard.copy(this.btcCode);
    } else {
      this.clipboard.copy(this.erc20);
    }
  }
  openModal(content: any) {
    this.modalService.open(content);
  }
  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

 
  portfeuille() {
    this.walletFacade.wallet$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        if (!!data) {
          this.btcCode = data.data.btc;
          this.erc20 = data.data.address;
          this.portfeuilleList = [
            { type: 'ERC20/BEP20', code: this.erc20 },
            { type: 'BTC', code: this.btcCode }
          ];
        }
      });
  }
  // //select value for dropdown
  // selectValue(type: string, code: string) {
  //   this.showSelectedValue = true;
  //   this.selectedValue = type;
  //   this.portfeuilleCode = code;
  //   this.portfeuilleType = type;
  // }
  // Make animation
  // public makeAnimation(key: string): void {
  //   this.onMakeAnimation.emit(key);
  // }

  //extand crypto tab section in mobile_version
  // hideDetails(event: any) {
  //   this.dropDownSection[event.target.attributes.id.nodeValue * 1] =
  //     !this.dropDownSection[event.target.attributes.id.nodeValue * 1];
  // }
  // fixing crypto decimals to 9
  nonAdedCryptos: any[] = [];
  disabled = false;
  selectedNetwork = 'BEP20';
  networkList = ['BEP20', 'ERC20', 'POLYGON'];
  importManually = false;

  onBlockchainChange(event: any) {
    if (event.target.value === 'erc20') {
      this.selectedBlockchain = 'erc20';
      this.formToken.get('network')?.setValue('erc20');
    } else {
      this.selectedBlockchain = 'bep20';
      this.formToken.get('network')?.setValue('bep20');
    }
  }
  cancel() {
    this.errorMsg = '';
    this.successMsg = '';
    this.disabled = false;
    this.formToken.enable({ onlySelf: true, emitEvent: false });
    this.formToken.reset({ onlySelf: true, emitEvent: false });
    this.formToken
      .get('network')
      ?.setValue(this.selectedBlockchain, { onlySelf: true });
  }
  clearInput() {
    this.errorMsg = '';
    this.successMsg = '';
    this.disabled = false;
    this.cdref.detectChanges();
  }
  checkToken() {
    if (!this.formToken.valid) {
      this.showAddBtn = false;
    }
    this.isSubmited = true;
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.walletFacade
      .checkToken(
        this.formToken.get('network')?.value,
        this.formToken.get('tokenAdress')?.value
      )
      .subscribe(
        (response: any) => {
          if (!response) {
            this.successMsg = '';
            this.errorMsg = 'addToken.token-or-network-invalid';
            this.isLoading = false;
            this.disabled = false;
          } else if (response.data !== undefined) {
            this.isSubmited = false;
            this.isLoading = false;

            this.token = response.data.tokenName;

            this.formToken
              .get('symbol')
              ?.setValue(response.data.symbol, { onlySelf: true });
            this.formToken
              .get('tokenAdress')
              ?.setValue(response.data.tokenAdress, { onlySelf: true });
            this.formToken
              .get('decimal')
              ?.setValue(response.data.decimal, { onlySelf: true });
            // if (
            //   ListTokens[response.data.symbol.toUpperCase()] &&
            //   ListTokens[response.data.symbol.toUpperCase()][
            //     'type'
            //   ].toUpperCase() === response.data.network
            // ) {
            //   this.errorMsg = 'addToken.token-exists';
            //   this.successMsg = '';
            //   this.disabled = false;
            // } else {
            this.errorMsg = '';
            this.successMsg = 'addToken.token-founded';
            this.disabled = true;
            this.showAddBtn = true;
            this.isLodingBtn = false;
            /*
              this.formToken.disable();
*/
            // }

            //  else {
            //   this.successMsg = '';
            //   this.errorMsg = 'addToken.token-or-network-invalid';
            // }
          }
        },
        (error: any) => {
          this.showAddBtn = false;
          this.isLodingBtn = false;
          if ((error.message = 'not a token address')) {
            this.successMsg = '';
            this.errorMsg = 'addToken.token-or-network-invalid';
            this.isLoading = false;
          }
        }
      );
  }
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

  buy(currency: any) {
    setTimeout(() => {
      this.spinner.hide();
      this.showBigSpinner = false;
    }, 1000);
    this.spinner.show();
    this.showBigSpinner = true;
    let now = currency.toLowerCase();

    if (now === '(smart chain)') {
      now = 'bnb';

      let url =
        'https://widget.changelly.com?from=usd&to=' +
        now +
        '&amount=50&address=' +
        this.idWallet +
        '&fromDefault=usd&toDefault=' +
        now +
        '&theme=default&payment_id=&v=3';
      this.buyIframSrc = this.dom.bypassSecurityTrustResourceUrl(url);
      // @ts-ignore
    } else if (now === 'btc') {
      this.isBitcoinAdress = true;
      this.isERC20Adress = false;
      let url =
        'https://widget.changelly.com?from=usd&to=' +
        now +
        '&amount=50&address=' +
        this.btcCode +
        '&fromDefault=usd&toDefault=' +
        now +
        '&theme=default&payment_id=&v=3';
      this.buyIframSrc = this.dom.bypassSecurityTrustResourceUrl(url);
    } else if (now === 'usdt') {
      this.isBitcoinAdress = false;
      this.isERC20Adress = true;
      let url =
        'https://widget.changelly.com?from=usd&to=usdt20&amount=50&address=' +
        this.idWallet +
        '&fromDefault=usd&toDefault=usdt20&theme=default&payment_id=&v=3';
      this.buyIframSrc = this.dom.bypassSecurityTrustResourceUrl(url);
      this.showBigSpinner = false;
    } else if (now === 'trx') {
    } else {
      this.isBitcoinAdress = false;
      this.isERC20Adress = true;
      let url =
        'https://widget.changelly.com?from=usd&to=' +
        now +
        '&amount=50&address=' +
        this.idWallet +
        '&fromDefault=usd&toDefault=' +
        now +
        '&theme=default&payment_id=&v=3';
      this.buyIframSrc = this.dom.bypassSecurityTrustResourceUrl(url);
    }
    // this.modalService.open(changly);
  }

  buyClose(): void {
    // @ts-ignore
    this.document.getElementById('changellyModal').style.display = 'none';
  }

  deletetoken(event: any) {
    const token = event.target.offsetParent.id;
    this.Fetchservice.deletetoken(token)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.loadingButton = true;

        // window.location.reload();
        //  this.getusercrypto()
        // this.ngOnInit()
        this.walletStoreService.getCryptoList();
        // this.closeModal("supprimertoken")
        setTimeout(() => {
          this.closeModal('supprimertoken');
          this.loadingButton = false;
        }, 4000);
      });
  }

  goToAddToken() {
    this.router.navigate(['wallet/add-token']);
    this.showSpinner = true;
  }

  totalBalanceSum(crypto: any, modeDetails?: boolean) {
    if (modeDetails && crypto.symbol === 'SATT') {
      return this.showNumbersRule.transform(
        (!!crypto.total_balance ? crypto.total_balance : 0) + '',
        true
      );
    }
    let sum = 0;
    if (!!crypto.cryptoBEP20) {
      sum =
        parseFloat(crypto.total_balance) +
        parseFloat(crypto.cryptoBEP20.total_balance);
    }
    // if (!!crypto.cryptoPOLYGON) {
    //   sum =
    //     parseFloat(crypto.total_balance) +
    //     parseFloat(crypto.cryptoBEP20.total_balance) +
    //     parseFloat(crypto.cryptoPOLYGON.total_balance);
    // }
    // if (!!crypto.cryptoBTT) {
    //   sum =
    //     parseFloat(crypto.total_balance) +
    //     parseFloat(crypto.cryptoBEP20.total_balance) +
    //     parseFloat(crypto.cryptoPOLYGON.total_balance) +
    //     parseFloat(crypto.cryptoBTT.total_balance);
    //  }
    else {
      sum = crypto.total_balance;
    }
    return this.showNumbersRule.transform((!!sum ? sum : 0) + '', true);
  }

  quantitySum(crypto: any, modeDetails?: boolean) {
    if (modeDetails && crypto.symbol === 'SATT') {
      return this.showNumbersRule.transform(
        (!!crypto.quantity ? crypto.quantity : 0) + '',
        true
      );
    }
    let sum = 0;
    if (!!crypto.cryptoBEP20) {
      sum =
        parseFloat(crypto.quantity) + parseFloat(crypto.cryptoBEP20.quantity);
    }
    if (!!crypto.cryptoPOLYGON) {
      sum =
        parseFloat(crypto.quantity) +
        parseFloat(crypto.cryptoPOLYGON.quantity) +
        parseFloat(crypto.cryptoBEP20.quantity);
    } else {
      sum = crypto.quantity;
    }
    return this.showNumbersRule.transform((!!sum ? sum : 0) + '', true);
  }
  transformPrice(crypto: any) {
    if (crypto.symbol === 'BTT') {
      return crypto.price;
    }
    return this.showNumbersRule.transform(crypto?.price + '', true);
  }

  onTextChange(value: any) {
    this.txtValue = value;
    if (this.txtValue !== '') {
      this.searched = true;
      if (
        value.indexOf('0x') >= 0 &&
        this.filterByNamePipe.transform(this.listToken, this.search).length ===
        0
      ) {
        this.importManually = true;
      } else {
        this.importManually = false;
      }
    } else {
      this.searched = false;
    }
    this.getCryptoToImport();
  }
  toggle(crypto: any) {
    if (crypto.symbol !== 'SATT') {
      if (crypto.selected) {
        this.sidebarService.toggleFooterMobile.next(false);
      } else {
        this.sidebarService.toggleFooterMobile.next(true);
      }
    }

    if (crypto) {
      this.tokenStorageService.setItem('cryptoClic', 'true');
      this.sidebarService.sendClickedEvent
        .pipe(take(1), takeUntil(this.onDestroy$))
        .subscribe((data: string) => {
          if (data === 'send')
            this.goTosend(crypto.symbol, crypto.network, crypto.picUrl);
        });
      this.sidebarService.recieveClickedEvent
        .pipe(take(1), takeUntil(this.onDestroy$))
        .subscribe((data: string) => {
          if (data === 'recieve')
            this.goTorecieve(crypto.symbol, crypto.network);
        });
      this.sidebarService.buyClickedEvent
        .pipe(take(1), takeUntil(this.onDestroy$))
        .subscribe((data: string) => {
          if (data === 'buy') {
            if (crypto.AddedToken) {
              if (crypto.network === 'ERC20') {
                if (isPlatformBrowser(this.platformId))
                  window.open(
                    'https://app.uniswap.org/#/swap?outputCurrency=0x70a6395650b47d94a77de4cfedf9629f6922e645',
                    '_blank'
                  );

                //  this.walletStoreService.getCryptoList();
                // this.ngOnInit()
              } else if (crypto.network === 'BEP20') {
                if (isPlatformBrowser(this.platformId))
                  window.open(
                    'https://pancakeswap.finance/swap#/swap?inputCurrency=USDT&outputCurrency=0x448bee2d93be708b54ee6353a7cc35c4933f1156',
                    '_blank'
                  );

                //  this.walletStoreService.getCryptoList();
                // this.ngOnInit()
              }
            } else if (crypto.symbol === 'WSATT') {
              if (isPlatformBrowser(this.platformId))
                window.open(
                  'https://app.uniswap.org/#/swap?outputCurrency=0x70a6395650b47d94a77de4cfedf9629f6922e645',
                  '_blank'
                );
            } else if (
              crypto.symbol === 'CAKE' ||
              crypto.symbol === 'MKR' ||
              crypto.symbol === 'ZRX' ||
              crypto.symbol === 'USDT' ||
              crypto.symbol === 'OMG'
            ) {
              // this.openModal(this.chaglymodal);
              this.buy(crypto.undername);
            } else if (
              crypto.symbol === 'SATTPOLYGON' ||
              crypto.symbol === 'MATIC'
            ) {
              this.router.navigate(['/wallet']);
            } else if (crypto.symbol === 'BTT') {
              if (isPlatformBrowser(this.platformId))
                window.open(
                  'https://sunswap.com/#/v2?lang=en-US&t0=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&t1=TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4&type=swap',
                  '_blank'
                );
            } else {
              this.goToBuy(crypto.symbol, crypto.network);
            }
          }
        });
    }
  }

  openDetails(details: HTMLDivElement, crypto: any) {
    if (crypto.symbol === 'SATT') {
      details.hidden = !details.hidden;
    } else {
      details.hidden = true;
    }
  }

  selectCryptoContainer(cryptoContainer: HTMLDivElement, crypto: any) {
    if (crypto.symbol !== 'SATT') {
      this.cryptoList[0].selected = false;
    }
    this.erc20Selected = false;
    this.bep20Selected = false;
    this.polygonSelected = false;
    this.bttSelected = false;

    let index = this.cryptoList
      .map((res: any) => res.name)
      .indexOf(crypto.name);
    if (crypto.selected === true) {
      this.cryptoList[index].selected = false;
    } else {
      this.cryptoList[
        this.cryptoList.map((res: any) => res.name).indexOf(crypto.name)
      ].selected = true;
      for (let i = 0; i < this.cryptoList.length; i++) {
        if (i !== index) {
          this.cryptoList[i].selected = false;
        }
      }
    }
    /*console.log(this.cryptoList);*/
    /*if (crypto === true) {
      this.cryptoList[
        this.cryptoList.map((res) => res.symbol).indexOf(crypto.symbol)
      ].selected = false;
    } else {
      this.cryptoList[
        this.cryptoList.map((res) => res.symbol).indexOf(crypto.symbol)
      ].selected = true;
    }
    console.log(this.cryptoList);*/
    /*
    let cryptoIcon = document.getElementById(
      crypto.symbol + crypto.type + 'IconsMobile'
    );
    /!*let checkedIcon = document.getElementById(
      crypto.symbol + crypto.type + 'IconsMobileChecked'
    );*!/
    console.warn(cryptoIcon);
    cryptoIcon.remove();
*/
    /*  if (cryptoContainer.classList.contains('BottomBorderSelected')) {
      cryptoContainer.classList.remove('BottomBorderSelected');
      cryptoIcon?.classList.remove('displayNone');
      cryptoIcon?.classList.add('displayBlock');
      checkedIcon?.classList.remove('displayBlock');
      checkedIcon?.classList.add('displayNone');
      //@ts-ignore
    } else {
      cryptoContainer.classList.add('BottomBorderSelected');
      cryptoIcon?.classList.remove('displayBlock');
      cryptoIcon?.classList.add('displayNone');
      checkedIcon?.classList.remove('displayNone');
      checkedIcon?.classList.add('displayBlock');
    }*/
  }

  selectERC20() {
    this.erc20Selected = !this.erc20Selected;
    if (!this.erc20Selected) {
      this.sidebarService.toggleFooterMobile.next(false);
    } else {
      this.sidebarService.toggleFooterMobile.next(true);
    }
    this.bep20Selected = false;
    this.polygonSelected = false;
    this.bttSelected = false;
    this.tronSelected = false;
    for (let i = 1; i < this.cryptoList.length; i++) {
      this.cryptoList[i].selected = false;
    }
  }
  selectBEP20() {
    this.bep20Selected = !this.bep20Selected;
    if (!this.bep20Selected) {
      this.sidebarService.toggleFooterMobile.next(false);
    } else {
      this.sidebarService.toggleFooterMobile.next(true);
    }
    this.erc20Selected = false;
    this.polygonSelected = false;
    this.bttSelected = false;
    this.tronSelected = false;

    for (let i = 1; i < this.cryptoList.length; i++) {
      this.cryptoList[i].selected = false;
    }
  }
  selectPolygon() {
    this.polygonSelected = !this.polygonSelected;
    if (!this.polygonSelected) {
      this.sidebarService.toggleFooterMobile.next(false);
    } else {
      this.sidebarService.toggleFooterMobile.next(true);
    }
    this.bttSelected = false;
    this.erc20Selected = false;
    this.bep20Selected = false;
    this.tronSelected = false;

    for (let i = 1; i < this.cryptoList.length; i++) {
      this.cryptoList[i].selected = false;
    }
  }

  selectBtt() {
    this.bttSelected = !this.bttSelected;
    if (!this.bttSelected) {
      this.sidebarService.toggleFooterMobile.next(false);
    } else {
      this.sidebarService.toggleFooterMobile.next(true);
    }
    this.erc20Selected = false;
    this.bep20Selected = false;
    this.polygonSelected = false;
    this.tronSelected = false;

    for (let i = 1; i < this.cryptoList.length; i++) {
      this.cryptoList[i].selected = false;
    }
  }
  selecttron() {
    this.tronSelected = !this.tronSelected;
    if (!this.tronSelected) {
      this.sidebarService.toggleFooterMobile.next(false);
    } else {
      this.sidebarService.toggleFooterMobile.next(true);
    }
    this.erc20Selected = false;
    this.bep20Selected = false;
    this.polygonSelected = false;
    this.bttSelected = false;

    for (let i = 1; i < this.cryptoList.length; i++) {
      this.cryptoList[i].selected = false;
    }
  }
  trackByCryptoListSymbol(index: any, crypto: any) {
    return crypto.symbol;
  }

  private getCryptoToImport() { }

  alreadyAdded(token: any): boolean {
    if (
      this.cryptoList.map((res: any) => res.symbol).indexOf(token.symbol) >= 0
    ) {
      return true;
    }
    return false;
  }
  addToken() {
    this.isSubmited = true;
    this.isLodingBtn = true;
    this.formToken.enable({ onlySelf: true, emitEvent: false });
    this.walletFacade
      .addToken(
        this.token,
        this.formToken.get('symbol')?.value.toUpperCase(),
        this.formToken.get('decimal')?.value,
        this.formToken.get('tokenAdress')?.value,
        this.formToken.get('network')?.value.toUpperCase()
      )
      .subscribe(
        (response: any) => {
          if (response !== undefined) {
            this.formToken.reset('', { onlySelf: true, emitEvent: false });
            this.disabled = false;
            this.isLodingBtn = false;
            this.isSubmited = false;
            this.showAddBtn = false;
            this.formToken.reset('', { onlySelf: true, emitEvent: false });
            this.errorMsg = '';
            this.successMsg = 'addToken.token-added-successfully';
            this.walletStoreService.getCryptoList();
            this.router.navigate(['/home']);
          }
        },
        (error: any) => {
          if (
            (error.error = 'token already added') ||
            (error.error = 'not a token address')
          ) {
            this.errorMsg = 'addToken.token-already-added';
            this.successMsg = '';
            this.disabled = false;

            this.showAddBtn = false;
            this.isLodingBtn = false;
            // this.formToken.enable({ onlySelf: true, emitEvent: false });
            //
            // this.formToken.reset({ onlySelf: true, emitEvent: false });

            // this.formToken
            //
            //   .get('network')
            //
            //   ?.setValue(this.selectedBlockchain, { onlySelf: true });
          }
        }
      );
  }

  importToken(token: any) {
    this.listToken[
      this.listToken.map((res) => res.symbol).indexOf(token.symbol)
    ].isLoading = true;
    this.isLodingBtn = true;
    this.walletFacade
      .addToken(
        token.name,
        token.symbol,
        token.decimals,
        token.tokenAddress,
        token.network
      )
      .subscribe(
        (response: any) => {
          this.isLodingBtn = true;

          if (response !== undefined) {
            this.search = '';
            this.listToken[
              this.listToken.map((res) => res.symbol).indexOf(token.symbol)
            ].isLoading = false;
            this.walletStoreService.getCryptoList();
          }
        },

        (error: any) => {
          this.isLodingBtn = true;
          this.listToken[
            this.listToken.map((res) => res.symbol).indexOf(token.symbol)
          ].isLoading = false;
          if (
            (error.error = 'token already added') ||
            (error.error = 'not a token address')
          ) {
            this.errorAddTokenMsg = 'addToken.token-already-added';
            setTimeout(() => {
              this.errorAddTokenMsg = '';
            }, 3000);
          }
        }
      );
  }

  selectNetwork(network: string) {
    this.selectedNetwork = network;
    this.formToken.get('network')?.setValue(network?.toLowerCase());
  }

  navigateToERC20Infos(tokenAddress: any) {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.etherscanUrl + tokenAddress, '_blank');
    }
  }

  navigateToBEP20Infos(tokenAddress: any) {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.bscanUrl + tokenAddress, '_blank');
    }
  }
}
