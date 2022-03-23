import { Injectable } from '@angular/core';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  loadSocialAccountss,
  loadSocialAccountssFailure,
  loadSocialAccountssSuccess,
  loadUpdatedSocialAccountss
} from '../actions/social-accounts.actions';
import { IGetSocialNetworksResponse } from '../reducers/social-accounts.reducer';
@Injectable()
export class SocialAccountsEffects {
  constructor(
    private actions$: Actions,
    private socialAccountFacadeService: SocialAccountFacadeService
  ) {}
  loadSocialAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSocialAccountss, loadUpdatedSocialAccountss),
      concatLatestFrom(() => this.socialAccountFacadeService.socialAccount$),
      mergeMap(([action, account]) => {
        if (
          account === null ||
          action.type === loadUpdatedSocialAccountss.type
        ) {
          return this.socialAccountFacadeService.getSocialNetworks().pipe(
            map((data: any) => {
              if (data.message === 'success') {
                return loadSocialAccountssSuccess({ data });
              } else {
                return loadSocialAccountssFailure(data);
              }
            }),
            catchError((error: any) => of(loadSocialAccountssFailure(error)))
          );
        }
        return of(
          loadSocialAccountssSuccess({
            data: account as IGetSocialNetworksResponse
          })
        );
      })
    );
  });
}
