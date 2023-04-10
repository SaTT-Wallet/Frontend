import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interestsList, pattContact } from '@app/config/atn.config';
import { ListTokensPerso } from '@config/atn.config';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { WalletStoreService } from '@core/services/wallet-store.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.css']
})
export class AddTokenComponent implements OnInit {
  selectedBlockchain = 'bep20';
  formToken: UntypedFormGroup;
  isSubmited: boolean = false;
  token: any;
  errorMsg = '';
  successMsg = '';
  isLoading: boolean = false;
  showAddBtn: boolean = false;
  showAddBtnsearch: boolean = false;
  disabled: boolean = false;
  isLodingBtn: boolean = false;
  navigationTab: 'search' | 'token' = 'search';
  activeInfo: boolean = true;
  defaultcurr: any;
  logo: any;
  valuelist: any;
  interestsList: any;
  uniswap: any;
  aave: any;
  polkadot: any;
  term: any;
  type: any;
  array: any = [];
  listToken: any = [];
  listToken2: any = [];
  listAddedToken: any = [];

  //  showsuccess:any
  resized = false;
  tableCryHeight = 0;
  private isDestroyed = new Subject();

  @ViewChild('tableCry', { static: false }) tableCry: any;
  constructor(
    private router: Router,
    private Fetchservice: CryptofetchServiceService,
    private walletStoreService: WalletStoreService,
    private walletFacade: WalletFacadeService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.formToken = new UntypedFormGroup({
      network: new UntypedFormControl('bep20', Validators.required),
      tokenAdress: new UntypedFormControl('', {
        validators: [Validators.required, Validators.pattern(pattContact)]
      }),
      symbol: new UntypedFormControl(''),
      decimal: new UntypedFormControl(''),
      tokenName: new UntypedFormControl('')
    });
    this.interestsList = interestsList;
  }

  ngOnInit(): void {
    this.search();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        let end = window.innerHeight - 65 - 56 - 20;
        if (this.tableCry) {
          let startYOffsetTableCry = this.tableCry.nativeElement.offsetTop;
          if (window.innerWidth <= 415) {
            this.tableCryHeight = end - startYOffsetTableCry;
            this.resized = true;
          }
        }
      }, 3000);
    }
    this.navigationTab = 'token';
    this.activeInfo = false;
    this.walletFacade.cryptoList$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((list) => {
        this.listAddedToken = list;
      });
    for (let key in ListTokensPerso) {
      if (ListTokensPerso.hasOwnProperty(key)) {
        this.array.push(ListTokensPerso[key]);
      }
    }

    this.formToken.valueChanges
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((values: any) => {
        if (values.tokenAdress !== null) {
          this.checkToken();
        }
      });
  }

  onChangeTab(tab: 'search' | 'token') {
    this.navigationTab = tab;
    this.cancel();
    if (tab === 'search') {
      this.activeInfo = true;
      this.showAddBtnsearch = false;
    } else {
      this.activeInfo = false;
    }
  }
  onSelection(e: any, v: any) {
    for (let a of v) {
      this.valuelist = a.value;
    }
  }
  trackById(index: number, token: any) {
    return token;
  }

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
  }
  checkToken() {
    this.isSubmited = true;
    if (this.formToken.valid) {
      this.isLoading = true;
      this.errorMsg = '';
      this.successMsg = '';
      this.walletFacade
        .checkToken(
          this.formToken.get('network')?.value,
          this.formToken.get('tokenAdress')?.value
        )
        .pipe(takeUntil(this.isDestroyed))
        .subscribe(
          (response: any) => {
            if (!response) {
              this.successMsg = '';
              this.errorMsg = 'addToken.token-or-network-invalid';
              this.isLoading = false;
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
              this.formToken.disable();
              // }

              //  else {
              //   this.successMsg = '';
              //   this.errorMsg = 'addToken.token-or-network-invalid';
              // }
            }
          },
          (error: any) => {
            if ((error.message = 'not a token address')) {
              this.successMsg = '';
              this.errorMsg = 'addToken.token-or-network-invalid';
              this.isLoading = false;
            }
          }
        );
    }
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
        // this.token.symbol,
        // this.token.decimal,
        // this.token.tokenAdress,
        // this.token.network,
      )
      .pipe(takeUntil(this.isDestroyed))
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
            this.formToken.enable({ onlySelf: true, emitEvent: false });

            this.formToken.reset({ onlySelf: true, emitEvent: false });

            this.formToken

              .get('network')

              ?.setValue(this.selectedBlockchain, { onlySelf: true });
          }
        }
      );
  }
  getStats(event: any) {
    this.valuelist = event.target.defaultValue;
    this.showAddBtnsearch = true;
  }

  addCustumToken() {
    if (this.valuelist) {
      this.isSubmited = true;
      this.isLodingBtn = true;

      this.walletFacade
        .addToken(
          this.listToken[this.valuelist].name,
          this.listToken[this.valuelist].symbol,
          this.listToken[this.valuelist].decimals,
          this.listToken[this.valuelist].tokenAddress,
          this.listToken[this.valuelist].network
        )
        .pipe(takeUntil(this.isDestroyed))
        .subscribe(
          (response: any) => {
            if (response !== undefined) {
              this.disabled = false;
              this.isLodingBtn = false;
              this.isSubmited = false;
              this.showAddBtnsearch = true;
              this.errorMsg = '';
              this.successMsg = 'addToken.token-added-successfully';
              this.router.navigate(['/home']);
              this.walletStoreService.getCryptoList();
            }
          },

          (error: any) => {
            if (
              (error.error = 'token already added') ||
              (error.error = 'not a token address')
            ) {
              this.errorMsg = 'addToken.token-already-added';
              setTimeout(() => {
                this.errorMsg = '';
              }, 3000);
              this.successMsg = '';
            }
          }
        );
    }
  }
  alreadyAdded(token: any): boolean {
    if (
      this.listAddedToken.map((res: any) => res.symbol).indexOf(token.symbol) >=
      0
    ) {
      return true;
    }
    return false;
  }

  search() {
    this.walletFacade
      // .getlistTokens()
      .getCryptoPriceList()
      .pipe(takeUntil(this.isDestroyed))
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
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
