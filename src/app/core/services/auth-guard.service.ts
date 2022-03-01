import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, take, tap } from 'rxjs/operators';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
import { User } from '@app/models/User';
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
    private accountFacadeService: AccountFacadeService
  ) {}

  canActivate() {
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
      take(1),
      tap((account: any) => {
        const phonenumber = this.tokenStorageService.getPhoneNumber();
        if (!phonenumber) {
          this.tokenStorageService.setPhoneNumber(account.phone);
        }
      }),
      mergeMap((data: User) => {
        if (data.email === '') {
          this.accountFacadeService.dispatchLogoutAccount();
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(false);
        }
        //   else if (data.error === 'Invalid Access Token') {
        //   this.router.navigate(['auth/login']);
        //   return of(false);
        // }
        else if (
          (data.completed !== true && data.idSn !== 0) ||
          (data.completed === true &&
            data.idSn !== 0 &&
            (data.enabled === false || data.enabled === 0))
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
      mergeMap((data: any) => {
        if (this.tokenStorageService.getvalid2FA() === 'false') {
          // this.tokenStorageService.signOut()
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['auth/login']);
          return of(false);
        }
        if (!!data?.error) {
          this.tokenStorageService.signOut();
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['auth/login']);
          return of(false);
        } else if (data.address) {
          this.tokenStorageService.saveIdWallet(data.address);
          return of(true);
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
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['auth/login']);
          return of(false);
        }
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
