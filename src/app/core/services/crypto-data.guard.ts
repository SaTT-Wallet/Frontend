import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import * as CryptoActions from '../../wallet/store/actions/crypto.actions';
import { selectCryptoData } from '@app/wallet/store/selectors/crypto.selectors';

@Injectable({
  providedIn: 'root',
})
export class CryptoDataGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(selectCryptoData).pipe(
      take(1),
      switchMap((cryptoData) => {
        if (cryptoData && cryptoData.length > 0) {

          return of(true);
        } else {

          this.store.dispatch(CryptoActions.loadCryptoData());

          return of(true).pipe(
            catchError(() => {

              console.error('Failed to load crypto data.');
              return of(false); 
            })
          );
        }
      })
    );
  }
}