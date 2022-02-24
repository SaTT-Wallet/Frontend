import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { sattUrl } from '@config/atn.config';
import { environment as env } from '@environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { User } from '@app/models/User';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-monetize-telegram-account',
  templateUrl: './monetize-telegram-account.component.html',
  styleUrls: ['./monetize-telegram-account.component.css']
})
export class MonetizeTelegramAccountComponent implements OnInit {
  @ViewChild('script') script!: ElementRef;
  @ViewChild('iframe') myIframe: ElementRef | null = null;
  routerSub: any;
  errorMessage = '';
  successMessage = '';
  user!: User;
  goToGoogle: boolean = false;
  private isDestroyed = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private tokenStorageService: TokenStorageService,
    private authStoreService: AuthStoreService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    this.tokenStorageService.setSecureWallet('visited-telegram', 'true');
    this.skipLoginWhenRedirected();
    this.getDetails();
  }
  skipPage() {
    if (this.tokenStorageService.getTypeSN() !== '2') {
      this.router.navigate(['social-registration/monetize-google']);
    } else {
      this.tokenStorageService.setSecureWallet('visited-google', 'true');
      this.router.navigate(['social-registration/socialConfig']);
    }
  }
  getDetails() {
    this.authStoreService.account$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.user = new User(response);
          if (response.idSn !== 0) {
            this.tokenStorageService.saveUserId(response._id);
          }
        }
      });
  }
  //script connexion to telegram
  convertToScript() {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.script?.nativeElement;
      const script = this.document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?14';
      script.setAttribute('data-telegram-login', env.telegramBot);
      script.setAttribute('data-size', 'large');
      //script.setAttribute("data-onauth","onTelegramAuth(user)");
      script.setAttribute(
        'data-auth-url',
        sattUrl +
          '/connect/telegram/' +
          this.tokenStorageService.getIdUser() +
          '/registration'
      );

      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-radius', '15');
      // Callback function in global scope
      element?.parentElement.replaceChild(script, element);
    }
  }
  skipLoginWhenRedirected() {
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((p) => {
        if (p.message === 'account_linked_with success') {
          this.successMessage = 'account_linked_with_success';
          // setTimeout(() => {

          //   this.successMessage = "";
          //   // this.router.navigate(["social-registration/monetize-telegram"]);
          // }, 6000);
        } else if (p.message === 'account exist') {
          this.errorMessage = 'account_linked_other_account';
          // setTimeout(() => {
          //   this.errorMessage = "";
          // }, 6000);
        }
      });
  }
  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
  logout() {
    let social = 'telegram';
    this.profileSettingsFacade.logoutRS(social).subscribe((data: any) => {
      this.ngOnInit();
      this.successMessage = '';
      this.errorMessage = 'deconnect_successfully';
    });
  }
}
