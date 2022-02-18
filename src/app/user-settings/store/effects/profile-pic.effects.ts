import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ProfileService } from '@core/services/profile/profile.service';

@Injectable()
export class ProfilePicEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService
  ) {}

  loadProfilePic$ = createEffect(() => {
    return this.actions$.pipe(
      ofType('[ProfilePic] Load ProfilePics'),
      mergeMap((action: any) => {
        return this.profileService.getUserProfilePic().pipe(
          map((data) => {
            return {
              type: '[ProfilePic] Load ProfilePics Success',
              data: data
            };
          }),
          catchError(() => EMPTY)
        );
      })
    );
  });
}
