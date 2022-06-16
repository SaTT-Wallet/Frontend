import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { User } from '@app/models/User';
import { AuthService } from '@core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';

@Injectable({
  providedIn: 'root'
})
export class checkStepsService implements CanActivate {
  constructor(
    private tokenStorageService: TokenStorageService,
    private auth: AuthService,
    private router: Router,
    private accountFacadeService: AccountFacadeService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree | Observable<boolean> {
    let url: any;
    url = route.url[0].path;

    return this.accountFacadeService.account$.pipe(
      map((account: User) => {
        if (url === 'activation-mail') {
          if (this.tokenStorageService.getEnabled() === '0') {
            return true;
          } else {
            return false;
          }
        } else if (url === 'monetize-facebook') {
          if (
            this.tokenStorageService.getSecureWallet(
              'visited-completeProfile'
            ) === 'true'
          ) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'monetize-twitter') {
          if (account.visitedFacebook === true) {
            return true;
          } else {
            return false;
          }
        }
        //  else if (url === 'monetize-tiktok') {
        //   if (
        //     this.tokenStorageService.getSecureWallet('visited-twitter') === 'true'
        //   ) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // }
        else if (url === 'monetize-linkedin') {
          if (
            //this.tokenStorageService.getSecureWallet('visited-tiktok') === 'true'
            account.visitedTwitter === true
          ) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'monetize-google') {
          if (account.visitedLinkedIn === true) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'monetize-tiktok') {
          if (account.visitedYoutube === true) {
            return true;
          } else {
            return false;
          }
        }
        //  else if (url === 'monetize-facebook') {
        //   if (
        //     this.tokenStorageService.getSecureWallet('visited-completeProfile') ===
        //       'true' &&
        //     this.tokenStorageService.getSecureWallet('visited-facebook') === null
        //   ) {
        //     return true;
        //   } else {
        //     return this.router.parseUrl('/social-registration/monetize-twitter');
        //   }
        // } else if (url === 'monetize-linkedin') {
        //   if (
        //     this.tokenStorageService.getSecureWallet('visited-linkedin') === null
        //   ) {
        //     return true;
        //   } else {
        //     return this.router.parseUrl('/social-registration/monetize-google');
        //   }
        // } else if (url === 'monetize-twitter') {
        //   if (
        //     this.tokenStorageService.getSecureWallet('visited-twitter') === null
        //   ) {
        //     return true;
        //   } else {
        //     return this.router.parseUrl('/social-registration/monetize-linkedin');
        //   }
        // } else if (url === 'monetize-google') {
        //   if (
        //     this.tokenStorageService.getSecureWallet('visited-linkedin') === 'true'
        //   ) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // }
        else if (url === 'socialConfig') {
          if (account.visitedTiktok === true) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'transactionPassword') {
          if (
            this.tokenStorageService.getSecureWallet('visited-socialConfig') ===
            'true'
          ) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'password_wallet') {
          if (
            this.tokenStorageService.getSecureWallet(
              'visited-transactionPwd'
            ) === 'true'
          ) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'pass-phrase') {
          if (
            this.tokenStorageService.getSecureWallet('visited-pwd') === 'true'
          ) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'downaldJSON') {
          if (
            this.tokenStorageService.getSecureWallet('visited-passPhrase') ===
            'true'
          ) {
            return true;
          } else {
            return false;
          }
        } else if (url === 'activePass') {
          if (
            this.tokenStorageService.getSecureWallet('visited-download') ===
            'true'
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      })
    );
  }
}
