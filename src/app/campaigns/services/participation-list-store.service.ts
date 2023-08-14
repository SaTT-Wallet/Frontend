import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Participation } from '@app/models/participation.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { BehaviorSubject, Observable, of, Subject, merge } from 'rxjs';
import {
  map,
  mapTo,
  filter,
  switchMap,
  takeUntil,
  tap,
  take,
  startWith
} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { compare } from '@helpers/utils/math';
import { youtubeThumbnail } from '@app/config/atn.config';
import { Page } from '@app/models/page.model';
import { Store } from '@ngrx/store';
import { CampaignsService } from '@campaigns/facade/campaigns.facade';
import { Big } from 'big.js';

@Injectable({
  providedIn: 'root'
})
export class ParticipationListStoreService {
  private isDestroyed = new Subject();
  isEarnings: boolean = false;
  public onFilterChangesSubject = new BehaviorSubject<{
    [key: string]: string | [] | number;
  }>({});
  readonly onFilterChanges$ = this.onFilterChangesSubject.asObservable();
  private onPageScrollSubject = new Subject();
  readonly onPageScroll$ = this.onPageScrollSubject.asObservable();
  private listSubject: BehaviorSubject<Page<Participation>[]> =
    new BehaviorSubject([] as Page<Participation>[]);
  readonly list$: Observable<Page<Participation>[]> = this.listSubject
    .asObservable()
    .pipe(
      takeUntil(this.isDestroyed),
      filter((pages: Page<Participation>[]) => pages.length !== 0)
    );

  private listLinksSubject: BehaviorSubject<Page<Participation>[]> =
    new BehaviorSubject([] as Page<Participation>[]);
  readonly listLinks$: Observable<Page<Participation>[]> = this.listLinksSubject
    .asObservable()
    .pipe(
      takeUntil(this.isDestroyed),
      filter((pages: Page<Participation>[]) => pages.length !== 0)
    );
  readonly linksList$ = this.campaignFacade.linksList$;
  triggerLoadLinksList = new BehaviorSubject(false);
  readonly triggerLoadLinksListObs = this.triggerLoadLinksList
    .asObservable()
    .pipe(
      takeUntil(this.isDestroyed),
      filter((value) => !!value)
    );

  queryParams = new BehaviorSubject<{ [key: string]: string }>({});
  nextPage: Page<Participation> = {
    pageNumber: 0,
    size: 10,
    items: []
  };
  count: number = 0;
  constructor(
    private campaignsService: CampaignHttpApiService,
    private campaignFacade: CampaignsService,
    private sanitizer: DomSanitizer,
    private store: Store<ParticipationListStoreService>
  ) {}

  setQueryParams(queryParams: any) {
    this.setListParticipants([]);
    this.setListFarming([]);
    if (queryParams.campaignId === '') {
      this.isEarnings = false;
    } else {
      this.isEarnings = true;
    }
    this.queryParams.next(queryParams);
  }

  setFilterValues(values: any) {
    this.onFilterChangesSubject.next(values);
  }

  emitPageScroll() {
    this.onPageScrollSubject.next('');
  }

  setListFarming(list: Page<Participation>[]): void {
    this.listSubject.next(list);
  }

  get listFarming() {
    return this.listSubject.getValue();
  }

  setListParticipants(listLinks: Page<Participation>[]): void {
    this.listLinksSubject.next(listLinks);
  }

  get listParticipants() {
    return this.listLinksSubject.getValue();
  }

  loadNextPage(
    filterOptions: any,
    firstLoad: boolean,
    query: any
  ): Observable<Page<Participation>[]> {
    return this.getUserParticipations(firstLoad, filterOptions, query);
  }

