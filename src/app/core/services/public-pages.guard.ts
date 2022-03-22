import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { catchError, mergeMap, take, tap } from 'rxjs/operators';
import { IResponseWallet } from '../iresponse-wallet';
import { User } from '@app/models/User';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';

@Injectable({ providedIn: 'root' })
export class PublicPagesGuard implements CanActivate {
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

  canActivate(): Observable<boolean> {
    if (
      this.tokenStorageService.getToken() !== null &&
      this.tokenStorageService.getToken() !== ''
    ) {
      if (!!this.authStoreService.account) {
        return this.handleAccountValue(this.accountFacadeService.account$);
      } else {
        return this.handleAccountValue(this.accountFacadeService.account$);
      }
    } else {
      return of(true);
    }
  }

  handleAccountValue(account$: Observable<User | null>) {
    return account$.pipe(
      take(1),
      tap((account: User | null) => {
        const phonenumber = this.tokenStorageService.getPhoneNumber();
        if (!phonenumber) {
          this.tokenStorageService.setPhoneNumber(account?.phone as string);
        }
      }),
      mergeMap((data: User | null) => {
        if (
          (data?.completed !== true && data?.idSn !== '0') ||
          (data?.completed === true &&
            data?.idSn !== '0' &&
            data?.enabled === 0)
        ) {
          this.router.navigate(['social-registration/completeProfile']);
          return of(false);
        } else if (data?.new) {
          if (!data?.passphrase) {
            this.router.navigate(['/social-registration/pass-phrase']);
            return of(false);
          }
          return of(true);
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
      catchError(() => {
        this.tokenStorageService.signOut();
        this.router.navigate(['auth/login']);
        return of(false);
      })
    );
  }

  handleWalletValue(wallet$: Observable<IResponseWallet>) {
    return wallet$.pipe(
      mergeMap((data: IResponseWallet) => {
        if (this.tokenStorageService.getvalid2FA() === 'false') {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        }
        if (!!data?.error) {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        } else if (data.data.address) {
          this.tokenStorageService.saveIdWallet(data.data.address);
          // if(!data.passphrase){
          //   this.router.navigate(
          //     ['/social-registration/pass-phrase'])
          // }
          return of(true);
        } else if (this.dateNow > this.dateShouldExpireAt) {
          return of(true);
        } else if (data.error === 'Wallet not found') {
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
