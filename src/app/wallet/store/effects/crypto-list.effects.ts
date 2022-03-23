import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { EMPTY } from 'rxjs';

@Injectable()
export class CryptoListEffects {
  constructor(
    private cryptoService: CryptofetchServiceService,
    private actions$: Actions
  ) {}

  loadCryptoList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType('[CryptoList] Load CryptoLists'),
      mergeMap((action: any) => {
        return this.cryptoService.getBalanceCrypto().pipe(
          map((res: any) => {
            return {
              type: '[CryptoList] Load CryptoLists Success',
              data: res.data.map((crypto: any) => {
                if (crypto.quantity === '-') {
                  return { ...crypto, quantity: 0 };
                }
                return crypto;
              })
            };
          }),
          catchError(() => EMPTY)
        );
      })
    );
  });
}
