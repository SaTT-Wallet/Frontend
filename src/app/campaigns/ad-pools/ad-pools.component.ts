import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { Campaign } from '@app/models/campaign.model';
import { Page } from '@app/models/page.model';
import { User } from '@app/models/User';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { DraftCampaignStoreService } from '@core/services/draft-campaign-store.service';
import _ from 'lodash';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  mergeMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { AuthService } from '@core/services/Auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import introJs from 'intro.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { ProfileService } from '@app/core/services/profile/profile.service';
@Component({
  selector: 'app-ad-pools',
  templateUrl: './ad-pools.component.html',
  styleUrls: ['./ad-pools.component.scss']
})
export class AdPoolsComponent implements OnInit, OnDestroy {
  campaignsList: Campaign[] = [];
  campaignsList2: Campaign[] = [];

  show: boolean = true;
  picUserUpdated: boolean = false;
  user!: User;
  userPicture: any;
  subscription: Subscription | undefined;
  isLoading = true;
  introJS = introJs();
  intro1: string = '';
  intro2: string = '';
  intro3: string = '';
  intro4: string = '';

  // intro5: string = "";
  button: string = '';
  showModal = false;
  @ViewChild('welcomeModal', { static: false })
  public welcomeModal!: TemplateRef<any>;

  totalBudgetInvested$ = this.campaignService
    .getTotalInvestetd()
    .pipe(map((r: any) => r.totalInvested));

  totalBudgetInvestedInUSD$ = this.campaignService
    .getTotalInvestetd()
    .pipe(map((r: any) => r.totalInvestedUSD));
  idcamp: any;
  isFormatGrid = true;
  percentProfil: any;
  isChecked = false;
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  constructor(
    private accountFacadeService: AccountFacadeService,
    private campaignsListStoreService: CampaignsListStoreService,
    private campaignService: CampaignHttpApiService,
    private draftStore: DraftCampaignStoreService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private authStoreService: AuthStoreService,
    public tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private profileService: ProfileService,
    public translate: TranslateService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.onBoarding();
    this.loadCampaigns();
  }

