import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { BlockchainActionsService } from '@core/services/blockchain-actions.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { EButtonActions } from '@app/core/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { Participation } from '@app/models/participation.model';
import { NotificationService } from '@core/services/notification/notification.service';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  atLastOneChecked,
  requiredDescription
} from '@app/helpers/form-validators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ListTokens } from '@app/config/atn.config';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import copy from 'fast-copy';
import { Subject } from 'rxjs';
import { Big } from 'big.js';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-farm-post-card',
  templateUrl: './farm-post-card.component.html',
  styleUrls: ['./farm-post-card.component.scss']
})
export class FarmPostCardComponent implements OnInit {
  @Input() prom: any;
  @Input() isOwner: boolean = false;
  @Input() formatGrid: boolean = true;
  @Output() deleted = new EventEmitter<any>();
  showSpinner: boolean = false;
  reasonForm: UntypedFormGroup;
  promToreject: any;
  showLoadingSpinner: boolean = false;
  isFarmingRouter: boolean = false;
  showDetails: boolean = false;
  sumInUSD: any;
  payedAmoundInUSD: any;
  private isDestroyed = new Subject();
  intervalId!: any;
  harvestAvailableIn: any = 0;
  harvestAvailable: boolean = true;

  constructor(
    private tokenStorageService: TokenStorageService,
    private blockchainActions: BlockchainActionsService,
    private router: Router,
    private notificationService: NotificationService,
    private campaignService: CampaignHttpApiService,
    private participationService: ParticipationListStoreService,
    private activatedRoute: ActivatedRoute,
    public modalService: NgbModal,
    private ref: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private walletFacade: WalletFacadeService,
    public changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.reasonForm = new UntypedFormGroup(
      {
        reason1: new UntypedFormControl(null),
        reason2: new UntypedFormControl(null),
        reason3: new UntypedFormControl(null),
        reason4: new UntypedFormControl(null),
        description: new UntypedFormControl(null)
      },
      [atLastOneChecked(), requiredDescription()]
    );
  }

