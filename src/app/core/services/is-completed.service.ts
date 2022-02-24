import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './Auth/auth.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { AuthStoreService } from './Auth/auth-store.service';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
@Injectable({
  providedIn: 'root'
})
export class IsCompletedService implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private accountFacadeService: AccountFacadeService
  ) {}

  canActivate(): Observable<boolean> {
    if (this.tokenStorageService.getIsAuth() !== 'true') {
      this.router.navigate(['auth/login']);
      return of(false);
    } else {
      this.accountFacadeService.dispatchUserAccount();
      return this.handleAccountValue();
      // if (!!this.authStoreService.account) {
      //   return this.handleAccountValue(this.authStoreService.account$);
      // } else {
      //   return this.handleAccountValue(this.authStoreService.getAccount());
      // }
      // this.auth.verifyAccount().subscribe((data: any) => {
      //   if (data.error === 'AC_Token expired') {
      //      this.tokenStorageService.signOut();
      //     this.router.navigate(['auth/login']);
      //   }
      //   if (
      //     (data.completed !== true && data.idSn !== 0) ||
      //     (data.completed === true && data.idSn !== 0 && data.enabled !== 1)
      //   ) {
      //     return true;
      //   } else if (data.enabled === 0) {
      //     this.router.navigate(['social-registration/activation-mail']);
      //     return false;
      //   } else {
      //     this.router.navigate(['social-registration/monetize-facebook']);
      //     return false;
      //   }
      // });
      // return true;
    }
  }

  handleAccountValue() {
    return this.accountFacadeService.account$.pipe(
      filter((res) => res !== null),
      take(1),
      map((data: any) => {
        if (!!data.error || !Object.keys(data).length) {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return false;
        } else if (
          (data.completed !== true && data.idSn !== 0) ||
          (data.completed === true &&
            data.idSn !== 0 &&
            (data.enabled === false || data.enabled === 0))
        ) {
          return true;
        } else if (data.enabled === false || data.enabled === 0) {
          this.router.navigate(['social-registration/activation-mail']);
          return false;
        } else {
          this.router.navigate(['social-registration/monetize-facebook']);
          return false;
        }
      }),
      catchError((error) => {
        this.tokenStorageService.signOut();
        this.router.navigate(['auth/login']);
        return of(false);
      })
    );
  }
}
