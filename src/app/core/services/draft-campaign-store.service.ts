import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, concatMap, map, retry, tap } from 'rxjs/operators';
import { CampaignHttpApiService } from '../services/campaign/campaign.service';
import { arrayCountries } from '@config/atn.config';
import { Campaign } from '../../models/campaign.model';

import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormatDataService } from '@campaigns/services/format-data.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class DraftCampaignStoreService {
  private draftSubject: BehaviorSubject<Campaign>;
  private isLoaded = false;

  constructor(
    private campaignService: CampaignHttpApiService,
    private campaignsStore: CampaignsStoreService,
    private sanitizer: DomSanitizer,
    private formatData: FormatDataService,
    private localeStorageService: TokenStorageService
  ) {
    let emptyDraft = new Campaign();
    this.draftSubject = new BehaviorSubject<Campaign>(emptyDraft);
  }

  init(id?: string) {
    if (id) {
      this.getDraft(id);
    } else {
      this.setDraft(new Campaign());
    }
  }

  private setDraft(object: any) {
    this.draftSubject.next(object);
  }

  public get draft$(): Observable<any> {
    return this.draftSubject.asObservable();
  }

  public get draft() {
    return this.draftSubject.getValue();
  }

  setStore(object: Campaign) {
    this.setDraft({ ...object });
  }

  getDraft(id: string) {
    //  console.log('from get draft => ', id)
    this.campaignService
      .getOneById(id)
      .pipe(
        map((data: any) => {
          const campaign = new Campaign(data.data);
          campaign.ownedByUser =
            Number(campaign.ownerId) ===
            Number(this.localeStorageService.getIdUser());
          return campaign;
        }),
        //tap(console.log),
        //TODO: create a custom operator to reduce redundance.
        //tap((c) => console.log("sdfsqdfqsfqsf", c)),
        // map((campaign: Campaign) => {
        //   campaign.tags = Object.values(campaign.tags);
        //   if (campaign.targetedCountries[0] === "ALL") {
        //     campaign.targetedCountries = arrayCountries;
        //   } else {
        //     campaign.targetedCountries = campaign.targetedCountries.map(
        //       (code: string, index: number) =>
        //         arrayCountries.filter((elem: any) => elem.code === code)[0]
        //     );
        //   }

        //   return campaign;
        // }),
        //tap(console.log),
        //  tap((_) => console.log('form draft store => ', _)),
        tap((response) => {
          if (response) {
            this.isLoaded = true;
          }
        })
      )
      .subscribe((draft: Campaign) => {
        //  console.log('from get draft => ', draft)
        this.setStore(draft);
      });
  }

  /**
   * Add new draft campaign and update the store.
   * @param object with draft campaign data
   * @returns {Observable}
   */
  public addNewDraft(object: any): Observable<Campaign> {
    let values = this.formatData.manipulateDataBeforeSend(object);

    let obs = this.campaignService
      .createNewDraftCampaign(values)
      .pipe(map((data) => new Campaign(data.data)));
    obs
      .pipe
      //tap(console.log),
      // concatMap((campaign: any) => {
      //   return this.campaignService
      //     .getCampaignCover(campaign._id)
      //     .pipe(
      //       retry(1),
      //       tap((cover) => console.log(cover)),
      //       map((data: any) => {
      //         let objectURL = URL.createObjectURL(data);
      //         campaign.img = objectURL
      //         return campaign;
      //       }),
      //       catchError((err) => {
      //         return of(campaign);
      //       })
      //     );
      // }),
      // tap((c) => console.log(c))
      // map((campaign: Campaign) => {
      //   campaign.tags = Object.values(campaign.tags);
      //   if (campaign.targetedCountries[0] === "ALL") {
      //     campaign.targetedCountries = arrayCountries;
      //   } else {
      //     campaign.targetedCountries = campaign.targetedCountries.map(
      //       (code: string, index: number) =>
      //         arrayCountries.filter((elem: any) => elem.code === code)[0]
      //     );
      //   }

      //   return campaign;
      // })
      //tap(console.log)
      ()
      .subscribe((campaign: Campaign) => {
        //  console.log('object campaign before saving it as draft');
        //  console.log(campaign);
        if (campaign.id) {
          this.setDraft(campaign);
          this.campaignsStore.addDraftCampaign(campaign);
        }
      });

    return obs as Observable<Campaign>;
  }

  /**
   *
   * @param values
   * @param id
   * @returns
   */
  public updateDraft(values: any, id: string) {
    values = this.formatData.manipulateDataBeforeSend(values);
    let obs = this.campaignService.updateOneById(values, id);
    obs
      .pipe(
        map((response: any) => response.updatedCampaign),
        catchError(() => {
          //TODO: handle errors with error handling service instead of logging them to console.
          // console.log(err);
          return of(this.draftSubject.getValue());
        }),
        concatMap((campaign) => {
          return this.campaignService
            .getCampaignCover(campaign?.meta?._id || campaign._id, '')
            .pipe(
              retry(1),
              tap(() => {}),
              map((data: any) => {
                let objectURL = URL.createObjectURL(data);
                campaign.img = objectURL;
                return campaign;
              }),
              catchError(() => {
                return of(campaign);
              })
            );
        }),
        map((data) => new Campaign(data)),
        //tap(console.log),
        map((campaign: Campaign) => {
          campaign.tags = Object.values(campaign.tags);
          if (campaign.targetedCountries[0] === 'ALL') {
            campaign.targetedCountries = arrayCountries;
          } else {
            campaign.targetedCountries = campaign.targetedCountries.map(
              (code: string) =>
                arrayCountries.filter((elem: any) => elem.code === code)[0]
            );
          }

          return campaign;
        })
      )
      .subscribe((campaign: Campaign) => {
        console.log('ezaeaze', campaign);
        if (campaign) {
          this.setDraft(campaign);
          this.campaignsStore.updateDraftCampaign(campaign);
        }
      });

    return obs;
  }
}
