import { Injectable } from '@angular/core';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { filter, mapTo, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CampaignsDashboardService {
  private onFilterChangesSubject = new BehaviorSubject({});
  readonly onFilterChanges$ = this.onFilterChangesSubject.asObservable();
  private onPageScrollSubject = new Subject();
  readonly onPageScroll$ = this.onPageScrollSubject.asObservable();
  private requestedPathUrlChangesSubject = new BehaviorSubject<string>('');
  readonly requestedPathUrlChanges$ =
    this.requestedPathUrlChangesSubject.asObservable();

  constructor(
    private campaignsListStore: CampaignsListStoreService,
    private participationListService: ParticipationListStoreService
  ) {
    //TODO: Refactor campaigns services
    // merge(
    //   this.requestedPathUrlChanges$.pipe(
    //     filter((url: string) => {
    //       return url.split("/").slice(-1)[0] === "ad-pools";
    //     }),
    //     tap(console.log),
    //     mapTo(true) // true means load first page
    //   ),
    //   this.onFilterChanges$.pipe(tap(console.log), mapTo(true)),
    //   this.onPageScroll$.pipe(mapTo(false)) // false means load next page
    // ).subscribe((isFirstPageRequested: boolean) => {
    //   console.log(isFirstPageRequested)
    //   this.campaignsListStore.getAllCampaigns(
    //     isFirstPageRequested,
    //     this.onFilterChangesSubject.getValue()
    //   );
    // });
    merge(
      this.requestedPathUrlChanges$.pipe(
        filter((url: string) => {
          return url.split('/').slice(-1)[0].startsWith('farm-posts');
        }),
        mapTo(true) // true means load first page
      ),
      this.onFilterChanges$.pipe(mapTo(true)),
      this.onPageScroll$.pipe(mapTo(false)) // false means load next page
    ).pipe(
      switchMap((isFirstPageRequested: boolean) => {
        return this.participationListService.loadNextPage(
          this.onFilterChangesSubject.getValue(),
          isFirstPageRequested,
          { campaignId: '', state: '' }
        );
      })
    );
  }

  get filterFormValue() {
    return this.onFilterChangesSubject.getValue();
  }

  requestedPathUrl(url: string) {
    this.requestedPathUrlChangesSubject.next(url);
  }

  setFilterValues(values: any) {
    this.onFilterChangesSubject.next(values);
  }

  emitPageScroll() {
    this.onPageScrollSubject.next('');
  }
}