  private getUserParticipations(
    firstLoad: boolean,
    filterOptions: any,
    query: any
  ) {
    let basicTotalToEarn :string;
    this.nextPage.pageNumber = firstLoad ? 0 : this.nextPage.pageNumber;

    if (this.nextPage.items.length || this.nextPage.pageNumber === 0) {
      let obs = this.campaignsService.userParticipations(
        ++this.nextPage.pageNumber,
        this.nextPage.size,
        this.getFilterQueryString(filterOptions),
        query.campaignId,
        query.state
      );
      obs
        .pipe(
          takeUntil(this.isDestroyed),
          map((response: any) => {
            if (response.message === 'success') {
              this.count = response.data.count;
              response.data.Links.forEach((element: any) => {
                basicTotalToEarn = element.totalToEarn

                if(typeof element.appliedDate === 'number' )
{
                element.appliedDate = this.createDateFromUnixTimestamp(
                  element.appliedDate
                );}

                if (element.status !== true) element.totalToEarn = '0';
                if (
                  element.totalToEarn &&
                  compare(element.totalToEarn).gte(element.campaign.remaining)
                ) {
                  element.totalToEarn = element.campaign.remaining;
                }
                if (element.totalToEarn && element.payedAmount) {
                  if (
                    new Big(element.totalToEarn).gte(
                      new Big(element.payedAmount)
                    )
                  ) {
                    element.totalToEarn = new Big(element.totalToEarn)
                      .minus(new Big(element.payedAmount))
                      .toFixed();
                  }

                  element.sum =
                    element?.totalToEarn &&
                    element?.payedAmount &&
                    new Big(basicTotalToEarn).gt(element?.payedAmount)
                      ? new Big(element?.totalToEarn)
                          .plus(element?.payedAmount)
                          .toFixed()
                      : new Big(element?.totalToEarn).lte(element?.payedAmount)
                      ? element?.payedAmount
                      : element?.totalToEarn;
                  if (
                    element.isPayed === true &&
                    element?.payedAmount !== '0'
                  ) {
                    element.sum = element?.payedAmount;
                  }
                } else if (element.totalToEarn && !element.payedAmount) {
                  element.sum = element?.totalToEarn;
                }
                element.typeSN = Number(element.typeSN);
                //................................................................................................
                element.safeURL = this.generatePostThumbnail(element);
                element.link = this.generatePostLink(element);

                //  if(!element.totalToEarn && element.status ==='true'){
                //   element.totalToEarn=0;
                //  }
                // element.campaign.description=this.sanitizer.bypassSecurityTrustHtml(element.campaign.description)
              });
              return response;
            }
          }),
          map((res: any) => {
            if (res && res.message === 'success') {
              return [
                res.data.count,
                res.data.Links.map((c: any) => new Participation(c))
              ];
            } else {
              return [];
            }
          })
        )
        .subscribe((data) => {
          this.nextPage.items = data[1];
          let pages: Page<Participation>[];
          if (this.isEarnings) {
            pages = this.listParticipants;
          } else {
            pages = this.listFarming;
          }

          if (pages.length && firstLoad) {
            pages = [];
          }
          pages.push({ ...this.nextPage });

          if (this.isEarnings) {
            this.setListParticipants(pages);
          } else {
            this.setListFarming(pages);
          }
        });
      return obs;
    }
    return of([] as Participation[]);
  }

  /*private getUserParticipations(
    firstLoad: boolean,
    filterOptions: any,
    query: any
  ) {
/!*
    this.nextPage.pageNumber = firstLoad ? 0 : this.nextPage.pageNumber;
*!/


      this.nextPage.pageNumber = this.nextPage.pageNumber + 1;
      this.store.dispatch(
        fromListLinksActions.loadLinksLists({
          pageNumber: this.nextPage.pageNumber,
          pageSize: this.nextPage.size,
          filterOptions: this.getFilterQueryString(filterOptions),
          campaignId: query.campaignId,
          state: query.state,
          firstLoad: firstLoad
        })
      );
      let obs = this.campaignsService.userParticipations(
        this.nextPage.pageNumber,
        this.nextPage.size,
        this.getFilterQueryString(filterOptions),
        query.campaignId,
        query.state
      );
      /!*this.linksList$.subscribe((links) => {
        let list = [
          ...this.newHandledLinks(cloneDeep(links)).map(
            (element) => new Participation(element)
          )
        ];
        this.nextPage.items = list;
        this.count = list.length;
        let pages: Page<Participation>[];
        if (this.isEarnings) {
          pages = this.listParticipants;
        } else {
          pages = this.listFarming;
        }
        if (pages.length && firstLoad) {
          pages = [];
        }
        pages.push({ ...this.nextPage });

        if (this.isEarnings) {
          this.setListParticipants(pages);
        } else {
          this.setListFarming(pages);
        }
      });*!/
      /!*obs
        .pipe(
          map((links: any) => {
            this.count = links.count;
            links.Links.forEach((element: any) => {
              element.appliedDate = this.createDateFromUnixTimestamp(
                element.appliedDate
              );
              if (element.status !== true) element.totalToEarn = '0';
              if (
                element.totalToEarn &&
                compare(element.totalToEarn).gte(element.campaign.remaining)
              ) {
                element.totalToEarn = element.campaign.remaining;
              }
              if (element.totalToEarn && element.payedAmount) {
                if (
                  new Big(element.totalToEarn).gte(new Big(element.payedAmount))
                ) {
                  element.totalToEarn = new Big(element.totalToEarn)
                    .minus(new Big(element.payedAmount))
                    .toFixed();
                }
                element.sum =
                  element?.totalToEarn && element?.payedAmount
                    ? new Big(element?.totalToEarn)
                      .plus(element?.payedAmount)
                      .toFixed()
                    : element?.totalToEarn;
                if (element.isPayed === true && element?.payedAmount !== '0') {
                  element.sum = element?.payedAmount;
                }
              } else if (element.totalToEarn && !element.payedAmount) {
                element.sum = element?.totalToEarn;
              }
              //................................................................................................
              element.safeURL = this.generatePostThumbnail(element);
              element.link = this.generatePostLink(element);

              //  if(!element.totalToEarn && element.status ==='true'){
              //   element.totalToEarn=0;
              //  }
              // element.campaign.description=this.sanitizer.bypassSecurityTrustHtml(element.campaign.description)
            });
            return links;          }),
          map((res: any) => {
            return [res.count, res.Links.map((c: any) => new Participation(c))];
          })
        )
        .subscribe((data) => {
          this.nextPage.items = data[1];
          let pages: Page<Participation>[];
          if (this.isEarnings) {
            pages = this.listParticipants;
          } else {
            pages = this.listFarming;
          }

          if (pages.length && firstLoad) {
            pages = [];
          }
          pages.push({ ...this.nextPage });

          if (this.isEarnings) {
            this.setListParticipants(pages);
          } else {
            this.setListFarming(pages);
          }
        });*!/
      return obs;

/!*
    return of([] as Participation[]);
*!/
  }*/

