import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import * as CryptoInfoActions from '../actions/crypto-info.actions';
import { CryptoInfoService } from '@app/core/services/crypto-info.service';

@Injectable()
export class CryptoInfoEffects {
  constructor(
    private actions$: Actions,
    private cryptoInfoService: CryptoInfoService
  ) {}

  loadCryptoList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CryptoInfoActions.loadCryptoList),
      mergeMap(() =>
        this.cryptoInfoService.listIdToken().pipe(
          tap((cryptoList: any[]) => {
            console.log('Received Crypto List:', cryptoList);
          }),
          map((cryptoList) =>
            CryptoInfoActions.loadCryptoListSuccess({ cryptoList: cryptoList as any[] })
          ),
          catchError((error) =>
            of(CryptoInfoActions.loadCryptoListFailure({ error }))
          )
        )
      )
    )
  );
}
