import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { sattUrl } from '@app/config/atn.config';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAccountsFacade } from '@app/social-accounts/facade/social-accounts.facade';
import { ESocialMediaNames } from '@app/core/enums';
import { Subject } from 'rxjs';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-monetize-google-account',
  templateUrl: './monetize-google-account.component.html',
  styleUrls: ['./monetize-google-account.component.css']
})
export class MonetizeGoogleAccountComponent implements OnInit, OnDestroy {
  loginNet: string = '';
  routerSub: any;
  errorMessage = '';
  successMessage = '';
  channelGoogle: any;
  userId = this.tokenStorageService.getIdUser();
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
    //this.tokenStorageService.setSecureWallet('visited-google', 'true');
    this.getSocialNetwork();
    this.getUrlMsg();
    this.route.queryParams.subscribe((params: any) => {
      if (params.message === 'account_linked_with_success') {
        if (params.sn && params.sn === 'google') {
          this.socialAccountsFacade.pageVisited(ESocialMediaNames.youtube);
          this.skipPage();
        }
      }
    });
  }
  getSocialNetwork() {
    this.socialAccount$
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((data: any) => {
        if (data !== null) {
          this.channelGoogle = data.google;
        } else {
          this.channelGoogle = [];
        }
      });
  }
  linkAccount() {
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        '/profile/addChannel/youtube/' +
        this.userId +
        '?redirect=' +
        this.router.url;
  }
  deleteLink() {
    this.socialAccountFacadeService
      .deleteOneSocialNetworksGoogle(this.channelGoogle[0]._id)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((response: any) => {
        if (response.message === 'deleted successfully') {
          this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
          this.ngOnInit();
        }
      });
  }
  skipPage() {
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.youtube);
    this.router.navigate(['social-registration/monetize-tiktok']);
  }
  skipAll() {
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.facebook);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.youtube);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.twitter);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.tiktok);

    this.router.navigate(['social-registration/socialConfig']);
  }
  getUrlMsg() {
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((p) => {
        if (p.message === 'account_linked_with_success') {
          this.successMessage = 'account_linked_with_success';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['social-registration/socialConfig']);
          }, 1000);
        } else if (p.message === 'account exist') {
          this.errorMessage = 'account_linked_other_account';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-google']);
          }, 1000);
        } else if (p.message === 'channel obligatoire') {
          this.errorMessage = 'no_channel_found';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-google']);
          }, 1000);
        } else if (p.message === 'access-denied') {
          this.errorMessage = 'access-cancel';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-google']);
          }, 1000);
        }
      });
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
    this.routerSub.unsubscribe();
  }
}
