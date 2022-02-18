import { Injectable, Injector } from '@angular/core';
import {
  loadAccount,
  loadAccountLogout,
  loadUpdatedAccount
} from '@app/core/store/account-store/actions/account.actions';
import { AccountState } from '@app/core/store/account-store/reducers/account.reducer';
import { selectAccount } from '@app/core/store/account-store/selectors/account.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AccountFacadeService {
  constructor(private injector: Injector, private store: Store<AccountState>) {}
  initAccount() {
    this.dispatchUserAccount();
  }
  public get account$() {
    //.pipe(filter((res) => res !== null));
    return this.store.select(selectAccount);
  }
  dispatchLogoutAccount() {
    this.store.dispatch(loadAccountLogout());
  }
  dispatchUserAccount() {
    this.store.dispatch(loadAccount());
  }
  dispatchUpdatedAccount() {
    this.store.dispatch(loadUpdatedAccount());
  }
}