  private countDownTimer(): void {
    const harvestDate: number = this.prom.lastHarvestDate;
    const today: number = Math.floor(new Date().getTime() / 1000);
    const timestampAcceptedDate: number = this.prom.acceptedDate;
  
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const timeUntilHarvest = harvestDate + 84600 - currentTime; // Corrected calculation
    const timeUntilAccepted = timestampAcceptedDate + 86400 - currentTime; // Corrected calculation
    const endTimeCampaign = this.prom.campaign.endDate - currentTime;
  
    if (this.prom.campaign.remuneration === 'publication') {
      if (endTimeCampaign > 0) {
        const hours = Math.floor(endTimeCampaign / 3600);
        const minutes = Math.floor((endTimeCampaign % 3600) / 60);
  
        if (hours > 24) {
          const days = Math.floor(hours / 24);
          const remainingHours = hours % 24;
          this.harvestAvailableIn = `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
          this.harvestAvailableIn = `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        this.harvestAvailable = false;
      }
    } else if (harvestDate) {
      if (timeUntilHarvest > 0) {
        const hours = Math.floor(timeUntilHarvest / 3600);
        const minutes = Math.floor((timeUntilHarvest % 3600) / 60);
        this.harvestAvailableIn = `${hours}h ${minutes}min`;
        this.harvestAvailable = false;
      }
    } else if (today - timestampAcceptedDate < 86400) {
      if (timeUntilAccepted > 0) {
        const hours = Math.floor(timeUntilAccepted / 3600);
        const minutes = Math.floor((timeUntilAccepted % 3600) / 60);
        this.harvestAvailableIn = `${hours}h ${minutes}min`;
        this.harvestAvailable = false;
      }
    }
  }
  
  safeImageUrl(base64Image: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:image/png;base64, ${base64Image}`
    );
  }
  ngOnInit(): void {
    this.getPartPic();
    if (this.router.url.includes('farm-posts')) {
      this.isFarmingRouter = true;
    } else {
      this.isFarmingRouter = false;
    }

    this.showSpinner = true;
    this.notificationService.notifications$
      .pipe(
        map((payload) => JSON.parse(payload.data.obj)),
        filter((msg) => {
          return (
            ['link_accepted', 'link_rejected'].includes(msg.label?.action) &&
            msg.label?.promHash === this.prom.hash
          );
        }),
        switchMap(() => this.campaignService.getPromById(this.prom.hash)),
        map((data: any) => data.prom),
        map((prom: any) => {
          return {
            ...prom,
            safeURL: this.participationService.generatePostThumbnail(prom),
            link: this.participationService.generatePostLink(prom)
          };
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe((prom: any) => {
        this.prom = new Participation(prom);
      });
    let currencyName = this.prom.campaign.currency;
    this.intervalId = setInterval(() => {
      this.countDownTimer();
    }, 1000);
    if (currencyName === 'SATTBEP20') currencyName = 'SATT';

    let etherInWei = ListTokens[currencyName].decimals;
    let sum = new Big(this.prom.sum).div(etherInWei).toFixed(0);
    let payedAmount = new Big(this.prom.payedAmount).div(etherInWei).toFixed(0);
    this.sumInUSD = this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      //tap((_) => console.log('value sumInUSD => ', _)),
      map((crypto: any) =>
        (crypto[currencyName].price * Number(sum)).toFixed(2)
      )
    );
    this.payedAmoundInUSD = this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      //tap((_) => console.log('value payedAmoundInUSD=> ', _)),
      map((crypto: any) =>
        (crypto[currencyName].price * Number(payedAmount)).toFixed(2)
      )
    );
  }

  get localId(): string {
    return this.tokenStorageService.getLocale() || 'en';
  }

  getLink(event: Event) {
    event.preventDefault(); // Prevent the default link behavior
    if (isPlatformBrowser(this.platformId)) {
      window.open(
        this.prom.typeSN == 7
          ? 'https://www.threads.net/t/' + this.prom.idPost
          : this.prom.link,
        '_blank'
      );
    }
  }

  getMyGains(prom: any) {
    let x = prom.campaign.ratio?.length ? false : true;
    this.blockchainActions.onActionButtonClick({
      data: {
        prom,
        bounty: x
      },
      action: EButtonActions.GET_MY_GAINS
    });

    /************   FETCH NETWORK OF CAMPAIGN     ***********/

    let network = '';
    this.campaignService.getOneById(prom.campaign._id).subscribe(
      (res) => {
        network = res.data.token.type;
        this.router.navigate(
          [`/home/campaign/${prom.campaign._id}/recover-my-gains`],
          {
            queryParams: {
              prom_hash: prom.hash,
              id: prom.campaign._id,
              network: network
            }
          }
        );
      },
      (err: any) => {
        this.router.navigate(
          [`/home/campaign/${prom.campaign._id}/recover-my-gains`],
          {
            queryParams: { prom_hash: prom.hash, id: prom.campaign._id }
          }
        );
      }
    );
  }
  validateLink(prom: any) {
    this.blockchainActions.onActionButtonClick({
      data: { prom, campaignId: prom.campaign._id, fromNotification: false },
      action: EButtonActions.VALIDATE_LINK
    });
    this.router.navigate(['verify-link'], {
      queryParams: {
        campaign_id: prom.campaign._id,
        network: ListTokens[prom.campaign.currency].type
      },
      relativeTo: this.activatedRoute
    });
  }
  closeModal(content: any) {
    this.modalService.dismissAll(content);
    this.promToreject = '';
    this.showLoadingSpinner = false;
  }
  openModal(content: any) {
    this.modalService.open(content);
    this.promToreject = this.prom;
    this.reasonForm.reset();
  }

  goToCampaignDetail(campaignId: string) {
    this.router.navigate(['/home/campaign/', campaignId]);
  }

  onCheckboxChange(event: any, form: any) {
    if (event.target.checked === false) {
      this.reasonForm.get(form)?.setValue(null);
      if (form === 'reason4') {
        this.reasonForm.get('description')?.setValue(null);
      }
    } else {
      this.reasonForm.get(form)?.setValue(event.target.value);
    }
  }
  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }

  rejectLink(modal: any) {
    this.showLoadingSpinner = true;
    let arrayReason: any = [];
    this.walletFacade.verifyUserToken().subscribe((res: any) => {
      if (res?.message !== 'success') {
        this.expiredSession();
      } else {
        Object.keys(this.reasonForm.controls).forEach((element: any) => {
          if (element !== 'reason4') {
            if (
              this.reasonForm.get(element)?.value !== 'null' ||
              this.reasonForm.get(element)?.value !== ''
            ) {
              arrayReason.push(this.reasonForm.get(element)?.value);
            }
          }
        });
        let filterdArray = arrayReason.filter((ele: any) => ele !== null);
        if (filterdArray.length !== 0) {
          this.campaignService
            .rejectLinks(
              this.prom,
              filterdArray,
              this.prom.campaign._id,
              this.prom.campaign.title
            )
            .pipe(takeUntil(this.isDestroyed))
            .subscribe((data: any) => {
              if (data.message === 'success') {
                this.closeModal(modal);
                this.showLoadingSpinner = false;
                this.deleted.emit(this.prom.id);
                // this.influencerProms = this.influencerProms.pipe(
                //   map((array: any) =>
                //     array.filter(
                //       (influencer: any) => influencer.id !== this.promToreject.id
                //     )
                //   ),
                //   tap(console.log)
                // );
                this.ref.detectChanges();
              }
            });
        }
      }
    });
  }

  getPartPic() {
    this.prom = copy(this.prom);
    if (this.prom.meta) {
      if (this.prom.userPic !== '') {
        this.prom.userPic = this.prom.userPic;
      } else {
        if (!this.router.url.includes('farm-posts')) {
          this.campaignService
            .getBestInfluencerPic(this.prom.meta._id)
            .pipe(takeUntil(this.isDestroyed))
            .subscribe((res: any) => {
              let objectURL: any;
              if (res) {
                if (res.err !== 'No file exists') {
                  objectURL = URL.createObjectURL(res);
                  this.prom.userPic =
                    this._sanitizer.bypassSecurityTrustUrl(objectURL);
                  this.changeDetectorRef.detectChanges();
                } else {
                  this.prom.userPic = '';
                }
              }
            });
        }
      }
    }
  }
  showBlock() {
    this.showDetails = !this.showDetails;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
