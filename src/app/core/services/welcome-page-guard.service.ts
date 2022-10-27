import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
@Injectable({
  providedIn: 'root'
})
export class WelcomePageGuardService implements CanActivate {
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private accountFacadeService: AccountFacadeService
  ) {}

  canActivate(): Observable<boolean> {
    if (this.tokenStorageService.getIsAuth() !== 'true') {
      this.tokenStorageService.signOut();
      this.accountFacadeService.dispatchLogoutAccount();
      return of(true);
    } else {
      if (this.tokenStorageService.getvalid2FA() === 'false') {
        this.tokenStorageService.signOut();
        this.router.navigate(['auth/login']);
      } else {
        this.router.navigate(['/ad-pools']);
      }
      return of(false);
    }
  }
}
