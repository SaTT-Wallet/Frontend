import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { arrayCountries, socialMedia } from '@config/atn.config';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Campaign } from '@app/models/campaign.model';
import { compare } from '@helpers/utils/math';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { Page } from '@app/models/page.model';
import { filter, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { Participation } from '@app/models/participation.model';
import _ from 'lodash';
import { from, of, Subject } from 'rxjs';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { CampaignsService } from '@app/campaigns/facade/campaigns.facade';
import { ToastrService } from 'ngx-toastr';
import { CampaignsListStoreService } from '@app/campaigns/services/campaigns-list-store.service';
import { TranslateService } from '@ngx-translate/core';
import { Big } from 'big.js';
import { WindowRefService } from '@core/windowRefService';
declare var $: any;
@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit {
  scrolling = false;
  inTop = true;
  downloadFilsClick: boolean = false;
  imageBlobUrl!: string | ArrayBuffer | null;
  updateCoverResponseMsg: any;
  showPasswordModal: boolean = false;
  meta: any;
  budgetform: FormGroup;
  passwordBlockChain: any;
  applyButton: boolean = false;
  campaignId = '';
  passwordBudget: boolean = false;
  sattBalancef: any;
  allProms: any;
  allCountries: any = arrayCountries.slice();
  pendingCampaign: any;
  influencer: any;
  socialMediaIcons = socialMedia;
  campaignProms: any;
  rejectedProms: any;
  etherInWei: any = new Big(1000000000000000000);
  allcryptoprice: any;
  total: any = { views: 0, Likes: 0, Shares: 0 };
  socialMedia: any = {
    1: 'facebook',
    2: 'youtube',
    3: 'instagram',
    4: 'twitter'
  };
  fund: any = { ERC20token: '', idCampaign: '', amount: 0, pass: '' };
  totalMedia: any = [];
  totalG: any = {
    view: 0,
    view_satt: 0,
    like: 0,
    like_satt: 0,
    share: 0,
    share_satt: 0
  };

  proms: any = [];
  share: any;
  like: any;
  view: any;
  budgetModal: boolean = false;
  twitter: any = 0;
  youtube: any = 0;
  facebook: any = 0;
  instagram: any = 0;
  linkModal: boolean = false;
  sendform: FormGroup;
  acceptedEproms: any = [];
  applyPassword: boolean = false;
  exactDate = new Date().getTime() / 1000;
  idWallet = this.tokenStorageService.getIdWallet();
  testV: any;
  selectedProm: any;
  displayRejectReason: boolean = false; //delete this later
  rejectReason: any = ''; //delete this later
  kits: any = [];
  day: any;
  activeSection = 1;
  campaignBudget: any;
  campaignBudgetUsD: any;
  campaignStatus: string = '';
  campaign = new Campaign();
  showInfoSpinner: boolean = true;
  campaignBrand: any;
  disabledBtn!: boolean;
  activeCampaign!: boolean;
  idUser = this.tokenStorageService.getUserId();
  showSpinner!: boolean;
  private isDestroyed = new Subject();
  campaign$ = this.campaignsFacade.campaign$;
  kits$ = this.campaignsFacade.kits$;
  isLoading = true;
  histEarning = false;
  private history: string[] = [];
  showmoonboy = true;
  private isErnings = false;

  constructor(
    public router: Router,
    public modalService: NgbModal,
    public CampaignService: CampaignHttpApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private viewportScroller: ViewportScroller,
    private spinner: NgxSpinnerService,
    private campaignsStoreService: CampaignsStoreService,
    public ParticipationListService: ParticipationListStoreService,
    private walletFacade: WalletFacadeService,
    private campaignsFacade: CampaignsService,
    private tokenStorageService: TokenStorageService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private translate: TranslateService,
    private toastr: ToastrService,
    private campaignListStoreService: CampaignsListStoreService,
    private Window: WindowRefService,
    private campaignsHttpService: CampaignHttpApiService
  ) {
    this.sendform = new FormGroup({
      url: new FormControl(null, Validators.required)
    });

    this.budgetform = new FormGroup({
      cost: new FormControl(null, Validators.required)
    });

    this.campaignId = this.route.snapshot.params.id;
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            if (event.url.includes('earnings')) {
              this.isErnings = true;
              this.showmoonboy = false;
            } else {
              if (!event.url.includes('earnings')) {
                this.showmoonboy = true;
              }
            }
            this.history.push(event.urlAfterRedirects);
            if (
              this.history[this.history.length - 1] ===
              `/campaign/${this.campaignId}?type=earnings`
            ) {
              this.histEarning = true;
            }
          }
        });
    }
  }

  ngOnInit(): void {
    this.CampaignService.isLoading.subscribe((res) => {
      if (res === false) {
        setTimeout(() => {
          this.showmoonboy = false;
        }, 1000);
      } else {
        if (!this.router.url.includes('earnings')) {
          this.showmoonboy = true;
        }
      }
    });
    this.campaignsHttpService.scrolling.subscribe(() => {
      this.scrolling = true;
    });

    // cover.style.position = 'fixed';

    // main.style.marginTop = '28%';

    // // cover.style.position = 'fixed';

    this.campaignsStoreService.emitLogoCampaignUpdated
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.campaign = this.campaignsStoreService.campaign;
      });
    this.spinner.show();
    this.showInfoSpinner = true;

    this.totalG = {
      view: 0,
      view_satt: 0,
      like: 0,
      like_satt: 0,
      share: 0,
      share_satt: 0
    };
    this.proms = [];
    this.totalMedia = [];
    this.total = { views: 0, Likes: 5, Shares: 0 };
    this.passwordBlockChain = ''; //delete this later
    this.campaignsFacade.loadCampaignDetails(this.campaignId);
    this.campaignsFacade.loadKits(this.campaignId);
    this.getCryptoData();
    this.getCampaign();
    this.gettingAllproms();
    if (isPlatformBrowser(this.platformId)) {
      this.getKits();
    }
    // this.getCampaignList();
  }
  openstat() {
    this.CampaignService.stat.next(true);
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
    let header = this.document.getElementById('navbar-id');
    if (header) {
      header.style.backgroundColor = 'transparent';
    }

    //this.ParticipationListService.clearDataParticipations()
    //this.campaignsStoreService.clearDataStore()
  }

  // get isOwnedByUser(): boolean {
  //   return (
  //     this.campaign.walletId?.toLowerCase() === this.idWallet!.toLowerCase()
  //   );
  // }
  get isOwnedByUser(): boolean {
    return Number(this.campaign.ownerId) === Number(this.idUser);
  }

  onShowPasswordModal() {
    this.showPasswordModal = true;
  }

  scrollToSection(selector: string) {
    this.viewportScroller.setOffset([0, 220]);
    this.viewportScroller.scrollToAnchor(selector);
  }

  createImageFromBlob(image: Blob) {
    if (isPlatformBrowser(this.platformId)) {
      //this.CampaignService.getCampaignKitResource()
      let reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          this.imageBlobUrl = reader.result;
        },
        false
      );

      if (image) {
        reader.readAsDataURL(image);
      }
    }
  }
  gettingAllproms(): void {
    this.CampaignService.getAllPromsStats(this.campaignId, this.isOwnedByUser)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        this.testV = data.allProms;

        this.allProms = data.allProms?.filter(
          (item: any) => item.appliedDate && item.isAccepted !== 'rejected'
        );

        if (!this.isOwnedByUser) {
          this.allProms = data.allProms?.filter(
            (item: any) =>
              item.isAccepted !== 'rejected' &&
              item.influencer.toLowerCase() === this.idWallet?.toLowerCase()
          );
        }
      });
  }

  getCampaignList() {
    let state = '';
    if (this.campaign.isOwnedByUser) {
      state = 'owner';
    } else {
      state = 'part';
    }
    this.ParticipationListService.setQueryParams({
      campaignId: this.campaign.hash,
      state: state
    });
    this.ParticipationListService.listLinks$
      .pipe(
        takeUntil(this.isDestroyed),
        map((pages: Page<Participation>[]) =>
          _.flatten(pages.map((page: Page<Participation>) => page.items))
        )
      )
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((links: Participation[]) => {
        if (this.campaign.isOwnedByUser) {
          this.allProms = links?.filter(
            (item: any) => item.type !== 'rejected'
          );
        } else {
          this.allProms = links?.filter(
            (item: any) =>
              item.type !== 'rejected' &&
              item.influencer.toLowerCase() === this.idWallet?.toLowerCase()
          );
        }
      });
  }

  getCryptoData() {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        map((response: any) => response.data),
        takeUntil(this.isDestroyed)
      )
      .subscribe((Cryptodata: any) => {
        this.allcryptoprice = Cryptodata;
      });
  }

  openModal(content: any) {
    this.modalService.open(content);
    this.budgetModal = true;
  }
  closeModal(content: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.dismissAll(content);
      $('#budgetform').trigger('reset');

      this.budgetModal = false;
    }
  }
  closeBugdet() {
    this.budgetModal = false;
  }

  convertUnix(unix_timestamp: any) {
    return new Date(unix_timestamp * 1000);
  }

  //TODO: method not used !!
  // fund(): void {
  //   if (this.budgetform.valid) {
  //     if (this.sattBalancef > this.budgetform.get('cost')?.value) {
  //       this.passwordBudget = true
  //       this.budgetModal = false
  //     }
  //   }
  // }

  //TODO: not sure what this func does and it's not ever called!!
  // campaignFund() {
  //   let cost = this.budgetform.get("cost")?.value;
  //   this.fund.ERC20token =
  //     this.campaign_data.meta.token.addr ||
  //     "0xdf49c9f599a0a9049d97cff34d0c30e468987389";
  //   this.fund.pass = this.Password_form_budget.get("password")?.value;
  //   this.fund.amount = Big(cost)
  //     .times(this.etherInWei)
  //     .toFixed(30)
  //     .split(".")[0];
  //   this.fund.idCampaign = this.campaign_data.meta.hash;
  //   this.CampaignService.increaseBudget(this.fund).subscribe((data) => {});
  // }

  //delete this later

  imageImported(image: any, type: any) {
    if (type === 'logo') {
      this.campaignsStoreService.updateOneById({ logo: image });
    } else {
      this.campaignsStoreService.updateOneById({ cover: image });
    }
  }

  getKits() {
    this.kits$
      .pipe(
        filter((data) => data.length > 0),
        switchMap((data) => from(data)),
        mergeMap((kit) => {
          if (kit.link) {
            return of({
              name: kit.link,
              link: kit.link,
              campaign: this.campaignId,
              _id: kit._id
            });
          } else {
            return this.CampaignService.getKitPic(kit._id).pipe(
              map((data) => {
                let objectURL = URL.createObjectURL(data);
                let urlPicture =
                  this.sanitizer.bypassSecurityTrustUrl(objectURL);

                return {
                  name: kit.name,
                  url: urlPicture,
                  campaign: this.campaignId,
                  id: kit._id,
                  taille: kit.chunkSize,
                  type: kit.contentType,
                  uploadDate: kit.uploadDate
                };
              }),
              takeUntil(this.isDestroyed)
            );
          }
        })
      )
      .subscribe((kit) => {
        this.kits.push(kit);
      });
  }
  get localId(): string {
    return this.tokenStorageService.getLocale() || 'en';
  }
  goParticipate(id: any) {
    if (this.tokenStorageService.getIsAuth()) {
      this.router.navigate(['home/part', id]);
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  getCampaign() {
    // let nbProms = 0;
    // let rejectedProms = 0;
    // let index: any;
    this.isLoading = true;
    this.showmoonboy = false;
    this.campaign$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((campaign: Campaign) => {
        if (campaign.id !== this.campaignId) {
          return;
        }
        //data logo image
        this.campaign = campaign;
        this.isLoading = false;
        if (!this.isErnings) {
          this.showmoonboy = true;
        }
        this.campaignBrand = campaign.brand;

        this.campaignProms = campaign.proms;
        this.spinner.hide();
        this.showInfoSpinner = false;

        // get statistics

        if (
          this.campaign.hash &&
          Date.now() < this.campaign.endDate.getTime() &&
          compare(this.campaign.budget).gt('0') &&
          this.campaign.walletId !== this.idWallet
        ) {
          this.applyButton = true;
        }
        if (campaign.hash) this.activeCampaign = true;
        if (this.campaignProms) {
          this.campaignProms.forEach((prom: any) => {
            prom.view_count = 0;
            prom.like_count = 0;
            prom.share_count = 0;

            prom.view_count_satt = 0;
            prom.like_count_satt = 0;
            prom.share_count_satt = 0;
            prom.total_earned = 0;
            prom.total_earned_usd = 0;
            prom.funds_satt = 0;
            prom.funds_usd = 0;
            prom.showInfo = false;
            // if(!prom.isAccepted){
            //   nbProms++
            // }else{
            // setTimeout(() => {
            //   this.CampaignService.getPromStatsLive(prom.id).subscribe(
            //     (data: any) => {
            //       prom.view_count = data.views;
            //       prom.like_count = data.likes;
            //       prom.share_count = data.shares;
            //       this.token_price =
            //         this.allcryptoprice[campaign.currency.name].price;

            //       campaign.ratios.forEach((ratio: any) => {
            //         prom.view_count_satt = new Big(ratio.viewRatio)
            //           .mul(prom.view_count || "0")
            //           .toString();
            //         prom.like_count_satt = new Big(ratio.likeRatio)
            //           .mul(prom.like_count || "0")
            //           .toString();
            //         prom.share_count_satt = new Big(ratio.shareRatio)
            //           .mul(prom.share_count || "0")
            //           .toString();
            //       });
            //       prom.totalRatiosInSaTT = new Big(prom.view_count_satt)
            //         .plus(new Big(prom.like_count_satt))
            //         .plus(new Big(prom.share_count_satt))
            //         .toString();

            //       prom.totalRatiosInUSD = new Big(prom.totalRatiosInSaTT)
            //         .div(new Big(10).pow(18))
            //         .mul(this.token_price)
            //         .toFixed(2)
            //         .toString();
            //       prom.funds_satt = prom.funds[1];
            //       prom.funds_usd = prom.funds_satt * this.token_price;

            //       if (
            //         this.campaign.walletId.toLowerCase() !==
            //         this.idWallet!.toLowerCase()
            //       ) {
            //         if (
            //           prom.influencer.toLowerCase() ===
            //           this.idWallet!.toLowerCase()
            //         ) {
            //           this.handeltotal(
            //             this.rejectedProms,
            //             prom,
            //             nbProms,
            //             rejectedProms,
            //             index
            //           );
            //         }
            //       } else {
            //         this.handeltotal(
            //           this.rejectedProms,
            //           prom,
            //           nbProms,
            //           rejectedProms,
            //           index
            //         );
            //       }
            //     }
            //   );
            // }, 0);

            //  } pRom.Isaccepted ends
          });
        }
      });
  }

  handeltotal(
    rejectedLinks: any,
    prom: any,
    nbProms: any,
    rejectedProms: any,
    index: any
  ) {
    if (rejectedLinks?.includes(prom.id)) {
      rejectedProms++;
    } else {
      nbProms++;
      this.makeLinks(prom);
      this.proms.push(prom);

      this.getSocialStat(this.proms);
      index = this.totalMedia.findIndex((x: any) => x.typeSn === prom.typeSN);
      if (index === -1) {
        index = this.totalMedia.push({
          typeSn: prom.typeSN,
          view: 0,
          view_satt: 0,
          like: 0,
          like_satt: 0,
          share: 0,
          share_satt: 0
        });
        index -= 1;
      }
      this.totalMedia[index].view += parseInt(prom.view_count);
      this.totalMedia[index].view_satt += parseFloat(prom.view_count_satt);
      this.totalMedia[index].like += parseInt(prom.like_count);
      this.totalMedia[index].like_satt += parseFloat(prom.like_count_satt);
      this.totalMedia[index].share += parseInt(prom.share_count);
      this.totalMedia[index].share_satt += parseFloat(prom.share_count_satt);

      this.totalG.view += parseInt(prom.view_count);
      this.totalG.view_satt += parseInt(prom.view_count_satt);
      this.totalG.like += parseInt(prom.like_count);
      this.totalG.like_satt += parseInt(prom.like_count_satt);
      this.totalG.share += parseInt(prom.share_count);
      this.totalG.share_satt += parseInt(prom.share_count_satt);
      this.gettingStats();
    }
    this.proms = [...this.proms];
  }

  makeLinks(prom: any) {
    switch (prom.typeSN) {
      case '1':
        prom._link =
          'https://www.facebook.com/' + prom.idUser + '/posts/' + prom.idPost;
        break;
      case '2':
        prom._link = 'https://www.youtube.com/watch?v=' + prom.idPost;
        break;
      case '3':
        prom._link = 'https://www.instagram.com/p/' + prom.idPost + '/';
        break;
      case '4':
        prom._link =
          'https://twitter.com/' + prom.idUser + '/status/' + prom.idPost;
        break;
      default:
    }
  }

  gettingStats(): void {
    if (this.totalG) {
      let total = this.totalG.like + this.totalG.view + this.totalG.share;
      this.share = (this.totalG.share * 100) / total;
      this.share = this.share.toFixed(0);
      this.like = (this.totalG.like * 100) / total;
      this.like = this.like.toFixed(0);
      this.view = (this.totalG.view * 100) / total;
      this.view = this.view.toFixed(0);
    }
  }

  getSocialStat(array: any): void {
    if (array) {
      let totalSocial = 0;
      let tweet = 0;
      let fb = 0;
      let influencers: any = [];
      let insta = 0;
      let youtube = 0;
      array.forEach((elem: any) => {
        if (elem.isAccepted && elem.typeSN === 4) {
          tweet++;
        }
        if (elem.isAccepted && elem.typeSN === 1) {
          fb++;
        }
        if (elem.isAccepted && elem.typeSN === 2) {
          youtube++;
        }
        if (elem.isAccepted && elem.typeSN === 3) {
          insta++;
        }
      });
      let filterAccepted = array.filter((element: any) => element.isAccepted);
      filterAccepted.forEach((element: any) => {
        influencers.push(element.total_earned);
        if (element.total_earned === Math.max(...influencers)) {
          this.influencer = element;
        }
      });
      totalSocial = tweet + fb + insta + youtube;
      this.twitter = ((tweet * 100) / totalSocial).toFixed(2);
      this.instagram = ((insta * 100) / totalSocial).toFixed(2);
      this.youtube = ((youtube * 100) / totalSocial).toFixed(2);
      this.facebook = ((fb * 100) / totalSocial).toFixed(2);
    }
  }

  backToPreviousPage() {
    this.showSpinner = true;
    // this.history.pop();
    // if (this.histEarning) {
    this.router.navigate(['/ad-pools']);
    // }
    //  else {
    //   this.location.back();
    // }

    // if (this.activeCampaign == false) {
    //   this.router.navigate(["home/campaign/" + this.campaignId + "/edit/"]);
    // } else if (this.campaign.isActive || this.campaign.isFinished) {
    //   if (this.campaign.isOwnedByUser) {
    //     this.router.navigate(["home/campaigns"], {
    //       queryParams: { space: "advertiser" },
    //     });
    //   } else {
    //     this.router.navigate(["home/campaigns"], {
    //       queryParams: { space: "influencer" },
    //     });
    //   }
    // } else if (this.campaign.isDraft && this.campaign.isOwnedByUser) {
    //   this.router.navigate(["home/campaign/" + this.campaignId + "edit"]);
    // }
  }

  launchCampaign() {
    this.checkValidDraft();
    if (this.disabledBtn === false) {
      this.router.navigate(['home/check-password'], {
        queryParams: { id: this.campaignId }
      });
    }
  }

  checkValidDraft() {
    let endDate = this.campaign.endDate;
    let startDate = this.campaign.startDate;
    let today = new Date();

    if (
      this.campaign.ratios &&
      this.campaign.targetedCountries &&
      this.campaign.tags &&
      this.campaign.summary &&
      this.campaign.title &&
      this.campaign.description &&
      this.campaign.endDate &&
      this.campaign.startDate &&
      this.campaign.isOwnedByUser &&
      this.campaign.initialBudget &&
      endDate.setHours(0, 0, 0, 0) >= startDate.setHours(0, 0, 0, 0) &&
      endDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0) &&
      startDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)
    ) {
      this.disabledBtn = false;
    } else {
      this.disabledBtn = true;
    }
  }
  downloadFile() {
    this.downloadFilsClick = true;
    setTimeout(() => {
      this.downloadFilsClick = false;
    }, 1000);
  }
  scrollToTop() {
    let span = this.document.getElementsByClassName('span-top');
    if (span.length > 0) {
      span[0].scrollIntoView({ behavior: 'smooth' });
    }
  }
  goToEditPage(id: string) {
    this.router.navigate(['home/campaign', id, 'edit']);
  }
  deleteCampaign() {
    this.campaignsStoreService
      .removeDraftCampaign(this.campaign.id)
      .pipe(
        mergeMap(() => {
          this.campaignListStoreService.getAllCampaigns(true, {});

          this.router
            .navigateByUrl('/RefreshComponent', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['home/ad-pools']);
            });
          return this.translate.get('campaign_details.deleted');
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data1: any) => {
        this.toastr.success(data1);
        this.router.navigate(['home/ad-pools']);
      });
  }
}
