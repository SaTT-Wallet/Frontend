import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { sattUrl } from '@app/config/atn.config';

@Injectable({
  providedIn: 'root'
})
export class TelegramLinkAccountService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}
  init() {
    // let globalFunction = (window as { [key: string]: any })["loginViaTelegram"] as any;
    // globalFunction = (loginData: any) => this.loginViaTelegram(loginData);
    if (isPlatformBrowser(this.platformId)) {
      (window as any).loginViaTelegram = (loginData: any) =>
        this.loginViaTelegram(loginData);
      (window as any).onTelegramAuth = (user: any) => this.onTelegramAuth(user);
    }
  }

  private loginViaTelegram(loginData: any) {
    let queryString = Object.keys(loginData)
      .map((key) => key + '=' + loginData[key])
      .join('&');
    if (isPlatformBrowser(this.platformId))
      window.open(
        sattUrl +
          '/link-account/telegram/' +
          '2051004' +
          '?pltfrm=2&' +
          queryString.toString(),
        'SaTT'
      );
  }

  private onTelegramAuth(user: any) {
    var queryString = Object.keys(user)
      .map(function (key) {
        return key + '=' + user[key];
      })
      .join('&');

    var vars: any = {};
    if (isPlatformBrowser(this.platformId))
      window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value): any {
          vars[key] = value;
        }
      );

    var referral = vars['referral'] ? '&referral=' + vars['referral'] : '';
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        '/snlogin/telegram?pltfrm=22&' +
        queryString.toString() +
        referral;
  }
}
