import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from '@core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class checkStepsService implements CanActivate {
  constructor(
    private tokenStorageService: TokenStorageService,
    private auth: AuthService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    let url: any;
    url = route.url[0].path;

    if (url === 'activation-mail') {
      if (this.tokenStorageService.getEnabled() === '0') {
        return true;
      } else {
        return false;
      }
    } else if (url === 'monetize-facebook') {
      if (
        this.tokenStorageService.getSecureWallet('visited-completeProfile') ===
        'true'
      ) {
        if (
          this.tokenStorageService.getSecureWallet('visited-facebook') ===
          'true'
        ) {
          return this.router.createUrlTree([
            '/social-registration/monetize-twitter'
          ]);
        }
        return true;
      } else {
        return false;
      }
    } else if (url === 'monetize-twitter') {
      if (
        (this.tokenStorageService.getSecureWallet('visited-facebook') ===
          'true') ===
        true
      ) {
        if (
          (this.tokenStorageService.getSecureWallet('visited-twitter') ===
            'true') ===
          true
        ) {
          return this.router.createUrlTree([
            '/social-registration/monetize-linkedin'
          ]);
        }
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
        this.tokenStorageService.getSecureWallet('visited-twitter') === 'true'
      ) {
        if (
          this.tokenStorageService.getSecureWallet('visited-linkedin') ===
          'true'
        ) {
          return this.router.createUrlTree([
            '/social-registration/monetize-google'
          ]);
        }
        return true;
      } else {
        return false;
      }
    } else if (url === 'monetize-google') {
      if (
        this.tokenStorageService.getSecureWallet('visited-linkedin') === 'true'
      ) {
        if (
          this.tokenStorageService.getSecureWallet('visited-google') === 'true'
        ) {
          return this.router.createUrlTree([
            '/social-registration/monetize-tiktok'
          ]);
        }
        return true;
      } else {
        return false;
      }
    } else if (url === 'monetize-tiktok') {
      if (
        this.tokenStorageService.getSecureWallet('visited-google') === 'true'
      ) {
        if (
          this.tokenStorageService.getSecureWallet('visited-tiktok') === 'true'
        ) {
          return this.router.createUrlTree([
            '/social-registration/socialConfig'
          ]);
        }
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
      if (
        this.tokenStorageService.getSecureWallet('visited-tiktok') === 'true'
      ) {
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
        this.tokenStorageService.getSecureWallet('visited-transactionPwd') ===
        'true'
      ) {
        return true;
      } else {
        return false;
      }
    }
    else if (url === 'pass-phrase') {
      if (this.tokenStorageService.getSecureWallet('visited-pwd') === 'true') {
        return true;
      } else {
        return false;
      }
    }
     else if (url === 'downloadjson') {
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
        this.tokenStorageService.getSecureWallet('visited-download') === 'true'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
