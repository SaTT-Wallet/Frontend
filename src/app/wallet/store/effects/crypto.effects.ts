import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as CryptoActions from '../../store/actions/crypto.actions';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { CryptoData } from '@app/models/crypto-data.model';

@Injectable()
export class CryptoEffects {
  constructor(
    private actions$: Actions,
    private fetchservice: CryptofetchServiceService
  ) {}

  loadCryptoData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CryptoActions.loadCryptoData),
      switchMap(() => {
        console.log('loadCryptoData effect triggered');
        return this.fetchservice.getAllCrypto(1).pipe(
          map((data) => {
            return CryptoActions.loadCryptoDataSuccess({ data: data as CryptoData[] });
          }),
          catchError((error) => {
            console.error('Error:', error);
            return of(CryptoActions.loadCryptoDataFailure({ error }));
          })
        );
      })
    )
  );
}
