import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { sattUrl } from '@app/config/atn.config';
import { User } from '@app/models/User';
import { ProfileService } from '@core/services/profile/profile.service';
import { TelegramLinkAccountService } from '@core/services/telegramAuth/telegram-link-account.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-social-media-link-account',
  templateUrl: './social-media-link-account.component.html',
  styleUrls: ['./social-media-link-account.component.css']
})
export class SocialMediaLinkAccountComponent implements OnInit {
  @Input()
  user!: User;

  @ViewChild('script') script!: ElementRef;

  constructor(
    private profileSettingsFacade: ProfileSettingsFacadeService,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.profileSettingsFacade.initTelegramAuthentication();
  }

  ngOnInit(): void {}

  linkSocialMediaAccount(gateway: string) {
    if (isPlatformBrowser(this.platformId)) {
      //let queryString = Object.keys(user).map(key => key + '=' + user[key]).join('&');
      let w = 600,
        h = 500;
      let dualScreenLeft =
        window.screenLeft !== undefined ? window.screenLeft : window.screenX;
      let dualScreenTop =
        window.screenTop !== undefined ? window.screenTop : window.screenY;
      let width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;
      let height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;
      let left = width / 2 - w / 2 + dualScreenLeft;
      let top = height / 2 - h / 2 + dualScreenTop;

      if (gateway === 'facebook' || gateway === 'google' || 'telegram') {
        window.open(
          `${sattUrl}/link-account/${gateway}/${this.user.idUser}`,
          'SaTT',
          `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
        );
      }
    }
  }

  // <script async src="https://telegram.org/js/telegram-widget.js?14" data-telegram-login="Satt_token_bot" data-size="medium" data-userpic="false" data-onauth="onTelegramAuth(user)" data-request-access="write"></script>

  convertToScript() {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.script.nativeElement;
      const script = this.document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?14';
      script.setAttribute('data-telegram-login', 'v2_satt_token_bot');
      script.setAttribute('data-size', 'large');
      //script.setAttribute("data-onauth","onTelegramAuth(user)");
      script.setAttribute('data-auth-url', sattUrl);
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-radius', '15');

      // Callback function in global scope
      script.setAttribute('data-request-access', 'write');
      element.parentElement.replaceChild(script, element);
    }
  }

  ngAfterViewInit() {
    this.convertToScript();
  }
}
