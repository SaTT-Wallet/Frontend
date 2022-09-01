import {
  Component,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { pattEmail, ListTokens } from '@config/atn.config';
import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ContactMessageService } from '@core/services/contactmessage/contact-message.service';
import { Router } from '@angular/router';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Big } from 'big.js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('inputAmountUsd') inputAmountUsd?: ElementRef;
  @ViewChild('inputAmount') inputAmount?: ElementRef;
  @Output() title: string = 'receive.receive_token';
  dataList: any = [];
  totalAmount: any;
  amountdefault: string = 'SATT';
  receiveform: FormGroup;
  selectedCrypto: any = 'SATT';
  currentUser: any;
  emailNotCorrect!: boolean;
  defaultcurr: string = ListTokens['SATT'].name;
  etherInWei = new Big(1000000000000000000);
  routeEventSubscription$ = new Subject();
  loadingButton!: boolean;
  errMsg: string = '';
  sameEmail: boolean = false;

  amountUsd: any;
  amount: any;

  showMsgBloc: boolean = false;
  showSuccessBloc: boolean = false;
  showAmountBloc: boolean = true;
  selectedCryptoSend: any;
  selectedCryptoDetails: any = '';
  private account$ = this.accountFacadeService.account$;
  cryptoList$ = this.walletFacade.cryptoList$;
  cryptoToDropdown: any;
  contactEmail: string = '';
  maxUsdAmountNumber: number = 999999999;
  maxAmountNumber: number = 9999999999999;
  private isDestroyed = new Subject();
  sattPrices: any;
  usernotfound: boolean = false;
  constructor(
    private accountFacadeService: AccountFacadeService,
    public sidebarService: SidebarService,
    private ContactMessageService: ContactMessageService,
    public translate: TranslateService,
    private walletFacade: WalletFacadeService,
    private router: Router,
    private showNumbersRule: ShowNumbersRule,
    private tokenStorageService: TokenStorageService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private _location: Location
  ) {
    this.receiveform = new FormGroup({
      contact: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(pattEmail)]
      }),
      Amount: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      AmountUsd: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      currency: new FormControl(null, Validators.required),
      message: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.receiveform.get('currency')?.setValue('SATT');
    this.getProfileDetails();
    this.getusercrypto();
    this.amountdefault = this.receiveform.get('currency')?.value;
    this.receiveform.get('currency')?.setValue(this.amountdefault);
  }
  //get list of crypto for user
  getusercrypto() {
    this.cryptoList$
      .pipe(
        filter((data) => data.length !== 0),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.dataList = data;
        this.dataList?.forEach((crypto: any) => {
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
          if (crypto.symbol === 'SATT') {
            this.sattPrices = crypto.price;
          }
        });
      });
  }

  linstingCrypto(event: any) {
    this.selectedCryptoDetails = event;
    this.receiveform
      .get('currency')
      ?.setValue(this.selectedCryptoDetails.symbol);
    this.receiveform.get('Amount')?.reset();
    this.receiveform.get('AmountUsd')?.reset();
    this.amountdefault = this.receiveform.get('currency')?.value;
  }
  linstingBack(event: any) {
    if (event === true) {
      if (this.showSuccessBloc === true) {
        this.showSuccessBloc = false;
        this.showMsgBloc = true;
        this.showAmountBloc = false;
      } else if (this.showMsgBloc === true) {
        this.showSuccessBloc = false;
        this.showMsgBloc = false;
        this.showAmountBloc = true;
        this.cryptoToDropdown = this.selectedCryptoDetails;
      } else if (this.showAmountBloc === true) {
        // this.router.navigate(['/wallet']);
        this._location.back();
      }
    }
  }
  //get user Data
  getProfileDetails() {
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.routeEventSubscription$)
      )
      .subscribe((data) => {
        this.currentUser = data;
      });
  }
  //convert currency to usd
  restrictZero(event: any) {
    // [a,2,4,21].includes(event.key)
    if (
      event.keyCode === 59 ||
      event.keyCode === 16 ||
      [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(event.wich)
    ) {
    } else if (
      !this.isValidKeyCode(event.keyCode) ||
      ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(event.keyCode) &&
        event.shiftKey === false)
    ) {
      event.preventDefault();
      this.convertcurrency('', false);
    } else {
    }
  }
  isValidKeyCode(code: number): boolean {
    return (
      (code >= 48 && code <= 57) ||
      (code >= 96 && code <= 105) ||
      code === 8 ||
      code === 46 ||
      code === 27 ||
      code === 110 ||
      code === 37 ||
      code === 39
    );
  }

  convertcurrency(event: any, restrict?: boolean): void {
    let allow: boolean = true;
    if (restrict !== undefined && restrict === false) {
      allow = false;
    } else {
      allow = true;
    }
    if (allow) {
      let currency = '';
      let currencyreceive = '';
      var getamountreceive: any = this.receiveform.get('Amount')?.value;
      let getusdreceive: any = this.receiveform.get('AmountUsd')?.value;
      let receiveamount = getamountreceive?.toString();
      let receiveusd = getusdreceive?.toString();
      if (
        event === 'amountreceive' &&
        Number(receiveamount) > this.maxAmountNumber
      ) {
        receiveamount = receiveamount.slice(0, 13);
        this.receiveform.get('Amount')?.setValue(receiveamount);
      }
      if (
        event === 'usdreceive' &&
        Number(receiveusd) > this.maxUsdAmountNumber
      ) {
        receiveusd = receiveusd.slice(0, 9);
        this.receiveform.get('AmountUsd')?.setValue(receiveusd);
      } else {
        this.selectedCryptoSend = currency;
        if (this.selectedCryptoSend) {
          currencyreceive = this.selectedCryptoSend;
        } else {
          currencyreceive = this.amountdefault;
        }
        this.dataList?.forEach((crypto: any) => {
          if (
            event === 'amountreceive' &&
            receiveamount !== undefined &&
            !isNaN(receiveamount)
          ) {
            if (crypto.symbol === currencyreceive) {
              this.amountUsd = crypto.price * receiveamount;
              this.amountUsd = this.showNumbersRule.transform(this.amountUsd);
              if (this.amountUsd < 0.1) {
                this.amountUsd = new Big(this.amountUsd).toFixed(8).toString();
              }
              if (isNaN(this.amountUsd)) {
                this.amountUsd = '';
                this.amount = '';
              }
            }
          } else if (
            event === 'amountreceive' &&
            (receiveamount === undefined || isNaN(receiveamount))
          ) {
            this.amountUsd = '';
          }
          if (
            event === 'usdreceive' &&
            receiveusd !== '' &&
            !isNaN(receiveusd)
          ) {
            if (crypto.symbol === currencyreceive) {
              this.amount = receiveusd / crypto.price;
              this.amount = this.showNumbersRule.transform(this.amount);

              if (
                receiveamount === '0.00000000' ||
                receiveusd === '' ||
                isNaN(this.amount)
              ) {
                this.amountUsd = '';
                this.amount = '';
              }
            }
          } else if (
            event === 'usdreceive' &&
            (receiveusd === '' || isNaN(receiveusd))
          ) {
            this.amount = '';
          }
        });
        this.editwidthInput();
      }
    }
  }
  replaceNonAlphanumeric(value: any) {
    return (
      value
        .replace(/[^0-9.]+/g, '')
        // .replace(/^0+/, "")
        .replace(/^\.+/, '0.')
        .replace(/\./, 'x')
        .replace(/\./g, '')
        .replace(/x/, '.')
    );
  }
  ngAfterViewChecked(): void {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    //let inputAmount = this.inputAmount?.nativeElement;
    if (elementinputusd)
      elementinputusd.style.width = elementinputusd.value.length + 1 + 'ch';
    // if (inputAmount)
    //   inputAmount.style.width = elementinputusd.value.length + 1 + 'ch';
  }
  editwidthInput() {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    // let inputAmount = this.inputAmount?.nativeElement;
    if (elementinputusd)
      elementinputusd.style.width = elementinputusd.value.length + 1 + 'ch';
    // if (inputAmount)
    //   inputAmount.style.width = elementinputusd.value.length + 1 + 'ch';
  }
  //validation receive
  isReceiveValid(controlName: any) {
    return this.receiveform.get(controlName)?.invalid;
  }
  //validation mail
  isEmailAddress(str: any) {
    return pattEmail.test(str); // returns a boolean
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
  //receive crypto

  receiveMoney() {
    if (this.receiveform.valid) {
      this.loadingButton = true;
      const wallet = this.tokenStorageService.getIdWallet();
      var name = '';
      if (this.currentUser.firstName && this.currentUser.lastName)
        name = this.currentUser.firstName + ' ' + this.currentUser.lastName;
      else name = this.currentUser.email;
      const from = this.currentUser.email;
      const to = this.receiveform.get('contact')?.value;
      const price = this.receiveform.get('Amount')?.value.toString();
      const cryptoCurrency = this.receiveform.get('currency')?.value;
      var message = this.receiveform.get('message')?.value;
      if (!message) {
        message = '';
      }
      const Receive = {
        to,
        cryptoCurrency,
        price,
        message,
        wallet,
        from,
        name
      };

      if (!this.isEmailAddress(to)) {
        this.emailNotCorrect = true;

        setTimeout(() => {
          this.emailNotCorrect = false;
        }, 5000);
        return;
      }

      this.ContactMessageService.reveiveMoney(Receive)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe(
          (data) => {
            if (data) {
              this.amount = '';
              this.amountUsd = '';
              this.contactEmail = '';
              this.loadingButton = false;
              this.showAmountBloc = false;
              this.showMsgBloc = false;
              this.showSuccessBloc = true;
              this.receiveform.reset();
            }
            if (data == null) {
              this.usernotfound = true;
              this.loadingButton = false;
              setTimeout(() => {
                this.usernotfound = false;
              }, 3000);
            }
          }
          // (error) => {
          //   if (error.error.error === 'user not found') {
          //     this.usernotfound = true;
          //     this.loadingButton = false;
          //   }
          // }
        );
    }
  }

  showNextBloc() {
    const from = this.currentUser.email;
    this.contactEmail = this.receiveform.get('contact')?.value;
    if (from === this.contactEmail) {
      this.sameEmail = true;
      setTimeout(() => {
        this.sameEmail = false;
      }, 5000);
    } else if (from !== this.contactEmail) {
      this.sameEmail = false;
      this.showAmountBloc = false;
      this.showMsgBloc = true;
      this.showSuccessBloc = false;
    }
  }
  makeNewRequest() {
    this.showMsgBloc = false;
    this.showSuccessBloc = false;
    this.showAmountBloc = true;
    this.receiveform.reset();
    this.ngOnInit();
  }
  ngOnDestroy(): void {
    if (!!this.routeEventSubscription$) {
      this.routeEventSubscription$.next('');
      this.routeEventSubscription$.complete();
    }
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
  goToSection(id: string) {
    if (isPlatformBrowser(this.platformId) && window.innerWidth <= 768) {
      const classElement = this.document.getElementsByClassName(id);
      if (classElement.length > 0) {
        classElement[0].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
