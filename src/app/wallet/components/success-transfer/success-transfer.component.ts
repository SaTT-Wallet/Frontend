import { Component, OnDestroy, OnInit } from '@angular/core';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { result } from 'lodash';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { ShowNumbersRule } from '@shared/pipes/showNumbersRule';

@Component({
  selector: 'app-success-transfer',
  templateUrl: './success-transfer.component.html',
  styleUrls: ['./success-transfer.component.scss']
})
export class SuccessTransferComponent implements OnInit, OnDestroy {
  crypto: any = '';
  cryptoAmount: any = '';
  private payementId: any;
  private onDestroy$ = new Subject();
  constructor(
    public walletFacade: WalletFacadeService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private showNumbersRule: ShowNumbersRule,

  ) {}

  ngOnInit(): void {
    this.cryptoAmount = this.tokenStorageService.getCryptoCryptoAmount();
    this.crypto = this.tokenStorageService.getCrypto();
    this.payementId = this.tokenStorageService.getPayementId();
    
    this.cryptoAmount =  this.showNumbersRule.transform((this.cryptoAmount) + '', true);

    // this.route.queryParams
    //   .pipe(
    //     filter((data) => data !== null),
    //     takeUntil(this.onDestroy$),
    //     map((params) => params.isApproved),
    //     mergeMap((params: any) => {
    //       if (params === 'true') {
    //         return this.walletFacade.savePayementId(this.payementId);
    //       }
    //       return of(null);
    //     })
    //   )
    //   .pipe(
    //     filter((data) => data !== null),
    //     takeUntil(this.onDestroy$)
    //   )
    //   .subscribe(() => {
    //     this.tokenStorageService.removeItem('payementId');
    //   });
  }
  linstingBack(event: any) {
    if (event === true) {
      this.router.navigate(['/wallet/buy-token']);
    }
  }
  ngOnDestroy() {
    this.onDestroy$.next('');
    this.onDestroy$.complete();
  }
}
