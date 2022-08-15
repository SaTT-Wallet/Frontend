import { Injectable } from '@angular/core';
import { ESocialMediaNames } from '@app/core/enums';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as SocialAccountsActions from './social-accounts.actions';
import { EStoreErrorCodes } from './social-accounts.actions';

@Injectable()
export class SocialAccountsEffects {
  setFacebookPageVisited$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SocialAccountsActions.pageVisited),
      mergeMap(({ pageVisited }) => {
        if (pageVisited === ESocialMediaNames.facebook) {
          this.tokenStorageService.setSecureWallet('visited-facebook', 'true');
        }
        if (pageVisited === ESocialMediaNames.twitter) {
          this.tokenStorageService.setSecureWallet('visited-twitter', 'true');
        }
        if (pageVisited === ESocialMediaNames.youtube) {
          this.tokenStorageService.setSecureWallet('visited-google', 'true');
        }
        if (pageVisited === ESocialMediaNames.linkedIn) {
          this.tokenStorageService.setSecureWallet('visited-linkedin', 'true');
        }
        if (pageVisited === ESocialMediaNames.tiktok) {
          this.tokenStorageService.setSecureWallet('visited-tiktok', 'true');
        }
        const userId = this.tokenStorageService.getUserId() as string;
        return this.authService
          .setVisitSignUpStep({ visitedStep: pageVisited, userId })
          .pipe(
            map(() => {
              return SocialAccountsActions.pageVisitedSuccess({
                pageVisited
              });
            }),
            catchError(() => {
              return of(
                SocialAccountsActions.pageVisitedFailure({
                  error: {
                    code: EStoreErrorCodes.SAVE_TO_LOCALSTORAGE_ERROR,
                    message: 'Could not save to localStorage'
                  }
                })
              );
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private tokenStorageService: TokenStorageService,
    private authService: AuthService
  ) {}
}
