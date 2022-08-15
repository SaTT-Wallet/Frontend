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
import { Subject } from 'rxjs';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-monetize-twitter-account',
  templateUrl: './monetize-twitter-account.component.html',
  styleUrls: ['./monetize-twitter-account.component.css']
})
export class MonetizeTwitterAccountComponent implements OnInit, OnDestroy {
  loginNet: string = '';
  routerSub: any;
  errorMessage = '';
  successMessage = '';
  channelTwitter: any;
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
    this.tokenStorageService.setSecureWallet('visited-twitter', 'true');
    this.getSocialNetwork();
    this.getUrlMsg();
    this.route.queryParams.subscribe((params: any) => {
      if (params.message === 'account_linked_with_success') {
        this.socialAccountsFacade.pageVisited(ESocialMediaNames.twitter);
        this.skipPage();
      }
    });
  }

  skipPage() {
    this.router.navigate(['social-registration/monetize-linkedin']);

    // this.router.navigate(['social-registration/monetize-tiktok']);
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
    this.socialAccount$
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((data: any) => {
        if (data !== null) {
          this.channelTwitter = data.twitter;
        } else {
          this.channelTwitter = [];
        }
        // if (this.channelTwitter.length > 0) {
        //   setTimeout(() => {
        //     this.skipPage();
        //   }, 3000);
        // }
      });
  }
  linkAccount() {
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        '/profile/addChannel/twitter/' +
        this.userId +
        '?redirect=' +
        this.router.url;
    // console.log(
    //   sattUrl +
    //   '/profile/addChannel/twitter/' +
    //   this.userId +
    //   '?redirect=' +
    //   this.router.url;
    // )
  }
  deleteLink() {
    this.socialAccountFacadeService
      .deleteOneSocialNetworksTwitter(this.channelTwitter[0]._id)
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
        if (p.message === 'account_linked_with_success') {
          this.successMessage = 'account_linked_with_success';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['social-registration/monetize-tiktok']);
          }, 1000);
        } else if (p.message === 'account exist') {
          this.errorMessage = 'account_linked_other_account';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-twitter']);
          }, 6000);
        } else if (p.message === 'access-denied') {
          this.errorMessage = 'access-cancel';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-twitter']);
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
