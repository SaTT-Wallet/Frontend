import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
import { AuthStoreService } from './Auth/auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class PassphraseCheckedGuard implements CanActivate {
  constructor(
    private authStoreService: AuthStoreService,
    private router: Router,
    private accountFacadeService: AccountFacadeService
  ) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.accountFacadeService.account$.pipe(
      filter((res) => res !== null),
      map((account: any) => {
        if (
          account.visitPassphrase === undefined ||
          account.visitPassphrase === false ||
          account.visitPassphrase === ''
        ) {
          return this.router.parseUrl('/social-registration/pass-phrase');
        } else {
          return true;
        }
      })
    );
  }
}
