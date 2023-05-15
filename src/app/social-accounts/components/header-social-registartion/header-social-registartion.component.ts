import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DOCUMENT, isPlatformBrowser, Location } from '@angular/common';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-header-social-registartion',
  templateUrl: './header-social-registartion.component.html',
  styleUrls: ['./header-social-registartion.component.css']
})
export class HeaderSocialRegistartionComponent implements OnInit {
  english: boolean = true;
  private isDestroyed = new Subject();

  constructor(
    public translate: TranslateService,
    public router: Router,
    private _location: Location,
    private campaignDataStore: CampaignsStoreService,
    private tokenStorageService: TokenStorageService,
    public _changeDetectorRef: ChangeDetectorRef,
    private accountFacadeService: AccountFacadeService,
    private socialAccountFacadeService: SocialAccountFacadeService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocale()) {
      // @ts-ignore
      this.languageSelected = this.tokenStorageService.getLocalLang();
      translate.setDefaultLang(this.languageSelected);
    } else {
      this.tokenStorageService.setLocalLang('en');
      this.languageSelected = 'en';
      translate.setDefaultLang('en');
    }
    translate.onLangChange
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((event: LangChangeEvent) => {
        this.languageSelected = event.lang;
        this._changeDetectorRef.detectChanges();
        this.translate.use(this.languageSelected);
        if (this.languageSelected === 'en') {
          this.english = true;
        } else {
          this.english = false;
        }
      });
  }
  languageSelected: string = 'en';
  ngOnInit(): void {}
  switchLang(lang: string) {
    if (isPlatformBrowser(this.platformId))
      this.document.getElementById('content');
    this.tokenStorageService.removeLocalLang();
    this.tokenStorageService.setLocalLang(lang);
    this.languageSelected = lang;
    this.translate.use(lang);
  }
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
  signOut() {
    this.tokenStorageService.clear();
    this.campaignDataStore.clearDataStore(); 
    this.tokenStorageService.signOut();
    this.socialAccountFacadeService.dispatchLogoutSocialAccounts();
    this.accountFacadeService.dispatchLogoutAccount();
    this.router.navigate(['/auth/login']);
    
    /*this.tokenStorageService.logout().subscribe(
      () => {
        
        this.campaignDataStore.clearDataStore(); // clear globale state before logging out user.
        

        //clear totalBalance and cryptoList
        this.accountFacadeService.dispatchLogoutAccount(); //clear account user
        this.socialAccountFacadeService.dispatchLogoutSocialAccounts(); // clear social accounts
        
        this.router.navigate(['/auth/login']);
        
      }
      // () => {
      //   this.campaignFacade.clearLinksListStore();
      //   this.campaignDataStore.clearDataStore(); // clear globale state before logging out user.
      //   this.ParticipationListStoreService.clearDataFarming();
      //   this.walletFacade.dispatchLogout(); //clear totalBalance and cryptoList
      //   this.accountFacadeService.dispatchLogoutAccount(); //clear account user
      //   this.socialAccountFacadeService.dispatchLogoutSocialAccounts(); // clear social accounts
      //   this.ParticipationListStoreService.nextPage.pageNumber = 0;
      //   this.profileSettingsFacade.clearProfilePicStore();
      //   this.authStoreService.clearStore();
      //   this.tokenStorageService.clear();
      //   this.kycFacadeService.dispatchLogoutKyc();
      //   this.isConnected = false;
      //   this.authService.setIsAuthenticated(false);
      //   if (isPlatformBrowser(this.platformId)) {
      //     window.location.reload();
      //   }
      //   this.router.navigate(['/auth/login']);
      // }
    );*/
    /*this.campaignDataStore.clearDataStore(); // clear globale state before logging out user.
    this.tokenStorageService.signOut();
    this.socialAccountFacadeService.dispatchLogoutSocialAccounts();
    this.accountFacadeService.dispatchLogoutAccount();
    // if (isPlatformBrowser(this.platformId)) {
    //   window.location.reload();
    // }
    //window.location.assign("https://satt.atayen.us/#/")
    this.router.navigate(['/auth/login']);*/
  }

  refresh() {
    this._location.back();
  }
  trackByLanguage(index: number, language: any): string {
    return language.code;
  }
}
