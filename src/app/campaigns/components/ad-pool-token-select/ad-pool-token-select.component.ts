import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
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
  userCrypto: any = [];
  isDestroyed$ = new Subject<any>();
  @Input() selectedNetworkValue!: string;
  tokenList: any = [];

  searchToken() {
    console.log(this.tokenSearch.value);
  }
  constructor(private walletFacade: WalletFacadeService) {}

  ngOnInit(): void {
    this.walletFacade.getCryptoPriceList().subscribe((res: any) => {
      const result = Object.keys(res.data);
      result.forEach((key) => {
        console.log(res.data[key].network);
        res.data[key].network === this.selectedNetworkValue &&
          this.cryptoList.push(res.data[key]);
      });
      console.log(this.cryptoList);
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
}
