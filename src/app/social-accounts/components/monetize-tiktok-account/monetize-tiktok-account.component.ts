import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { SocialAccountsFacade } from '@app/social-accounts/facade/social-accounts.facade';
import { ESocialMediaNames } from '@app/core/enums';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-monetize-tiktok-account',
  templateUrl: './monetize-tiktok-account.component.html',
  styleUrls: ['./monetize-tiktok-account.component.css']
})
export class MonetizeTiktokAccountComponent implements OnInit {
  loginNet: string = '';
  routerSub: any;
  errorMessage = '';
  successMessage = '';
  channelTiktok = [];
  userId = this.tokenStorageService.getIdUser();
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;
  private onDestoy$ = new Subject();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socialAccountsFacade: SocialAccountsFacade,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.tokenStorageService.setSecureWallet('visited-tiktok', 'true');
    //this.getSocialNetwork();
    //  this.getUrlMsg();
  }
  skipPage() {
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.tiktok);
    this.router.navigate(['social-registration/monetize-linkedin']);
  }
  linkAccount() {
    // if (isPlatformBrowser(this.platformId))
    //   window.location.href =
    //     sattUrl +
    //     '/profile/addChannel/tiktok/' +
    //     this.userId +
    //     '?redirect=' +
    //     this.router.url;
  }
  deleteLink() {
    // this.socialAccountFacadeService
    //   .deleteOneSocialNetworksTwitter(this.channelTiktok[0]._id)
    //   .pipe(takeUntil(this.onDestoy$))
    //   .subscribe((response: any) => {
    //     if (response.message === 'deleted successfully') {
    //       this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
    //       this.ngOnInit();
    //     }
    //   });
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
      .pipe(
        catchError((error: any) => {
          if (error.error.error === 'Not found' && error.error.code === 404) {
            this.channelTiktok = [];
          }
          return of(null);
        }),
        takeUntil(this.onDestoy$)
      )
      .subscribe((data: any) => {
        if (data !== null) {
          this.channelTiktok = data.tiktok;
        } else {
          this.channelTiktok = [];
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
            this.router.navigate(['social-registration/monetize-linkedin']);
          }, 1000);
        } else if (p.message === 'account exist') {
          this.errorMessage = 'account_linked_other_account';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-tiktok']);
          }, 1000);
        } else if (p.message === 'channel obligatoire') {
          this.errorMessage = 'no_channel_found';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-tiktok']);
          }, 1000);
        } else if (p.message === 'access-denied') {
          this.errorMessage = 'access-cancel';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-tiktok']);
          }, 1000);
        }
      });
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
    //  this.routerSub.unsubscribe();
  }
}
