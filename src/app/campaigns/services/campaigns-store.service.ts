import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  BehaviorSubject,
  from,
  of,
  throwError,
  Observable,
  merge,
  interval,
  Subject
} from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  retry,
  share,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
  toArray
} from 'rxjs/operators';
import { Campaign } from '@app/models/campaign.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { IcreatorStatistics } from '../../models/icreator-statistics';
import { getDateObjectFrom } from '@helpers/utils/common';
import { FormatDataService } from '@campaigns/services/format-data.service';

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

  /**
   * @name creatorStatsSubject
   * @desc An object containing user -creator- statistics like:
   *       - Total earnings
   *       - Number of validated links
   *       - Number of accepted links
   *       - ...
   * @type {BehaviorSubject<IcreatorStatistics>}
   */
  private readonly creatorStatsSubject: BehaviorSubject<IcreatorStatistics>;

  /**
   * @name creatorStats$
   * @desc An observable of steamed value from the creatorStatsSubject.
   * @type {Observable<IcreatorStatistics>}
   */
  public readonly creatorStats$: Observable<IcreatorStatistics>;
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
    this.creatorStatsSubject = new BehaviorSubject<IcreatorStatistics>({
      totalEarnedInSaTT: '0',
      totalEarnedInUSD: '0',
      numberOfAcceptedLinks: 0,
      numberOfRejectedLinks: 0,
      numberOfPendingLinks: 0,
      numberOfValidatedLinks: 0
    });

    this.creatorStats$ = this.creatorStatsSubject.asObservable();
    this.getCreatorStats();
  }

  set campaign(c: Campaign) {
    this.campaignBehaviorSubject.next(c);
  }

  get campaign(): Campaign {
    return this.campaignBehaviorSubject.getValue();
  }

  initCampaignStore(id: string) {
    this.campaignService
      .getOneById(id)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((c) => {
        this.campaign = new Campaign(c);
      });
  }

  updateOneById(values: any, id: string) {
    let data = this.formatData.manipulateDataBeforeSend(values);
    this.campaignService
      .updateOneById(data, this.campaign.id)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((res) => {
        this.campaign = new Campaign(res.updatedCampaign);
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

  private setCreatorStats(value: IcreatorStatistics): void {
    this.creatorStatsSubject.next(value);
  }
  get campaignsByWalletId() {
    return this.campaignsListByWalletIdSubject.getValue();
  }

  get campaigns() {
    return this.campaignsListSubject.getValue();
  }

  // getNextPage() {

  //   let obs =

  // }

  /**
   * Gets the campaigns cover images
   * @param array campaign list
   */
  private getCampaignsCovers(campaigns: any[]): void {
    campaigns.forEach((campaign: any) => {
      this.campaignService
        .getCampaignCover(campaign?.meta?._id || campaign._id, '')
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data: any) => {
          let objectURL = URL.createObjectURL(data);
          campaign.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
    });
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
    obs.pipe(takeUntil(this.isDestroyed)).subscribe((data) => {
      campaignsList = campaignsList.filter((campaign) => campaign._id !== id);
      this.setCampaignsByUserWalletId(campaignsList);
    });

    return obs;
  }

  /**
   * @name getCreatorStats
   * @desc Gets the user -creator- links and calculates the
   *        statistics.
   */
  private getCreatorStats(): void {
    let stats: IcreatorStatistics;
    this.campaignService
      .getCreatorlinks()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response: any) => {
        stats = {
          totalEarnedInSaTT: response.SattEarned,
          totalEarnedInUSD: response.USDEarned,
          numberOfAcceptedLinks: 0,
          numberOfRejectedLinks: 0,
          numberOfPendingLinks: 0,
          numberOfValidatedLinks: 0
        };
        this.setCreatorStats(stats);
      });

    //this.campaignService.getAcceptedPromsbyOwner
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
