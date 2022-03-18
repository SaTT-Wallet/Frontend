import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { sattUrl } from '@app/config/atn.config';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { Router } from 'express';
import { ActivatedRoute, Route } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
  constructor(
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: string,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      const imgMetaTag = this.meta.getTag(`name='og:image'`);
      if (imgMetaTag){
        this.meta.removeTag(`name='og:image'`);
      }

        this.meta.addTag(
          {
            property: 'og:image',
            content: `https://safeimagekit.com/picture.png`
          }
        );
        this.meta.addTag(
          {
            property: 'og:image:width',
            content: `200`
          }
        );
        this.meta.addTag(
          {
            property: 'og:image:height',
            content: `2000`
          }
        );

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
    this.route.params
  
      .subscribe((params) => {
        this.getOneById(params['id']).subscribe((campaign: any) => {
    

          this.meta.updateTag(
            {
              property: 'og:image',
              content: `${sattUrl}/coverByCampaign/${campaign.id}?width=200&heigth=200`
              /*
              content: 'https://safeimagekit.com/picture.png'
    */
            },
            `property='og:image'`
          );
    
          this.meta.updateTag(
            {
              property: 'og:title',
              content: `${campaign.title}`
            },
            `property='og:title'`
          );
    
          this.meta.updateTag(
            {
              property: 'og:description',
              content: `${campaign.summary}`
            },
            `property='og:description'`
          );
    
          this.meta.updateTag(
            {
              property: 'og:url',
              content: `${environment.domainName}/home/campaign/${campaign.id}`
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
              content: `${environment.domainName}/home/campaign/${campaign.id}`
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
    /*
              content: `${sattUrl}/coverByCampaign/${campaign.id}`
    */
              content: `${sattUrl}/coverByCampaign/${campaign.id}?width=200&heigth=200`
    
            },
            `name='twitter:image'`
          );
        });
        
      });


  }

  getOneById(id: string) {
    return this.http.get(`${sattUrl}/v2/campaign/id/${id}`, {
      headers: this.tokenStorageService.getHeader()
    });
  }
  
}
