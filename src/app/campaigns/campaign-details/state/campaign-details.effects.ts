import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import * as CampaignDetailsActions from './campaign-details.actions';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { Campaign } from '@app/models/campaign.model';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

@Injectable()
export class CampaignsEffects {
  loadCampaignDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CampaignDetailsActions.loadCampaignDetails),
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      concatMap((action: any) =>
        this.campaignHttpApiService.getOneById(action.id).pipe(
          map((data: any) => {
            const campaign = new Campaign(data.data);
            campaign.ownedByUser =
              Number(campaign.ownerId) ===
              Number(this.localStorageService.getIdUser());
            return campaign;
          }),
          map((campaign: Campaign) =>
            CampaignDetailsActions.campaignDetailsLoadSuccess({ campaign })
          ),
          catchError((error) =>
            of(CampaignDetailsActions.campaignDetailsLoadError(error))
          )
        )
      )
    );
  });

  loadCampaignKits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CampaignDetailsActions.loadCampaignKits),
      concatMap((action: any) =>
        this.campaignHttpApiService.getCampaignKitUrl(action.campaignId).pipe(
          map((res: any) =>
            CampaignDetailsActions.loadCampaignKitsSuccess({ kits: res.data })
          ),
          catchError((error: any) =>
            of(CampaignDetailsActions.loadCampaignKitsError({ error }))
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private campaignHttpApiService: CampaignHttpApiService,
    private localStorageService: TokenStorageService
  ) {}
}
