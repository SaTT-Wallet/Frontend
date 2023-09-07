import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth.service';
import { filter, tap } from 'rxjs/operators';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  constructor(
    private auth: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  private _account: BehaviorSubject<any> = new BehaviorSubject(null);
  readonly account$ = this._account
    .asObservable()
    .pipe(filter((account) => account !== null));

  get account() {
    return this._account.getValue();
  }

  public setAccount(account: any) {
    this._account.next(account);
  }

  public getAccount() {
    return this.auth.verifyAccount().pipe(
      tap((res) => {
        const walletVersion =
          this.tokenStorageService.getNewUserV2() === 'false' &&
          res.data.migrated === false
            ? 'v1'
            : 'v2';

        this.tokenStorageService.setItem('wallet_version', walletVersion);

        this.setAccount(res);
      })
    );
  }

  clearStore() {
    this.setAccount(null);
  }
}
