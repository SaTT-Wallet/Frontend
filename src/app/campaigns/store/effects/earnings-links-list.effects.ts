import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { Router } from '@angular/router';
@Injectable()
export class LinksListEffects {
  constructor(
    private actions$: Actions,
    private campaignsService: CampaignHttpApiService,
    private router: Router
  ) {}

  loadEarningsLinksList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType('[EarningsLinksList] Load Earnings links'),
      mergeMap((action: any) => {
        return this.campaignsService
          .userParticipations(
            action.pageNumber,
            action.pageSize,
            action.filterOptions,
            action.campaignId,
            action.state
          )
          .pipe(
            map((links) => {
              return {
                type: '[LinksList] Load LinksLists Success',
                data: links
              };
            }),
            catchError(() => EMPTY)
          );
      })
    );
  });
}
