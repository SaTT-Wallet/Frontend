import { HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '@app/models/campaign.model';
import { Page } from '@app/models/page.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import {
  BehaviorSubject,
  Observable,
  of,
  concat,
  interval,
  range,
  Subject,
  merge
} from 'rxjs';
import {
  map,
  share,
  take,
  tap,
  repeat,
  mapTo,
  takeUntil
} from 'rxjs/operators';

interface CampaignsListStore {
  pages: Page<Campaign>[];
}

@Injectable({
  providedIn: 'root'
})
export class CampaignsListStoreService {
  count: number = 0;

  private _sortCampaignsOnMobile = new BehaviorSubject(null);
  readonly sortCampaignsOnMobile$ = this._sortCampaignsOnMobile.asObservable();
  private onFilterChangesSubject = new BehaviorSubject({});
  readonly onFilterChanges$ = this.onFilterChangesSubject.asObservable();
  private onPageScrollSubject = new Subject();
  readonly onPageScroll$ = this.onPageScrollSubject.asObservable();
  private isDestroyed = new Subject();

  array = [
    {
      pageNumber: 0,
      size: 0,
      items: []
    }
  ];
  private listSubject: BehaviorSubject<Page<Campaign>[] | any> =
    new BehaviorSubject(this.array);
  private _loadingCampaign: Subject<any> = new Subject();
  readonly loadingCampaign$ = this._loadingCampaign.asObservable();
  readonly list$: Observable<Page<Campaign>[]> =
    this.listSubject.asObservable();

  nextPage: Page<Campaign> = {
    pageNumber: 0,
    size: 10,
    items: []
  };

  constructor(
    private campaignsService: CampaignHttpApiService,
    private router: Router
  ) {
    merge(
      this.onFilterChanges$.pipe(mapTo(true)),
      this.onPageScroll$.pipe(mapTo(false)) // false means load next page
    )
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((isFirstPageRequested: boolean) => {
        this.loadNextPage(
          this.onFilterChangesSubject.getValue(),
          isFirstPageRequested
        );
      });
  }

  setListCampaign(list: Page<Campaign>[]): void {
    this.listSubject.next(list);
  }

  get list() {
    return this.listSubject.getValue();
  }
  get countCampaigns() {
    return this.count;
  }
  setFilterValues(values: any) {
    this.onFilterChangesSubject.next(values);
  }

  emitPageScroll() {
    this.onPageScrollSubject.next('');
  }

  loadNextPage(
    filterOptions: any,
    firstLoad: boolean
  ): Observable<Page<Campaign>[]> {
    return this.getAllCampaigns(firstLoad, filterOptions);
  }

  getAllCampaigns(firstLoad: boolean, filterOptions: any) {
    this._loadingCampaign.next(true);

    this.nextPage.pageNumber = firstLoad ? 0 : this.nextPage.pageNumber;

    if (this.nextPage.items.length || this.nextPage.pageNumber === 0) {
      this.router.url.includes('welcome')
        ? (this.nextPage.size = 9)
        : (this.nextPage.size = 10);
      let obs = this.campaignsService
        .allCampaigns(
          ++this.nextPage.pageNumber,
          this.nextPage.size,
          this.getFilterQueryString(filterOptions)
        )
        .pipe(share());
      obs
        .pipe(
          map((res: any) => {
            this.count = res.count;
            if (!!res) {
              return [
                res.count,
                !!res.campaigns? res.campaigns.map((c: any) => new Campaign(c)): []
              ];
            }
            return [];
          }),
          takeUntil(this.isDestroyed)
        )
        .subscribe((data) => {
          this._loadingCampaign.next(false);
          this.nextPage.items = data[1];
          let pages: Page<Campaign>[] = this.list;
          if (pages.length && firstLoad) {
            pages = [];
          }
          pages.push({ ...this.nextPage });
          this.setListCampaign(pages);
        });

      return obs;
    } else {
      this._loadingCampaign.next(false);
      return of([] as Campaign[]);
    }
  }
  private getFilterQueryString(options: any) {
    let queryParams = new HttpParams({
      fromObject: {
        searchTerm: options.searchTerm || '',
        status: options.status || '',
        blockchainType: options.blockchainType || '',
        oracles: options.oracles || '',
        remainingBudget: Object.values(options.remainingBudget || []) || '',
        showOnlyLiveCampaigns: options.showOnlyLiveCampaigns || '',
        showOnlyMyCampaigns: options.showOnlyMyCampaigns || '',
        remuneration: options.remuneration || ''
      }
    });

    return queryParams;
  }

  clearStore() {
    this.setListCampaign([]);
  }
  setAdPoolCampaignsListSort(sortItem: any) {
    this._sortCampaignsOnMobile.next(sortItem);
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
