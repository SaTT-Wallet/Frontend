import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { User } from '@app/models/User';

import { SocialAccountsFacade } from '@app/social-accounts/facade/social-accounts.facade';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-monetize-steps',
  templateUrl: './monetize-steps.component.html',
  styleUrls: ['./monetize-steps.component.css']
})
export class MonetizeStepsComponent implements OnInit, OnDestroy {
  visitedFb: boolean = false;
  visitedGoogle: boolean = false;
  visitedTelegram: boolean = false;
  visitedPwd: boolean = false;
  visitedConfig: boolean = false;
  visitedActivePass: boolean = false;
  visitedTwitter: boolean = false;
  visitedPassPhrase: boolean = false;
  visitedLinkedin: boolean = false;
  visitedTiktok: boolean = false;
  visitedPages$ = this.socialAccountsFacade.visitedPages$;
  account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  constructor(
    private accountFacadeService: AccountFacadeService,
    public router: Router,
    private tokenStorageService: TokenStorageService,
    private socialAccountsFacade: SocialAccountsFacade
  ) {}

  onSubmit() {
    return false;
  }

  ngOnInit(): void {
    this.checkVesited();
    this.getUser();

    // this.visitedPages$.subscribe((page) => console.log(page));
  }

  checkVesited() {
    if (
      this.tokenStorageService.getSecureWallet('visited-facebook') === 'true'
    ) {
      this.visitedFb = true;
    }
    if (
      this.tokenStorageService.getSecureWallet('visited-linkedin') === 'true'
    ) {
      this.visitedLinkedin = true;
    }
    if (
      this.tokenStorageService.getSecureWallet('visited-twitter') === 'true'
    ) {
      this.visitedTwitter = true;
    }
    if (this.tokenStorageService.getSecureWallet('visited-tiktok') === 'true') {
      this.visitedTiktok = true;
    }
    if (this.tokenStorageService.getSecureWallet('visited-google') === 'true') {
      this.visitedGoogle = true;
    }
    if (this.tokenStorageService.getSecureWallet('visited-pwd') === 'true') {
      this.visitedPwd = true;
    }
    if (this.tokenStorageService.getSecureWallet('visited-key') === 'true') {
      this.visitedConfig = true;
    }
    if (
      this.tokenStorageService.getSecureWallet('visited-activePass') === 'true'
    ) {
      this.visitedActivePass = true;
    }
    if (
      this.tokenStorageService.getSecureWallet('visited-passPhraase') === 'true'
    ) {
      this.visitedPassPhrase = true;
    }
  }
  redirectFromSteps(type: string) {
    let wallet = this.tokenStorageService.getIdWallet();
    if (!wallet) {
      if (
        type === 'twitter' &&
        this.tokenStorageService.getSecureWallet('visited-twitter') === 'true'
      ) {
        this.router.navigate(['/social-registration/monetize-twitter']);
      }
      //  else if (
      //   type === 'tiktok' &&
      //   this.tokenStorageService.getSecureWallet('visited-tiktok') === 'true'
      // ) {
      //   this.router.navigate(['/social-registration/monetize-tiktok']);
      // }
      else if (
        type === 'linkedin' &&
        this.tokenStorageService.getSecureWallet('visited-linkedin') === 'true'
      ) {
        this.router.navigate(['/social-registration/monetize-linkedin']);
      } else if (
        type === 'google' &&
        this.tokenStorageService.getSecureWallet('visited-google') === 'true'
      ) {
        this.router.navigate(['/social-registration/monetize-google']);
      } else if (
        type === 'facebook' &&
        this.tokenStorageService.getSecureWallet('visited-facebook') === 'true'
      ) {
        this.router.navigate(['/social-registration/monetize-facebook']);
      }
    }
  }
  getUser() {
    // let address = this.tokenStorageService.getIdWallet();
    // if (address) {
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((account: User) => {
        if (account.visitsocialAccounts) {
          this.visitedFb = true;
          this.visitedLinkedin = true;
          this.visitedTwitter = true;
          this.visitedGoogle = true;
          this.visitedTiktok = true;
          this.visitedPwd = true;
          this.visitedConfig = true;
          this.visitedActivePass = true;
          this.visitedPassPhrase = true;
        }
      });
  }
  // }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
}
