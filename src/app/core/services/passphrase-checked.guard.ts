import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthStoreService } from './Auth/auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class PassphraseCheckedGuard implements CanActivate {
  constructor(
    private authStoreService: AuthStoreService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authStoreService.getAccount().pipe(
      switchMap(() =>
        this.authStoreService.account$.pipe(
          map((account: any) => {
            if (!account.error && account.passphrase === undefined) {
              return this.router.parseUrl('/social-registration/pass-phrase');
            } else {
              return true;
            }
          })
        )
      )
    );
  }
}
