import { Injectable } from '@angular/core';
import { CanActivate, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth.service';
import { ContactMessageService } from '@core/services/contactmessage/contact-message.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { catchError, mergeMap, switchMap, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PublicPagesGuard implements CanActivate {
  dateExpiredToken: any = this.tokenStorageService.getExpire();
  dateNow: any = Math.floor(Date.now() / 1000);
  dateShouldExpireAt: any = this.dateExpiredToken - 3600;
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private walletFacade: WalletFacadeService,
    private authStoreService: AuthStoreService
  ) {}

  canActivate(): Observable<boolean> {
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
      take(1),
      tap((account: any) => {
        const phonenumber = this.tokenStorageService.getPhoneNumber();
        if (!phonenumber) {
          this.tokenStorageService.setPhoneNumber(account.phone);
        }
      }),
      mergeMap((data: any) => {
        if (!!data.error || !Object.keys(data).length) {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        } else if (
          (data.completed !== true && data.idSn !== 0) ||
          (data.completed === true && data.idSn !== 0 && data.enabled === false)
        ) {
          this.router.navigate(['social-registration/completeProfile']);
          return of(false);
        } else {
          if (
            !!this.walletFacade.walletValue &&
            !this.walletFacade.walletValue?.error
          ) {
            return this.handleWalletValue(this.walletFacade.wallet$);
          } else {
            return this.handleWalletValue(this.walletFacade.getUserWallet());
          }
        }
      }),
      catchError((error) => {
        this.tokenStorageService.signOut();
        this.router.navigate(['auth/login']);
        return of(false);
      })
    );
  }

  handleWalletValue(wallet$: Observable<any>) {
    return wallet$.pipe(
      mergeMap((data: any) => {
        if (this.tokenStorageService.getvalid2FA() === 'false') {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        }
        if (!!data?.error) {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        } else if (data.address) {
          this.tokenStorageService.saveIdWallet(data.address);
          // if(!data.passphrase){
          //   this.router.navigate(
          //     ['/social-registration/pass-phrase'])
          // }
          if (data.new) {
            if (!data.passphrase) {
              this.router.navigate(['/social-registration/pass-phrase']);
              return of(false);
            } else {
              return of(true);
            }
          } else {
            return of(true);
          }
        } else if (this.dateNow > this.dateShouldExpireAt) {
          return of(true);
        } else if (data.err === 'no_account') {
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
      })
    );
  }
}
