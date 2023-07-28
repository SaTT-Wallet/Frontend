import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { WalletStoreService } from '@app/core/services/wallet-store.service';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ad-pool-token-select',
  templateUrl: './ad-pool-token-select.component.html',
  styleUrls: ['./ad-pool-token-select.component.scss']
})
export class AdPoolTokenSelectComponent implements OnInit {
  tokenSearch = new FormControl('');
  cryptoList: any = [];
  filterList: any = [];
  userCrypto: any = [];
  isDestroyed$ = new Subject<any>();
  tokenNotFound: boolean = false;
  showWarning: boolean = true;
  showSearchNewTokenContainer: boolean = false;
  @Input() selectedNetworkValue!: string;
  tokenList: any = [];

  reset(e: any) {
    e.target.value = '';
    this.filterList = this.cryptoList;
    this.showSearchNewTokenContainer = false;
    this.showWarning = true;
    this.tokenNotFound = false;
  }
  searchToken(e: any) {
    this.filterList = [];

    if (e.target.value.length > 0) {
      this.cryptoList.forEach((crypto: any) => {
        if (
          crypto.name
            .toString()
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) // crypto.symbol.includes(e.target.value)
        )
          this.filterList.push(crypto);
        console.log(this.filterList);
      });
      if (this.filterList.length === 0) this.tokenNotFound = true;
      else this.tokenNotFound = false;
    } else this.filterList = this.cryptoList;
  }

  searchPersonalizedToken() {
    this.showSearchNewTokenContainer = !this.showSearchNewTokenContainer;
    this.showWarning = false;
  }
  constructor(
    private walletFacade: WalletFacadeService,
    private Fetchservice: CryptofetchServiceService
  ) {}

  ngOnInit(): void {
    this.Fetchservice.getBalanceCrypto().subscribe((res: any) => {
      console.log(res, 'balance');
    });

    this.walletFacade.getCryptoPriceList().subscribe((res: any) => {
      const result = Object.keys(res.data);
      result.forEach((key) => {
        let arr = res?.data[key]?.networkSupported || [];
        if (res.data[key].network === null) {
          arr.forEach((data: any) => {
            data.platform?.name
              .toUpperCase()
              .includes(this.selectedNetworkValue) &&
              this.cryptoList.push(res.data[key]);
          });
        } else {
          res.data[key].network === this.selectedNetworkValue &&
            this.cryptoList.push(res.data[key]);
        }
      });
      this.filterList = this.cryptoList;
      console.log(this.filterList);
    });

    // this.walletFacade
    // .getCryptoPriceList()
    // .pipe(filter((crypto) => crypto.network === this.selectedNetworkValue))
    // .subscribe((res: any) => {
    //   console.log(res);
    //   // res.data.map((crypto: any) => {
    //   //   if (crypto.network === this.selectedNetworkValue)
    //   //     this.cryptoList.push(crypto);
    //   // });

    //   console.log(this.cryptoList, 'cryptoList');
    // });
    this.getUserCrypto();

    // this.walletFacade
    //   .getAllWallet()
    //   // .pipe(filter((crypto) => crypto.network === this.selectedNetworkValue))
    //   .subscribe((res) => {
    //     console.log(res, 'futur token List');
    //   });
  }

  getUserCrypto() {
    this.walletFacade.cryptoList$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.userCrypto = data;
        console.log(this.userCrypto, 'userCrypto');
      });
  }

  // addToken() {
  //   this.isSubmited = true;
  //   this.isLodingBtn = true;
  //   this.formToken.enable({ onlySelf: true, emitEvent: false });
  //   this.walletFacade
  //     .addToken(
  //       this.token,
  //       this.formToken.get('symbol')?.value.toUpperCase(),
  //       this.formToken.get('decimal')?.value,
  //       this.formToken.get('tokenAdress')?.value,
  //       this.formToken.get('network')?.value.toUpperCase()
  //     )
  //     .subscribe(
  //       (response: any) => {
  //         if (response !== undefined) {
  //           this.formToken.reset('', { onlySelf: true, emitEvent: false });
  //           this.disabled = false;
  //           this.isLodingBtn = false;
  //           this.isSubmited = false;
  //           this.showAddBtn = false;
  //           this.formToken.reset('', { onlySelf: true, emitEvent: false });
  //           this.errorMsg = '';
  //           this.successMsg = 'addToken.token-added-successfully';
  //           this.walletStoreService.getCryptoList();
  //           this.router.navigate(['/home']);
  //         }
  //       },
  //       (error: any) => {
  //         if (
  //           (error.error = 'token already added') ||
  //           (error.error = 'not a token address')
  //         ) {
  //           this.errorMsg = 'addToken.token-already-added';
  //           this.successMsg = '';
  //           this.disabled = false;

  //           this.showAddBtn = false;
  //           this.isLodingBtn = false;
  //           // this.formToken.enable({ onlySelf: true, emitEvent: false });
  //           //
  //           // this.formToken.reset({ onlySelf: true, emitEvent: false });

  //           // this.formToken
  //           //
  //           //   .get('network')
  //           //
  //           //   ?.setValue(this.selectedBlockchain, { onlySelf: true });
  //         }
  //       }
  //     )d etre en ;
  // }
  // importToken(token: any) {
  //   this.listToken[
  //     this.listToken.map((res) => res.symbol).indexOf(token.symbol)
  //   ].isLoading = true;
  //   this.isLodingBtn = true;
  //   this.walletFacade
  //     .addToken(
  //       token.name,
  //       token.symbol,
  //       token.decimals,
  //       token.tokenAddress,
  //       token.network
  //     )
  //     .subscribe(
  //       (response: any) => {
  //         this.isLodingBtn = true;

  //         if (response !== undefined) {
  //           this.search = '';
  //           this.listToken[
  //             this.listToken.map((res) => res.symbol).indexOf(token.symbol)
  //           ].isLoading = false;
  //           this.walletStoreService.getCryptoList();
  //         }
  //       },

  //       (error: any) => {
  //         this.isLodingBtn = true;
  //         this.listToken[
  //           this.listToken.map((res) => res.symbol).indexOf(token.symbol)
  //         ].isLoading = false;
  //         if (
  //           (error.error = 'token already added') ||
  //           (error.error = 'not a token address')
  //         ) {
  //           this.errorAddTokenMsg = 'addToken.token-already-added';
  //           setTimeout(() => {
  //             this.errorAddTokenMsg = '';
  //           }, 3000);
  //         }
  //       }
  //     );
  // }
}