  getUserPic() {
    this.subscription = this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .pipe(
        mergeMap((response: any) => {
          if (response !== null && response !== undefined) {
            this.picUserUpdated = response.photoUpdated;
            this.user = new User(response);
            return this.profileSettingsFacade.profilePic$;
          }
          return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$),

        mergeMap((profile: any) => {
          if (
            (this.user.idSn === 0 ||
              (this.picUserUpdated && this.user.idSn !== 0)) &&
            !!profile
          ) {
            let objectURL = URL.createObjectURL(profile);
            this.user.userPicture =
              this.sanitizer.bypassSecurityTrustUrl(objectURL);
          } else if (this.user.picLink) {
            this.user.userPicture = this.user?.picLink;
          }
          // TODO: load campaigns list here
          return this.campaignsListStoreService.list$.pipe(
            map((pages: Page<Campaign>[]) =>
              _.flatten(pages.map((page: Page<Campaign>) => page.items))
            ),
            takeUntil(this.onDestoy$)
          );
        })
      )
      .subscribe((campaigns: Campaign[]) => {
        // campaigns.map((item:Campaign)=>
        // {
        //   item.urlPicUser=this.user.userPicture
        // })
        //this.campaignsList = this.sortList(campaigns);
        this.campaignsList = campaigns;
        this.campaignsList2 = campaigns;
        this.campaignsList?.forEach((element: Campaign) => {
          if (element.isOwnedByUser) {
            element.urlPicUser = this.user.userPicture;
          }
        });
        // if(this.campaignsList.length ===0){
        //   this.show = true
        // }else{
        //   setTimeout(()=>{
        //     this.show = false
        //   }, 5000);

        // }
      });
    //   this.userPicture = this.user?.picLink ? this.user.picLink : this.sanitizer.bypassSecurityTrustUrl(objectURL)
  }
  onScroll() {
    this.campaignsListStoreService.emitPageScroll();
  }

  createNewDraftCampaign() {
    this.draftStore.init();
    this.draftStore
      .addNewDraft(new Campaign())
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((draft: Campaign) => {
        console.log(draft);
        this.idcamp = draft.id || '';
        this.router.navigate(['home/campaign', this.idcamp, 'edit']);
      });
  }
  sortList(array: any) {
    let list = [
      ...array.filter((data: Campaign) => data.isDraft),
      ...array.filter(
        (data: Campaign) => data.isOwnedByUser && !data.isFinished
      ),
      ...array.filter((data: Campaign) => data.proms && data.isFinished),
      ...array.filter((data: Campaign) => data.proms && !data.isFinished),
      ...array.filter(
        (data: Campaign) =>
          !data.isDraft && !data.isOwnedByUser && !data.isFinished
      ),
      ...array.filter((data: Campaign) => data.isFinished)
    ];

    return [...new Set(list)];
  }

  loadCampaigns() {
    this.campaignsListStoreService.loadingCampaign$
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((res) => {
        if (res) {
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      });
    if (this.tokenStorageService.getToken()) {
      this.getUserPic();
    } else {
      // TODO: load campaigns list here
      this.campaignsListStoreService.list$
        .pipe(filter((data) => data[0].size !== 0))
        .pipe(
          map((pages: Page<Campaign>[]) => {
            this.isLoading = false;
            return _.flatten(pages.map((page: Page<Campaign>) => page.items));
          }),
          takeUntil(this.onDestoy$)
        )
        .subscribe(
          (campaigns: Campaign[]) => {
            if (campaigns.length === 0) {
              this.isLoading = false;
            }
            this.campaignsList = campaigns;
            this.campaignsList2 = campaigns;
            // this.campaignsList = campaigns.filter(
            //   (campaign: Campaign) => campaign.isDraft === false
            // );
          },
          () => {
            this.isLoading = false;
          }
        );
    }
    this.campaignService.loadDataAddPoolWhenEndScroll
      .pipe(debounceTime(1000), takeUntil(this.onDestoy$))
      .subscribe(() => {
        this.campaignsListStoreService.emitPageScroll();
      });

    this.campaignsListStoreService.loadNextPage({}, true);
  }

  ngOnDestroy(): void {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
    this.subscription?.unsubscribe();
  }

  listenForStyleHost($event: any) {
    this.isFormatGrid = $event;
  }

  filterCampaignsBySelectedCryptos(cryptoList: any[]) {
    if (cryptoList.length > 0) {
      this.campaignsList = this.campaignsList2.filter(
        (campaign) => cryptoList.indexOf(campaign.currency.name) >= 0
      );
    } else {
      this.campaignsList = this.campaignsList2;
    }
  }

  private onBoarding() {
    let address = this.tokenStorageService.getIdWallet();
    if (address) {
      this.authStoreService
        .getAccount()
        .pipe(takeUntil(this.onDestoy$))
        .subscribe((response: any) => {
          if (
            (response.data.onBoarding === false ||
              response.data.onBoarding === '') &&
            this.router.url === '/ad-pools'
          ) {
            this.startSteps();
          }
        });
    }
  }

  private startSteps() {
    let arrayOfObs = [];
    arrayOfObs.push(this.translate.get('onBoarding.introo'));
    arrayOfObs.push(this.translate.get('onBoarding.intro2'));
    arrayOfObs.push(this.translate.get('onBoarding.intro3'));
    arrayOfObs.push(this.translate.get('onBoarding.intro4'));
    arrayOfObs.push(this.translate.get('onBoarding.intro5'));
    arrayOfObs.push(this.translate.get('onBoarding.next'));
    forkJoin(arrayOfObs).subscribe((resArray: any[]) => {
      this.intro1 = resArray[0];
      this.intro2 = resArray[1];
      this.intro3 = resArray[2];
      this.intro4 = resArray[3];
      this.button = resArray[5];
      this.introJS
        .setOptions({
          tooltipClass: 'customTooltip ',
          nextLabel: '',
          prevLabel: '',
          doneLabel: '',
          hidePrev: true,
          showBullets: false,
          exitOnOverlayClick: false,
          scrollToElement: true,

          steps: [
            {
              element: '#introo',
              intro: this.intro1,
              position: 'bottom'
            },
            {
              element: '#intro2',
              intro: this.intro2,
              position: 'bottom'
            },
            {
              element: '#intro3',
              intro: this.intro3,
              position: 'bottom'
            },
            {
              element: '#intro4',
              intro: this.intro4,
              position: 'bottom'
            }

            // {
            //   element: "#intro5",
            //   intro: this.intro5,
            //   position: "bottom",
            // },
          ]
        })
        .start()
        .onexit(() => {
          this.authService
            .onBoarding()
            .pipe(
              tap((res: any) => {
                if (!!res.success) {
                  this.authStoreService.setAccount({
                    ...this.authStoreService.account,
                    onBoarding: true
                  });
                  this.accountFacadeService.dispatchUpdatedAccount();
                }
              }),
              takeUntil(this.onDestoy$)
            )
            .subscribe(() => {
              this.showModal = !this.showModal;
              this.getDetails();
            });
        });
    });
  }

  private getDetails() {
    let count = 0;
    this.account$
      .pipe(
        mergeMap((response: any) => {
          if (response !== null && response !== undefined) {
            this.picUserUpdated = response.photoUpdated;
            this.user = response;
            if (this.user.firstName && this.user.firstName !== '') {
              count++;
            }
            if (this.user.lastName && this.user.lastName !== '') {
              count++;
            }
            if (this.user.address && this.user.address !== '') {
              count++;
            }
            if (this.user.email && this.user.email !== '') {
              count++;
            }
            if (this.user.phone && this.user.phone !== '') {
              count++;
            }
            if (this.user.gender && this.user.gender !== '') {
              count++;
            }
            if (this.user.city && this.user.city !== '') {
              count++;
            }
            if (this.user.zipCode && this.user.zipCode !== '') {
              count++;
            }
            if (this.user.country && this.user.country !== '') {
              count++;
            }
            if (this.user.birthday && this.user.birthday !== '') {
              count++;
            }

            let calcul = (count * 100) / 10;
            this.percentProfil = calcul.toFixed(0);
            let getFillMyProfil = this.tokenStorageService.getFillMyProfil();
            let showAgain = this.tokenStorageService.getShowPopUp();
            if (
              this.percentProfil < 60 &&
              getFillMyProfil === 'true' &&
              showAgain === 'true' &&
              (this.showModal === true || this.user.onBoarding === true)
            ) {
              this.openModal(this.welcomeModal);
              this.tokenStorageService.setFillMyProfil('false');
              return this.profileSettingsFacade.profilePic$;
            }
          }
          return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((profile: any) => {
        if (!!profile) {
          let objectURL = URL.createObjectURL(profile);
          if (this.user.idSn === 0) {
            this.user.userPicture =
              this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
          if (this.picUserUpdated && this.user.idSn !== 0) {
            this.user.userPicture =
              this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        }

        if (this.user.picLink && !this.user.userPicture) {
          this.user.userPicture = this.user?.picLink;
        }
      });
  }

  private openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

  onImgError(event: any) {
    event.target.src = 'assets/Images/wlcm-moon-boy.png';
  }
  goToProfile(modal: any) {
    this.closeModal(modal);
    this.router.navigate(['home/settings/edit']);
  }

  dontShowAgain() {
    this.isChecked = !this.isChecked;
    if (this.isChecked === true) {
      let data_profile = {
        toggle: false
      };
      this.profileSettingsFacade
        .updateProfile(data_profile)
        .pipe(takeUntil(this.onDestoy$))
        .subscribe();
      this.tokenStorageService.setShowPopUp('false');
    }

    if (this.isChecked === false) {
      let data_profile = {
        toggle: true
      };
      this.profileSettingsFacade
        .updateProfile(data_profile)
        .pipe(takeUntil(this.onDestoy$))
        .subscribe();
      this.tokenStorageService.setShowPopUp('true');
    }
  }
  trackByCampaignId(index: number, campaign: Campaign): string {
    return campaign.id;
  }
}
