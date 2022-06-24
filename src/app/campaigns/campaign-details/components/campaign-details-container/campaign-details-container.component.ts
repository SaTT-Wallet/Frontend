import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '@app/models/campaign.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { sattUrl } from '@config/atn.config';
import { isPlatformServer } from '@angular/common';

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
    private meta: Meta,
    private campaignService: CampaignHttpApiService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    this.campaignService.isLoading.subscribe((res) => {
      if (res === false) {
        this.showmoonboy = true;
      } else {
        this.showmoonboy = false;
      }
    });
    this.campaignsStoreService.clearCampaignDetailsStore();
    this.route.params
      .pipe(
        tap((params: any) => {
          this.campaignsStoreService.initCampaignStore(params['id']);
          this.campaignId = params['id'];
        }),

        takeUntil(this.isDestroyed)
      )
      .subscribe();
    this.campaign$ = this.campaignsStoreService.campaign$;
    if (isPlatformServer(this.platformId)) {
      this.meta.addTag({
        name: 'og:image:secure_url',
        content: ``
      });
      const imgMetaTag = this.meta.getTag(`name='og:image'`);
      if (imgMetaTag) {
        this.meta.removeTag(`name='og:image'`);
      }

      this.meta.addTag({
        name: 'og:image',
        content: `https://safeimagekit.com/picture.png`
      });
      this.meta.addTag({
        name: 'og:image:type',
        content: `website`
      });
      this.meta.addTag({
        name: 'og:image:alt',
        content: `campaign cover`
      });

      this.meta.addTag({
        property: 'og:image:width',
        content: `200`
      });
      this.meta.addTag({
        property: 'og:image:height',
        content: `200`
      });

      this.meta.addTag({
        property: 'og:title',
        content: 'twitter test'
      });
      this.meta.addTag({
        property: 'og:description',
        content: ''
      });
      this.meta.addTag({
        property: 'og:type',
        content: 'website'
      });
      this.meta.addTag({
        property: 'og:url',
        content: ``
      });
      this.meta.addTag({
        property: 'og:site_name',
        content: 'dev.satt.atayen.us'
      });
      this.meta.addTag({
        name: 'twitter:card',
        content: 'summary_large_image'
      });
      this.meta.addTag({
        name: 'twitter:image:width',
        content: '200'
      });
      this.meta.addTag({
        name: 'twitter:image:height',
        content: '200'
      });
      this.meta.addTag({
        property: 'twitter:domain',
        content: 'https://dev.satt.atayen.us'
      });
      this.meta.addTag({
        property: 'twitter:url',
        content: ''
      });
      this.meta.addTag({
        name: 'twitter:title',
        content: ''
      });
      this.meta.addTag({
        name: 'twitter:description',
        content: ''
      });
      this.meta.addTag({
        name: 'twitter:image',
        content: 'https://safeimagekit.com/picture.png'
      });
    }

    this.campaign$.pipe(takeUntil(this.isDestroyed)).subscribe((campaign) => {
      this.campaign = campaign;
      setTimeout(() => {
        this.showmoonboy = campaign.id === this.campaignId;
      }, 1000);

      this.meta.updateTag(
        {
          property: 'og:image',
          itemprop: 'image',
          content:  `${sattUrl}/campaign/coverByCampaign/${campaign.id}`
        },
        `itemprop='image'`
      );

      this.meta.updateTag(
        {
          itemprop: 'width',
          content: '1200'
        },
        `itemprop='width'`
      );

      this.meta.updateTag(
        {
          itemprop: 'height',
          content: '800'
        },
        `itemprop='height'`
      );


      this.meta.updateTag(
        {
          property: 'og:title',
          content: campaign.title
        },
        `property='og:title'`
      );

      this.meta.updateTag(
        {
          name: 'og:image:secure_url',
          content: `${sattUrl}/campaign/coverByCampaign/${campaign.id}`
        },
        `name='og:image:secure_url'`
      );

      this.meta.updateTag(
        {
          name: 'og:image',
          content: `${sattUrl}/campaign/coverByCampaign/${campaign.id}`
        },
        `name='og:image'`
      );



      this.meta.updateTag(
        {
          property: 'og:image:width',
          content: `200`
        },
        `property='og:image:width'`
      );
      this.meta.updateTag(
        {
          property: 'og:image:height',
          content: `200`
        },
        `property='og:image:height'`
      );
      this.meta.updateTag(
        {
          property: 'og:description',
          content: campaign.summary
        },
        `property='og:description'`
      );
      this.meta.updateTag(
        {
          property: 'og:url',
          content: `${environment.domainName}/campaign/${campaign.id}`
        },
        `property='og:url'`
      );
      this.meta.updateTag(
        {
          property: 'og:site_name',
          content: `${environment.domainName.split('//')[1]}`
        },
        `property='og:site_name'`
      );

      this.meta.updateTag(
        {
          property: 'twitter:domain',
          content: `${environment.domainName}`
        },
        `property='twitter:domain'`
      );
      this.meta.updateTag(
        {
          property: 'twitter:url',
          content: `${environment.domainName}/campaign/${campaign.id}`
        },
        `property='twitter:url'`
      );

      this.meta.updateTag(
        {
          name: 'twitter:title',
          content: `${campaign.title}`
        },
        `name='twitter:title'`
      );

      this.meta.updateTag(
        {
          name: 'twitter:description',
          content: `${campaign.summary}`
        },
        `name='twitter:description'`
      );

      this.meta.updateTag(
        {
          name: 'twitter:image',
          content: `https://satt-token.com/assets/img/share_img_200px.png`
        },
        `name='twitter'`
      );
    });
  }

  imageImported(image: any) {
    this.campaignsStoreService.updateOneById({ cover: image });
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
