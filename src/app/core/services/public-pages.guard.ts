import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { IResponseWallet } from '../iresponse-wallet';
import { User } from '@app/models/User';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@core/services/notification/notification.service';

@Injectable({ providedIn: 'root' })
export class PublicPagesGuard implements CanActivate {
  dateExpiredToken: any = this.tokenStorageService.getExpire();
  dateNow: any = Math.floor(Date.now() / 1000);
  dateShouldExpireAt: any = this.dateExpiredToken - 3600;
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private walletFacade: WalletFacadeService,
    private accountFacadeService: AccountFacadeService,
    private notificationService: NotificationService
  ) {}

  canActivate(): Observable<boolean> {
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
      mergeMap((account: User | any) => {
        if (!Object.keys(account).length || account.error === 'jwt expired') {
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
  // handleAccountValue() {
  //   return this.accountFacadeService.account$.pipe(
  //     take(1),
  //     tap((account: User | null) => {
  //       const phonenumber = this.tokenStorageService.getPhoneNumber();
  //       if (!phonenumber) {
  //         this.tokenStorageService.setPhoneNumber(account?.phone as string);
  //       }
  //     }),
  //     mergeMap((data: User | null) => {
  //       if (
  //         (data?.completed !== true && data?.idSn !== '0') ||
  //         (data?.completed === true &&
  //           data?.idSn !== '0' &&
  //           data?.enabled === 0)
  //       ) {
  //         this.router.navigate(['social-registration/completeProfile']);
  //         return of(false);
  //       } else if (data?.new) {
  //         if (!data?.passphrase) {
  //           this.router.navigate(['/social-registration/pass-phrase']);
  //           return of(false);
  //         }
  //         return of(true);
  //       } else {
  //         if (
  //           !!this.walletFacade.walletValue &&
  //           !this.walletFacade.walletValue?.error
  //         ) {
  //           return this.handleWalletValue(this.walletFacade.wallet$);
  //         } else {
  //           return this.handleWalletValue(this.walletFacade.getUserWallet());
  //         }
  //       }
  //     }),
  //     catchError(() => {
  //       this.tokenStorageService.signOut();
  //       this.router.navigate(['auth/login']);
  //       return of(false);
  //     })
  //   );
  // }
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
          this.notificationService.triggerFireBaseNotifications.next(true);
          return of(true);
        } else if (this.dateNow > this.dateShouldExpireAt) {
          return of(true);
          this.notificationService.triggerFireBaseNotifications.next(true);
        }
        return of(false);
      })
    );
  }
  // handleWalletValue(wallet$: Observable<IResponseWallet>) {
  //   return wallet$.pipe(
  //     mergeMap((data: IResponseWallet) => {
  //       if (this.tokenStorageService.getvalid2FA() === 'false') {
  //         this.tokenStorageService.signOut();
  //         this.router.navigate(['auth/login']);
  //         return of(false);
  //       }
  //       if (!!data?.error) {
  //         this.tokenStorageService.signOut();
  //         this.router.navigate(['auth/login']);
  //         return of(false);
  //       } else if (data.data.address) {
  //         this.tokenStorageService.saveIdWallet(data.data.address);
  //         // if(!data.passphrase){
  //         //   this.router.navigate(
  //         //     ['/social-registration/pass-phrase'])
  //         // }
  //         return of(true);
  //       } else if (this.dateNow > this.dateShouldExpireAt) {
  //         return of(true);
  //       } else if (data.error === 'Wallet not found') {
  //         this.tokenStorageService.setSecureWallet(
  //           'visited-completeProfile',
  //           'true'
  //         );
  //         this.router.navigate(['social-registration/monetize-facebook']);
  //         return of(false);
  //       } else {
  //         this.tokenStorageService.signOut();
  //         this.router.navigate(['auth/login']);
  //         return of(false);
  //       }
  //     })
  //   );
  // }
}
