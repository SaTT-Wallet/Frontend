import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CanLoadPublicModule implements CanLoad {
  dateExpiredToken: any = this.tokenStorageService.getExpire();
  dateNow: any = Math.floor(Date.now() / 1000);
  dateShouldExpireAt: any = this.dateExpiredToken - 3600;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private walletFacade: WalletFacadeService,
    private authStoreService: AuthStoreService
  ) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      this.tokenStorageService.getToken() !== null &&
      this.tokenStorageService.getToken() !== ''
    ) {
      if (!!this.authStoreService.account) {
        return this.handleAccountValue(this.authStoreService.account$);
      } else {
        return this.handleAccountValue(this.authStoreService.getAccount());
      }
    } else {
      return of(true);
    }
  }
  handleAccountValue(account$: Observable<any>) {
    return account$.pipe(
      tap((account: any) => {
        const phonenumber = this.tokenStorageService.getPhoneNumber();
        if (!phonenumber) {
          this.tokenStorageService.setPhoneNumber(account.phone);
        }
      }),
      mergeMap((account: any) => {
        if (!!account.error || !Object.keys(account).length) {
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

  handleWalletValue(wallet$: Observable<any>) {
    return wallet$.pipe(
      catchError((error: any) => {
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
      switchMap((data: any) => {
        if (data.data.address) {
          this.tokenStorageService.saveIdWallet(data.data.address);
          return of(true);
        } else if (this.dateNow > this.dateShouldExpireAt) {
          return of(true);
        }
        return of(false);
      })
    );
  }
}
