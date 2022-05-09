import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Campaign } from '@app/models/campaign.model';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// TODO: missing budget property in the data sent by backend /v2/campaigns

@Component({
  selector: 'app-campaigns-list-item',
  templateUrl: './campaigns-list-item.component.html',
  styleUrls: ['./campaigns-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignsListItemComponent implements OnInit {
  @Input() campaign = new Campaign();
  @Output() deleted = new EventEmitter();
  showSpinner = false;
  deletebutton: boolean = false;
  picUserUpdated: boolean = false;
  currencyName = '';
  private isDestroyed = new Subject();

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private campaignsStore: CampaignsStoreService,
    private campaignListStoreService: CampaignsListStoreService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.currencyName = this.campaign.currency.name;
    if (this.currencyName === 'SATTBEP20') {
      this.currencyName = 'SATT';
    }
  }

  goToDetailsPage(id: string) {
    // const currentUrl = this.router.url;
    // if(this.deletebutton==false){
    //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //     this.router.navigate(['/home/campaign'+this.campaign.id]);
    // });
    // }
    // this.router.navigate(["home/campaign", this.campaign.id])
    // .then(() => {
    //   window.location.reload();
    // })
    // this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
    //       this.router.navigate(['/home/campaign'+this.campaign.id]);
    //   });
    // window.location.reload();
    if (this.deletebutton === false) {
      this.router.navigate(['home/campaign', this.campaign.id]);
    }
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
    // event.target.src =  this.user?.userPicture
  }

  goToEditPage(id: string) {
    this.router.navigate(['home/campaign', id, 'edit']);
  }

  convertUnixToDate(x: any) {
    return new Date(x * 1000);
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

  deleteCampaign(id: any) {
    this.deletebutton = true;
    this.showSpinner = true;
    this.campaignsStore
      .removeDraftCampaign(id)
      .pipe(
        mergeMap(() => {
          this.deleted.emit(id);
          this.modalService.dismissAll();
          this.showSpinner = false;
          this.campaignListStoreService.getAllCampaigns(true, {});
          //     this.router
          //     .navigateByUrl('home/ad-pools');
          //   return this.translate.get('campaign_details.deleted');
          // }),
          this.router
            .navigateByUrl('', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['home/ad-pools']);
            });
          return this.translate.get('campaign_details.deleted');
        })
      )
      .subscribe((data1: any) => {
        this.toastr.success(data1);
      });
  }

  get isFacebookSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'facebook');
  }
  get isYoutubeSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'youtube');
  }
  get isInstagramSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'instagram');
  }
  get isTwitterSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'twitter');
  }

  get isLinkedinSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'linkedin');
  }
  get isTikTokSelected(): boolean {
    let campaignPerformance = this.campaign.ratios.length
      ? this.campaign.ratios
      : this.campaign.bounties;
    return !!campaignPerformance.find((r) => r.oracle === 'tikTok');
  }
  get localId(): string {
    return this.tokenStorageService.getLocale() || 'en';
  }

  getCurrencyName(campaign: any) {
    const currencyName = campaign.currency.name;
    if (currencyName === ' SATTBEP20') {
      return 'SATT';
    }
    return currencyName;
  }
  ngOnDestroy(): void {
    // this.isDestroyed.next('');
    // this.isDestroyed.unsubscribe();
  }
}
