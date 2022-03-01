import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './Auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
@Injectable({
  providedIn: 'root'
})
export class HasIdWalletService implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private auth: AuthService
  ) {}
  canActivate(): Observable<boolean> {
    return this.auth.verifyAccount().pipe(
      map((data: any) => {
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
      catchError((error) => {
        this.router.navigate(['']);
        return of(false);
      })
    );
  }
}
