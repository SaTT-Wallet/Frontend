import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sattUrl } from '@app/config/atn.config';
import { SocialAccountsFacade } from '@app/social-accounts/facade/social-accounts.facade';
import { ESocialMediaNames } from '@app/core/enums';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-monetize-facebook-account',
  templateUrl: './monetize-facebook-account.component.html',
  styleUrls: ['./monetize-facebook-account.component.css']
})
export class MonetizeFacebookAccountComponent implements OnInit, OnDestroy {
  loginNet: string = '';
  routerSub: any;
  errorMessage = '';
  successMessage = '';
  userId: any;
  channelFacebook: any;
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;
  private onDestoy$ = new Subject();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socialAccountsFacade: SocialAccountsFacade,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    this.tokenStorageService.setSecureWallet('visited-facebook', 'true');

    this.getUrlMsg();
    this.getSocialNetwork();
    this.userId = this.tokenStorageService.getIdUser();
    this.route.queryParams.subscribe((params: any) => {
      if (params.message === 'account_linked_with_success') {
        this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
        this.skipPage();
      }
    });
  }
  skipPage() {
    this.router.navigate(['social-registration/monetize-twitter']);
  }
  skipAll() {
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.facebook);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.youtube);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.twitter);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.tiktok);

    this.router.navigate(['social-registration/socialConfig']);
  }
  getSocialNetwork() {
    this.socialAccount$.pipe(takeUntil(this.onDestoy$)).subscribe(
      (data: any) => {
        if (data !== null) {
          this.channelFacebook = data.facebook;
        } else {
          this.channelFacebook = [];
        }
      },
      (err) => {
        if (err.error.code === 404 && err.error.message === 'No channel found')
          this.channelFacebook = [];
      }
    );
  }

  linkAccount() {
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        '/profile/addChannel/facebook/' +
        this.userId +
        '?redirect=' +
        this.router.url;
  }
  deleteLink() {
    this.socialAccountFacadeService
      .deleteOneSocialNetworksFb(this.channelFacebook[0]._id)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((response: any) => {
        if (response.message === 'deleted successfully') {
          this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
          this.ngOnInit();
        }
      });
  }

  getUrlMsg() {
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((p) => {
        if (
          p.message === 'account_linked_with_success_instagram_facebook' ||
          p.message === 'account_linked_with_success_facebook'
        ) {
          this.successMessage = 'account_linked_with_success';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['social-registration/monetize-twitter']);
            // this.router.navigate(["social-registration/monetize-facebook"])
          }, 1000);
        } else if (p.message === 'required_page' && p.sn === 'fb') {
          this.errorMessage = 'no_page_selected';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['social-registration/monetize-facebook']);
          }, 6000);
        } else if (p.message === 'account exist') {
          this.errorMessage = 'account_linked_other_account';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-facebook']);
          }, 6000);
        } else if (p.message === 'channel obligatoire') {
          this.errorMessage = 'no_channel_found';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-facebook']);
          }, 1000);
        } else if (p.message === 'access-denied') {
          this.errorMessage = 'access-cancel';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-facebook']);
          }, 6000);
        }
      });
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
    this.routerSub.unsubscribe();
  }
}
