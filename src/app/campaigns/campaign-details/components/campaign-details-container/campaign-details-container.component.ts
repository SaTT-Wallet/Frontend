import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '@app/models/campaign.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-campaign-details-container',
  templateUrl: './campaign-details-container.component.html',
  styleUrls: ['./campaign-details-container.component.scss']
})
export class CampaignDetailsContainerComponent implements OnInit {
  showInfoSpinner: boolean = true;
  showmoonboy: boolean = false;

  campaign$!: Observable<Campaign>;
  campaign: any;
  campaignId: any;
  private isDestroyed = new Subject();

  constructor(
    private campaignsStoreService: CampaignsStoreService,
    private route: ActivatedRoute,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showmoonboy = true;
    }, 3000);

    this.campaignsStoreService.clearCampaignDetailsStore();
    this.route.params
      .pipe(
        map((params: any) => {
          this.campaignsStoreService.initCampaignStore(params['id']);
          this.campaignId = params['id'];
          return this.campaignId;
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe();
    this.campaign$ = this.campaignsStoreService.campaign$;

    this.campaign$.pipe(takeUntil(this.isDestroyed)).subscribe((campaign) => {
      this.campaign = campaign;
      this.meta.addTag({
        name: 'og:title',
        content: campaign.title
      });
      this.meta.addTag({
        name: 'og:image',
        content: 'https://satt-token.com/assets/img/index/wallet.png'
      });
      this.meta.addTag({
        name: 'og:description',
        content: campaign.description
      });
      this.meta.addTag({
        name: 'og:type',
        content: 'website'
      });
      this.meta.addTag({
        name: 'og:url',
        content: `${environment.domainName}/home/campaign/${campaign.id}`
      });
      this.meta.addTag({
        name: 'twitter:card',
        content: 'https://satt-token.com/assets/img/index/wallet.png'
      });
    });
  }

  imageImported(image: any) {
    this.campaignsStoreService.updateOneById(
      { cover: image },
      this.campaignsStoreService.campaign.id
    );
  }

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
    this.campaignsStoreService.clearDataStore();
    // location.reload();
    this.meta.updateTag({ name: 'og:title', content: '' }, `name='og:title'`);
    this.meta.updateTag({ name: 'og:image', content: '' }, `name='og:image'`);
    this.meta.updateTag(
      { name: 'og:description', content: '' },
      `name='og:description'`
    );
    this.meta.updateTag({ name: 'og:type', content: '' }, `name='og:type'`);
    this.meta.updateTag(
      { name: 'twitter:card', content: '' },
      `name='twitter:card'`
    );
  }
}
