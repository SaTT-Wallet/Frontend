import { Component, OnDestroy, OnInit } from '@angular/core';
import { sattUrl } from '@app/config/atn.config';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAccountsFacade } from '@app/social-accounts/facade/social-accounts.facade';
import { ESocialMediaNames } from '@app/core/enums';
import { Subject } from 'rxjs';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

@Component({
  selector: 'app-monetize-linkedin-account',
  templateUrl: './monetize-linkedin-account.component.html',
  styleUrls: ['./monetize-linkedin-account.component.css']
})
export class MonetizeLinkedinAccountComponent implements OnInit, OnDestroy {
  loginNet: string = '';
  routerSub: any;
  errorMessage = '';
  successMessage = '';
  channelLinkedin: any;
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
    this.getSocialNetwork();
    this.getUrlMsg();
    this.route.queryParams.subscribe((params: any) => {
      if (params.message === 'account_linked_with_success') {
        if (params.sn && params.sn === 'linkd') {
          this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
        }
      }
    });
  }

  skipPage() {
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
    this.router.navigate(['social-registration/monetize-google']);
  }
  skipAll() {
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.facebook);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.youtube);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
    this.socialAccountsFacade.pageVisited(ESocialMediaNames.twitter);
    this.router.navigate(['social-registration/socialConfig']);
  }
  getSocialNetwork() {
    this.socialAccount$
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((data: any) => {
        if (data !== null) {
          this.channelLinkedin = data.linkedin;
        } else {
          this.channelLinkedin = [];
        }
      });
  }
  linkAccount() {
    window.location.href =
      sattUrl +
      '/profile/addChannel/linkedin/' +
      this.userId +
      '?redirect=' +
      this.router.url;
  }
  deleteLink() {
    this.socialAccountFacadeService
      .deleteOneSocialNetworksLinkedin(this.channelLinkedin[0].organization)
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
            this.router.navigate(['social-registration/monetize-google']);
          }, 1000);
        } else if (p.message === 'account exist') {
          this.errorMessage = 'account_linked_other_account';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-linkedin']);
          }, 1000);
        } else if (p.message === 'channel obligatoire') {
          this.errorMessage = 'no_channel_found';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-linkedin']);
          }, 1000);
        } else if (p.message === 'access-denied') {
          this.errorMessage = 'access-cancel';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['social-registration/monetize-linkedin']);
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
