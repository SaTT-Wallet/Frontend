import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConvertFromWei } from '@app/shared/pipes/wei-to-sa-tt.pipe';
import { CampaignsService } from '@campaigns/facade/campaigns.facade';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { Campaign } from '@app/models/campaign.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ad-pool-grid',
  templateUrl: './ad-pool-grid.component.html',
  styleUrls: ['./ad-pool-grid.component.scss']
})
export class AdPoolGridComponent implements OnInit, OnChanges {
  @Input() campaigns: any[] = [];
  date = new Date();
  deletebutton = false;
  showSpinner = false;
  sortAdPoolNameUp = true;
  sortAdPoolUp = true;
  sortMediaUp = true;
  sortEndOnUp = true;
  sortRemunerationUp = true;
  sortFundsUp = true;
  private isDestroyed = new Subject();

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private modalService: NgbModal,
    private campaignsStore: CampaignsStoreService,
    private campaignListStoreService: CampaignsListStoreService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private convertFromWei: ConvertFromWei,
    private campaignsFacade: CampaignsService
  ) {
    
  }

  ngOnInit(): void {
    this.campaignsFacade.campaignsSortItem$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((sortItem: any) => {
        if (sortItem.sortField === 'adpool-name') {
          this.sortAdPoolUp = sortItem.sortUp;
          this.sortAdPoolName();
        }
        if (sortItem.sortField === 'media') {
          this.sortMediaUp = sortItem.sortUp;
          this.sortMedia();
        }
        if (sortItem.sortField === 'endDate') {
          this.sortEndOnUp = sortItem.sortUp;
          this.sortDateEndOn();
        }
        if (sortItem.sortField === 'remuneration') {
          this.sortRemunerationUp = sortItem.sortUp;
          this.sortRemuneration();
        }
        if (sortItem.sortField === 'funds') {
          this.sortFundsUp = sortItem.sortUp;
          this.sortFunds();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {}
  get localId(): string {
    return this.tokenStorageService.getLocale() || 'en';
  }

  showBlock() {}

  haveInstagram(campaign: any): boolean {
    
    const oracles: any[] = [
      ...campaign.bounties.map((bounty: any) => bounty.oracle),
      ...campaign.ratios.map((ratio: any) => ratio.oracle)
    ];

    return oracles.indexOf('instagram') >= 0;
  }

  haveYoutube(campaign: any): boolean {
    const oracles: any[] = [
      ...campaign.bounties.map((bounty: any) => bounty.oracle),
      ...campaign.ratios.map((ratio: any) => ratio.oracle)
    ];

    return oracles.indexOf('youtube') >= 0;
  }

  haveFacebook(campaign: any): boolean {
    const oracles: any[] = [
      ...campaign.bounties.map((bounty: any) => bounty.oracle),
      ...campaign.ratios.map((ratio: any) => ratio.oracle)
    ];

    return oracles.indexOf('facebook') >= 0;
  }

  haveTwitter(campaign: any): boolean {
    const oracles: any[] = [
      ...campaign.bounties.map((bounty: any) => bounty.oracle),
      ...campaign.ratios.map((ratio: any) => ratio.oracle)
    ];

    return oracles.indexOf('twitter') >= 0;
  }

  haveLinkedIn(campaign: any): boolean {
    const oracles: any[] = [
      ...campaign.bounties.map((bounty: any) => bounty.oracle),
      ...campaign.ratios.map((ratio: any) => ratio.oracle)
    ];

    return oracles.indexOf('linkedin') >= 0;
  }

  getCurrencyName(campaign: any) {
    const currencyName = campaign.currency.name;
    if (currencyName === ' SATTBEP20') {
      return 'SATT';
    }
    return currencyName;
  }

  goToEditPage(id: string) {
    this.router.navigate(['home/campaign', id, 'edit']);
  }
  goToDetailsPage(id: string) {
    if (this.deletebutton === false) {
      this.router.navigate(['home/campaign', id]);
    }
  }

  deleteCampaign(id: any) {
    this.deletebutton = true;
    this.showSpinner = true;

    this.campaignsStore
      .removeDraftCampaign(id)
      .pipe(
        mergeMap(() => {
          this.modalService.dismissAll();
          this.showSpinner = false;
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
      });
  }

  sortAdPoolName() {
    if (this.sortAdPoolUp) {
      this.campaigns.sort((a, b) => {
        return a.title > b.title ? -1 : 1;
      });
    } else {
      this.campaigns.sort((a, b) => {
        return b.title > a.title ? -1 : 1;
      });
    }
    this.sortAdPoolUp = !this.sortAdPoolUp;
  }

  sortMedia() {
    if (this.sortMediaUp) {
      this.campaigns.sort((a, b) => {
        const oracles1: any[] = [
          ...a.bounties.map((bounty: any) => bounty.oracle),
          ...a.ratios.map((ratio: any) => ratio.oracle)
        ];
        const oracles2: any[] = [
          ...b.bounties.map((bounty: any) => bounty.oracle),
          ...b.ratios.map((ratio: any) => ratio.oracle)
        ];
        return oracles1.length - oracles2.length;
      });
    } else {
      this.campaigns.sort((a, b) => {
        const oracles1: any[] = [
          ...a.bounties.map((bounty: any) => bounty.oracle),
          ...a.ratios.map((ratio: any) => ratio.oracle)
        ];
        const oracles2: any[] = [
          ...b.bounties.map((bounty: any) => bounty.oracle),
          ...b.ratios.map((ratio: any) => ratio.oracle)
        ];
        return oracles2.length - oracles1.length;
      });
    }
    this.sortMediaUp = !this.sortMediaUp;
  }

  sortDateEndOn() {
    if (this.sortEndOnUp) {
      this.campaigns.sort((a, b) => {
        return a.endDate.getTime() - b.endDate.getTime();
      });
    } else {
      this.campaigns.sort((a, b) => {
        return b.endDate.getTime() - a.endDate.getTime();
      });
    }
    this.sortEndOnUp = !this.sortEndOnUp;
  }
  sortRemuneration() {
    if (this.sortRemunerationUp) {
      this.campaigns.sort((a, b) => {
        return a.remuneration > b.remuneration ? -1 : 1;
      });
    } else {
      this.campaigns.sort((a, b) => {
        return b.remuneration > a.remuneration ? -1 : 1;
      });
    }
    this.sortRemunerationUp = !this.sortRemunerationUp;
  }

  sortFunds() {
    if (this.sortFundsUp) {
      this.campaigns.sort((a, b) => {
        return +a.budget > +b.budget ? -1 : 1;
      });
    } else {
      this.campaigns.sort((a, b) => {
        return +b.budget > +a.budget ? -1 : 1;
      });
    }
    this.sortFundsUp = !this.sortFundsUp;
  }

  parseFund(budget: any, campaign: any) {
    let budgetAmount = this.convertFromWei.transform(
      budget,
      this.getCurrencyName(campaign),
      3
    );

    return parseFloat(budgetAmount + '').toFixed(9 - budgetAmount.length);
  }

  filterAmount(input: any, nbre: any = 10) {
    if (input) {
      var out = input;
      let size = input.length;
      let toAdd = parseInt(nbre) - parseInt(size);

      if (input === 0) {
        toAdd--;
      }
      if (toAdd > 0) {
        if (input.includes('.')) {
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        } else {
          out += '.';
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        }
      } else if (toAdd < 0) {
        if (input.includes('.')) {
          if (input.split('.')[0].length > nbre) {
            out = input.substring(0, nbre);
          } else {
            out = input.substring(0, nbre);
            if (out[nbre - 1] === '.') {
              out = input.substring(0, nbre - 1);
            }
          }
        }
      }
      return out;
    } else {
      return '-';
    }
  }
  trackByCampaignId(index: number, campaign: Campaign): string {
    return campaign.id;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
