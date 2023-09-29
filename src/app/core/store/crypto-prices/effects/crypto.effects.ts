import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import * as CryptoActions from '../actions/crypto.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class CryptoEffectsList {
  constructor(
    private actions$: Actions,
    private walletFacadeService: WalletFacadeService
  ) {}

  fetchCryptoPriceList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CryptoActions.fetchCryptoPriceList),
      // tap(() => console.log('fetchCryptoPriceList action dispatched')),
      mergeMap(() =>
        this.walletFacadeService.getCryptoPriceList().pipe(
          map((cryptoPriceList) =>
            CryptoActions.fetchCryptoPriceListSuccess({ cryptoPriceList })
          ),
          catchError((error) => {
            return of(CryptoActions.fetchCryptoPriceListFailure({ error }));
          })
        )
      )
    )
  );
}
