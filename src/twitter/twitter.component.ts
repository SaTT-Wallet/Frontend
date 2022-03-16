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
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.meta.addTag({
        name: 'og:title',
        content: 'twiiter test'
      });
      const imgMetaTag = this.meta.getTag(`name='og:image'`);
      if (!imgMetaTag) {
        this.meta.addTag({
          name: 'og:image',
          content: 'https://satt-token.com/assets/img/index/wallet.png'
        });
      }
      this.meta.addTag({
        name: 'og:image:type',
        content: `website`
      });
      this.meta.addTag({
        name: 'og:image:alt',
        content: `campaign cover`
      });
      this.meta.addTag({
        name: 'og:description',
        content: 'twiiter'
      });
      this.meta.addTag({
        name: 'og:type',
        content: 'website'
      });
      this.meta.addTag({
        name: 'og:url',
        content: ``
      });
      this.meta.addTag({
        name: 'twitter:card',
        content: 'summary_large_image'
      });
      this.meta.addTag({
        name: 'twitter:image',
        content: 'https://satt-token.com/assets/img/index/wallet.png'
      });
    }
  }
}