  private getFilterQueryString(options: any) {
    let queryParams = new HttpParams({
      fromObject: options
    });

    return queryParams;
  }

  get countLinks() {
    return this.count;
  }
  newHandledLinks(links: any[]) {
    links.forEach((element: any) => {
      element.appliedDate = this.createDateFromUnixTimestamp(
        element.appliedDate
      );
      if (element.status !== true) element.totalToEarn = '0';
      if (
        element.totalToEarn &&
        compare(element.totalToEarn).gte(element.campaign.remaining)
      ) {
        element.totalToEarn = element.campaign.remaining;
      }
      if (element.totalToEarn && element.payedAmount) {
        if (new Big(element.totalToEarn).gte(new Big(element.payedAmount))) {
          element.totalToEarn = new Big(element.totalToEarn)
            .minus(new Big(element.payedAmount))
            .toFixed();
        }
        element.sum =
          element?.totalToEarn && element?.payedAmount
            ? new Big(element?.totalToEarn).plus(element?.payedAmount).toFixed()
            : element?.totalToEarn;
        if (element.isPayed === true && element?.payedAmount !== '0') {
          element.sum = element?.payedAmount;
        }
      } else if (element.totalToEarn && !element.payedAmount) {
        element.sum = element?.totalToEarn;
      }
      //................................................................................................
      element.safeURL = this.generatePostThumbnail(element);
      element.link = this.generatePostLink(element);

      //  if(!element.totalToEarn && element.status ==='true'){
      //   element.totalToEarn=0;
      //  }
      // element.campaign.description=this.sanitizer.bypassSecurityTrustHtml(element.campaign.description)
    });
    return links;
  }

  createDateFromUnixTimestamp(unixTimestamp: number) {
    if (unixTimestamp) {
      var a = new Date(unixTimestamp * 1000);
      var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time =
        date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
      return time;
    } else {
      return;
    }
  }

  generatePostThumbnail(post: any): any {
    if (post.typeSN === 1) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.facebook.com/' + post.idUser + '/posts/' + post.idPost
      );
    } else if (post.typeSN === 3) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.instagram.com/p/' + post.idPost + '/'
      );
    } else if (post.typeSN === 4) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://twitter.com/' + post.idUser + '/status/' + post.idPost
      );
    } else {
      const idPost = post.idPost.split('&')[0];

      return this.sanitizer.bypassSecurityTrustResourceUrl(
        youtubeThumbnail + `${idPost}/0.jpg`
      );
    }
  }

  generatePostLink(post: any) {
    if (post.typeSN === 1) {
      return (
        'https://www.facebook.com/' + post.idUser + '/posts/' + post.idPost
      );
    } else if (post.typeSN === 3) {
      return 'https://www.instagram.com/p/' + post.idPost + '/';
    } else if (post.typeSN === 4) {
      return 'https://twitter.com/' + post.idUser + '/status/' + post.idPost;
    } else if (post.typeSN === 2) {
      return 'https://www.youtube.com/watch?v=' + post.idPost.split('&')[0];
    } else if (post.typeSN === 6) {
      // console.log(post)
      return 'https://www.tiktok.com/embed/' + post.idPost;
    } else {
      return `https://www.linkedin.com/feed/update/urn:li:${post.typeURL}:${post.idPost}/`;
    }
  }
  sanitizedDescription(value: any) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  clearDataFarming() {
    this.setListFarming([]);
  }
  clearDataParticipations() {
    this.setListParticipants([]);
  }
  loadLinks() {
    return merge(
      this.onFilterChanges$.pipe(
        takeUntil(this.isDestroyed),
        filter((filterOptions) => filterOptions.status !== undefined),
        startWith({}),
        mapTo(true)
      ),
      this.onPageScroll$.pipe(takeUntil(this.isDestroyed), mapTo(false)) // false means load next page
      //this.queryParams.pipe(takeUntil(this.isDestroyed), mapTo(true))
    ).pipe(
      // tap((v) => console.log(v)),
      switchMap((isFirstPageRequested) =>
        this.queryParams.pipe(
          take(1),
          takeUntil(this.isDestroyed),
          map((query) => {
            if (query && query.campaignId)
              return { query, isFirstPageRequested };
            return { query, isFirstPageRequested };
          })
        )
      ),
      tap(({ query, isFirstPageRequested }) => {
        this.loadNextPage(
          this.onFilterChangesSubject.getValue(),
          isFirstPageRequested,
          query
        );
      }),
      takeUntil(this.isDestroyed)
    );
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
