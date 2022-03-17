import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
  constructor(
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      const imgMetaTag = this.meta.getTag(`name='og:image'`);
      if (!!imgMetaTag) {
        this.meta.updateTag(
          {
            property: 'og:image',
            content: `https://safeimagekit.com/picture.png`
          },
          `name='og:image'`
        );
      }
      this.meta.addTag({
        property: 'og:title',
        content: 'twitter test'
      });
      this.meta.addTag({
        property: 'og:description',
        content:
          'Looking for a free and online image resizer for  twitter? Visit our website and resize image for twitter in few seconds.'
      });
      this.meta.addTag({
        property: 'og:type',
        content: 'website'
      });
      this.meta.addTag({
        property: 'og:url',
        content: 'https://dev.satt.atayen.us/twitter'
      });
      this.meta.addTag({
        property: 'og:site_name',
        content: 'dev.satt.atayen.us'
      });
      this.meta.addTag({
        property: 'twitter:domain',
        content: 'https://dev.satt.atayen.us'
      });
      this.meta.addTag({
        property: 'twitter:url',
        content: 'https://dev.satt.atayen.us/twitter'
      });
      this.meta.addTag({
        name: 'twitter:title',
        content: 'twitter test'
      });
      this.meta.addTag({
        name: 'twitter:description',
        content: 'twitter test desc'
      });
      this.meta.addTag({
        name: 'twitter:image:src',
        content: 'https://safeimagekit.com/picture.png'
      });
    }
  }
}
