import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
import { User } from '@app/models/User';
import { IResponseWallet } from '../iresponse-wallet';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CanLoadPublicModule implements CanLoad {
  dateExpiredToken: any = this.tokenStorageService.getExpire();
  dateNow: any = Math.floor(Date.now() / 1000);
  dateShouldExpireAt: any = this.dateExpiredToken - 3600;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private walletFacade: WalletFacadeService,
    private authStoreService: AuthStoreService,
    private accountFacadeService: AccountFacadeService
  ) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      this.tokenStorageService.getToken() !== null &&
      this.tokenStorageService.getToken() !== ''
    ) {
      this.accountFacadeService.dispatchUserAccount();
      return this.handleAccountValue();
    } else {
      return of(true);
    }
  }
  handleAccountValue() {
    return this.accountFacadeService.account$.pipe(
      filter((res: User | null) => {
        return res !== null;
      }),
      map((acc) => acc as User),
      take(1),
      tap((account: User) => {
        const phonenumber = this.tokenStorageService.getPhoneNumber();
        if (!phonenumber) {
          this.tokenStorageService.setPhoneNumber(account.phone);
        }
      }),
      mergeMap((account: User) => {
        if (!Object.keys(account).length) {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        } else if (
          (account.completed !== true && account.idSn !== 0) ||
          (account.completed === true &&
            account.idSn !== 0 &&
            account.enabled === false)
        ) {
          this.router.navigate(['social-registration/completeProfile']);
          return of(false);
        } else {
          if (!!this.walletFacade.walletValue) {
            return this.handleWalletValue(this.walletFacade.wallet$);
          } else {
            return this.handleWalletValue(this.walletFacade.getUserWallet());
          }
        }
      }),
      catchError(() => {
        this.tokenStorageService.signOut();
        this.router.navigate(['auth/login']);
        return of(false);
      })
    );
  }

  handleWalletValue(wallet$: Observable<IResponseWallet>) {
    return wallet$.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error.error === 'Wallet not found') {
          this.tokenStorageService.setSecureWallet(
            'visited-completeProfile',
            'true'
          );
          this.router.navigate(['social-registration/monetize-facebook']);
          return of(false);
        } else {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        }
      }),
      switchMap((data: IResponseWallet | boolean) => {
        if ((data as IResponseWallet).data.address) {
          // this.tokenStorageService.saveIdWallet(
          //   (data as IResponseWallet).data.address
          // );
          // this.tokenStorageService.saveTronWallet(
          //   (data as IResponseWallet).data?.tronAddress
          // );
          return of(true);
        } else if (this.dateNow > this.dateShouldExpireAt) {
          return of(true);
        }
        return of(false);
      })
    );
  }
}
