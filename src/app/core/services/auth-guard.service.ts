import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, take, tap } from 'rxjs/operators';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
import { User } from '@app/models/User';
import { IResponseWallet } from '../iresponse-wallet';
import { NotificationService } from '@core/services/notification/notification.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  dateExpiredToken: any = this.tokenStorageService.getExpire();
  dateNow: any = Math.floor(Date.now() / 1000);
  dateShouldExpireAt: any = this.dateExpiredToken - 3600;
  constructor(
    private router: Router,
    private walletFacade: WalletFacadeService,
    private tokenStorageService: TokenStorageService,
    private accountFacadeService: AccountFacadeService,
    @Inject(PLATFORM_ID) private platformId: string,
    private notificationService: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    if (state.url === '/getBlogs') {
      // If the route is "/getBlogs," allow access without authentication
      return true;
    }
    if (this.tokenStorageService.getIsAuth() !== 'true') {
      this.tokenStorageService.signOut();
      this.accountFacadeService.dispatchLogoutAccount();
      this.router.navigate(['auth/login']);
      return of(false);
    } else {
      this.accountFacadeService.dispatchUserAccount();
      return this.handleAccountValue();
    }
  }

  handleAccountValue() {
    return this.accountFacadeService.account$.pipe(
      filter((res) => res !== null),
      take(2),
      tap((account: any) => {
        const phonenumber = this.tokenStorageService.getPhoneNumber();
        if (!phonenumber) {
          this.tokenStorageService.setPhoneNumber(account.phone);
        }
      }),
      mergeMap((account: User | any) => {
        if (account.email === '' || account.error === 'jwt expired') {
          this.accountFacadeService.dispatchLogoutAccount();
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        } else if (
          (account.completed !== true && account.idSn !== 0) ||
          (account.completed === true &&
            account.idSn !== 0 &&
            (account.enabled === false || account.enabled === 0))
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
      catchError(() => {
        this.tokenStorageService.signOut();
        this.accountFacadeService.dispatchLogoutAccount();
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
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['auth/login']);
          return of(false);
        }
      }),
      mergeMap((data: IResponseWallet) => {
        if (this.tokenStorageService.getvalid2FA() === 'false') {
          // this.tokenStorageService.signOut()
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['auth/login']);
          return of(false);
        }
        if (data.data.address) {
          // this.tokenStorageService.saveIdWallet(data.data.address);
          // this.tokenStorageService.saveTronWallet(data.data?.tronAddress);
          setTimeout(() => {
            this.notificationService.triggerFireBaseNotifications.next(true);
          }, 4000);
          return of(true);
        } else if (this.dateNow > this.dateShouldExpireAt) {
          setTimeout(() => {
            this.notificationService.triggerFireBaseNotifications.next(true);
          }, 4000);
          return of(true);
        }
        return of(false);
      })
    );
  }
  /*    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ):
        | boolean
        | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {
        return this.auth.user.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            })
            // tap(isAuth => {
            //   if (!isAuth) {
            //     this.router.navigate(['/auth']);
            //   }
            // })
        );
    }*/
}
