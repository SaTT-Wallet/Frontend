import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import * as walletActions from '../actions/wallet.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { WalletActions } from '../actions/wallet.actions';

@Injectable()
export class WalletEffects {
  constructor(
    private actions$: Actions,
    private cryptoService: CryptofetchServiceService
  ) {}

  loadTotalBalance$: Observable<WalletActions> = createEffect(() => {
    return this.actions$.pipe(
      ofType<walletActions.LoadTotalBalance>(
        walletActions.WalletActionTypes.LoadTotalBalance
      ),
      mergeMap((action: walletActions.LoadTotalBalance) =>
        this.cryptoService.getTotalBalance(action.payload.address).pipe(
        
        
          
          map(
            
            (totalBalance: any) =>
              new walletActions.LoadTotalBalanceSuccess(totalBalance)
          ),
          catchError((err) =>
            of(new walletActions.LoadTotalBalanceFailure(err))
          )
        )
      )
    );
  });
}
