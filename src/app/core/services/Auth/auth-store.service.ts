import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth.service';
import { filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  constructor(private auth: AuthService) {}

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
        this.setAccount(res);
      })
    );
  }

  clearStore() {
    this.setAccount(null);
  }
}
