import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@core/services/Auth/auth.service';
import { filter, tap } from 'rxjs/operators';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { CryptofetchServiceService } from '../wallet/cryptofetch-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  constructor(
    private auth: AuthService,
    private tokenStorageService: TokenStorageService,
    private cryptofetchServiceService: CryptofetchServiceService
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

  async fetchBalance() {
    try {
      const balance: any = await this.cryptofetchServiceService
        .getTotalBalanceV2()
        .toPromise();
      const balanceV2 = balance.data.Total_balance;
      return balanceV2;
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  public getAccount() {
    return this.auth.verifyAccount().pipe(
      tap(async (res) => {
        const fetchedBalance = await this.fetchBalance();

        const walletVersion =
          this.tokenStorageService.getNewUserV2() === 'false' &&
          (fetchedBalance === 0.0 || res.data.migrated)
            ? 'v1'
            : 'v2';

        // this.tokenStorageService.setItem('wallet_version', walletVersion);
        // console.log(walletVersion, "haw version mte3ii stooooooore")
        this.setAccount(res);
      })
    );
  }

  clearStore() {
    this.setAccount(null);
  }
}
