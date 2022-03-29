import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
import { User } from '@app/models/User';
@Injectable({
  providedIn: 'root'
})
export class HasIdWalletService implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private accountFacadeService: AccountFacadeService
  ) {}
  // canActivate(): Observable<boolean> {
  //   return this.auth.verifyAccount().pipe(
  //     map((data: any) => {
  //       if (
  //         (data.completed !== true && data.idSn !== 0) ||
  //         (data.completed === true && data.idSn !== 0 && data.enabled !== 1)
  //       ) {
  //         this.router.navigate(['social-registration/completeProfile']);
  //         return false;
  //       } else if (
  //         (data.enabled === false || data.enabled === 0) &&
  //         data.idSn === 0
  //       ) {
  //         this.router.navigate(['/social-registration/activation-mail'], {
  //           queryParams: { email: data.email }
  //         });
  //         return false;
  //       } else if (
  //         !this.tokenStorageService.getIdWallet() &&
  //         this.tokenStorageService.getIsAuth() === 'true'
  //       ) {
  //         return true;
  //       } else {
  //         this.router.navigate(['']);
  //         return false;
  //       }
  //     }),
  //     catchError((error) => {
  //       this.router.navigate(['']);
  //       return of(false);
  //     })
  //   );
  // }
  canActivate(): Observable<boolean> {
    this.accountFacadeService.dispatchUserAccount();
    return this.handleAccountValue();
  }

  handleAccountValue() {
    return this.accountFacadeService.account$.pipe(
      filter((res) => res !== null),
      map((user) => user as User),
      take(1),
      map((data: User) => {
        if (
          (data.completed !== true && data.idSn !== 0) ||
          (data.completed === true && data.idSn !== 0 && data.enabled !== 1)
        ) {
          this.router.navigate(['social-registration/completeProfile']);
          return false;
        } else if (
          (data.enabled === false || data.enabled === 0) &&
          data.idSn === 0
        ) {
          this.router.navigate(['/social-registration/activation-mail'], {
            queryParams: { email: data.email }
          });
          return false;
        } else if (
          !this.tokenStorageService.getIdWallet() &&
          this.tokenStorageService.getIsAuth() === 'true'
        ) {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      }),
      catchError(() => {
        this.tokenStorageService.signOut();
        this.router.navigate(['auth/login']);
        return of(false);
      })
    );
  }
}
