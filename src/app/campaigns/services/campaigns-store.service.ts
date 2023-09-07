import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Campaign } from '@app/models/campaign.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { FormatDataService } from '@campaigns/services/format-data.service';
import { ICampaignResponse } from '@app/core/campaigns-list-response.interface';
import { IApiResponse } from '@app/core/types/rest-api-responses';

@Injectable({
  providedIn: 'root'
})
export class CampaignsStoreService {
  /**
   * @name campaignsListByWalletIdSubject
   * @desc List of campaigns by wallet id subject.
   * @type {BehaviorSubject<any[]>}
   */
  private readonly campaignsListByWalletIdSubject: BehaviorSubject<any[]>;

  /**
   * @name campaignsListByWalletId$
   * @desc Campaigns list by wallet id as observable stream. This will be exposed outside
   * the function to be consumed as data stream.
   * @type {Observable<any[]>}
   */
  public readonly campaignsListByWalletId$: Observable<any[]>;

  /**
   * @name campaignsListSubject
   * @desc List of campaigns subject.
   * @type {BehaviorSubject<any[]>}
   */
  private readonly campaignsListSubject: BehaviorSubject<any[]>;

  /**
   * @name campaignsList$
   * @desc Campaigns list as read only observable stream. This will be exposed
   *       to other components to consume the store.
   * @type {Observable<any[]>}
   */
  public readonly campaignsList$: Observable<any[]>;

  private isDestroyed = new Subject();

  public emitLogoCampaignUpdated = new Subject();
  private campaignBehaviorSubject: BehaviorSubject<Campaign> =
    new BehaviorSubject(new Campaign());
  readonly campaign$: Observable<Campaign> = this.campaignBehaviorSubject
    .asObservable()
    .pipe(filter((c) => c.id !== ''));

  constructor(
    private campaignService: CampaignHttpApiService,
    private sanitizer: DomSanitizer,
    private localStorageService: TokenStorageService,
    private formatData: FormatDataService
  ) {
    this.campaignsListByWalletIdSubject = new BehaviorSubject<any[]>([]);
    this.campaignsListByWalletId$ = this.campaignsListByWalletIdSubject
      .asObservable()
      .pipe(filter((list: any) => list.length));
    this.campaignsListSubject = new BehaviorSubject<any[]>([]);
    this.campaignsList$ = this.campaignsListSubject.asObservable();
  }

  setCampaign(c: Campaign) {
    this.campaignBehaviorSubject.next(c);
  }

  get campaign(): Campaign {
    return this.campaignBehaviorSubject.getValue();
  }

  initCampaignStore(id: string) {
    this.campaignService
      .getOneById(id)
      .pipe(
        takeUntil(this.isDestroyed),
        map((res: any) => res.data)
      )
      .subscribe((c) => {
        let campaign = new Campaign(c);
        campaign.ownedByUser =
          Number(campaign.ownerId) ===
          Number(this.localStorageService.getUserId());
        this.setCampaign(campaign);
      });
  }

  updateOneById(values: any) {
    let data = this.formatData.manipulateDataBeforeSend(values);
    this.campaignService
      .updateOneById(data, this.campaign.id)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((res: IApiResponse<ICampaignResponse> | null) => {
        let campaign = new Campaign(res?.data);

        campaign.ownedByUser =
          Number(campaign.ownerId) ===
          Number(this.localStorageService.getUserId());
        this.setCampaign(campaign);

        this.emitLogoCampaignUpdated.next(true);
      });
  }

  /**
   * will return the last list of campaigns emitted by BehaviorSubject.
   */
  public get campaignsListByWalletId(): any[] {
    return this.campaignsListByWalletIdSubject.getValue();
  }

  /**
   * Update campaigns list.
   * @param list
   */
  private setCampaignsList(list: any[]): void {
    this.campaignsListSubject.next(list);
  }

  /**
   * Update campaigns by wallet id list.
   * @param list
   */
  private setCampaignsByUserWalletId(list: any[]): void {
    this.campaignsListByWalletIdSubject.next(list);
  }

  get campaignsByWalletId() {
    return this.campaignsListByWalletIdSubject.getValue();
  }

  get campaigns() {
    return this.campaignsListSubject.getValue();
  }

  addDraftCampaign(draftCampaign: any) {
    let campaignsList: any = this.campaignsListByWalletIdSubject.getValue();

    this.campaignService
      .getCampaignCover(draftCampaign._id || draftCampaign.id, '')
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        var binaryData = [];
        binaryData.push(data);
        let objectURL = window.URL.createObjectURL(
          new Blob(binaryData, { type: 'application/zip' })
        );

        // let objectURL = URL.createObjectURL(data);
        draftCampaign.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      });
    campaignsList.push(draftCampaign);
    this.setCampaignsByUserWalletId(campaignsList);
  }

  /**
   * @name updateDraftCampaign
   * @desc Update one item draft campaign in the store -global state-
   */
  updateDraftCampaign(campaign: Campaign) {
    // this.campaignService
    //   .getCampaignCover(campaign._id)
    //   .pipe(retry(1))
    //   .subscribe(
    //     (data: any) => {
    //       let objectURL = URL.createObjectURL(data);
    //       campaign.cover = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    //     },
    //     (error: any) => console.log("get campaign covers: ", error)
    //   );

    let list: Campaign[] = this.campaignsByWalletId.filter(
      (elem: Campaign) => elem.id !== campaign.id
    );
    let newList: any[] = [...list, campaign];
    this.setCampaignsByUserWalletId(newList);
  }

  removeDraftCampaign(id: string) {
    let campaignsList = this.campaignsListByWalletIdSubject.getValue();
    let obs = this.campaignService.deleteDraft(id);
    obs.pipe(takeUntil(this.isDestroyed)).subscribe(() => {
      campaignsList = campaignsList.filter((campaign) => campaign._id !== id);
      this.setCampaignsByUserWalletId(campaignsList);
    });

    return obs;
  }

  /**
   * @name clearDataStore
   * @desc Clears the data store usually get called when used logout to wipe all his data from memory.
   */
  clearDataStore(): void {
    this.setCampaignsByUserWalletId([]);
    this.setCampaignsList([]);

    this.campaignBehaviorSubject.next(new Campaign());
  }

  clearCampaignDetailsStore() {
    this.campaignBehaviorSubject.next(new Campaign());
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
