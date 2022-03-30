import { Injectable } from '@angular/core';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { IresponseAccount } from '@app/core/iresponse-account';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { User } from '@app/models/User';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  loadAccount,
  loadAccountSuccess,
  loadAccountFailure,
  loadUpdatedAccount,
  loadAccountError
} from '../actions/account.actions';
@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private accountFacadeService: AccountFacadeService
  ) {}
  loadAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAccount, loadUpdatedAccount),
      concatLatestFrom(() => this.accountFacadeService.account$),
      mergeMap(([action, account]) => {
        if (account === null || action.type === loadUpdatedAccount.type) {
          return this.authService.verifyAccount().pipe(
            map((data: IresponseAccount) => {
              if (data.message === 'jwt expired') {
                let error: any = {};
                error.error = data.message;
                return loadAccountError(error);
              }
              return loadAccountSuccess({ data: new User(data.data) });
            }),
            catchError((error) => of(loadAccountFailure(error)))
          );
        }
        return of(loadAccountSuccess({ data: account as User }));
      })
    );
  });
}
