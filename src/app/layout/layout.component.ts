import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DraftCampaignStoreService } from '@core/services/draft-campaign-store.service';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KycFacadeService } from '@app/core/facades/kyc-facade/kyc-facade.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('useDesktopModal', { static: false })
  public useDesktopModal!: TemplateRef<any>;
  scrollTopChange: boolean = false;
  smDevice = false;
  scrolled: boolean = false;
  phishingVisibility: boolean = false;
  getScreenWidth: any;
  storageInformation: string | null;
  private isDestroyed$ = new Subject();
  constructor(

    public router: Router,
    private draftCampaignStore: DraftCampaignStoreService,
    private campaignService: CampaignHttpApiService,
    private walletFacade: WalletFacadeService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private accountFacadeService: AccountFacadeService,
    private tokenStorageService: TokenStorageService,
    private socialAccountFacadeService: SocialAccountFacadeService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: string,
    private kycFacadeService: KycFacadeService
  ) {
    try {
      if (window.localStorage.getItem('phishing') === null) {
        window.localStorage.setItem('phishing', 'true');
      }
      this.storageInformation = window.localStorage.getItem('phishing');
    } catch (error) {
      console.error('Could not access localStorage:', error);
      this.storageInformation = null;
    }
  }
  ngAfterViewInit(): void {
    if (this.router.url == '/wallet' || this.router.url.includes('campaign')) {
      let content = this.document.getElementById('center-content');
      content.classList.add('center-content-2');
    } else {
      let content = this.document.getElementById('center-content');
      content.classList.remove('center-content-2');
    }

    this.router.events
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          let outlet = this.document.getElementsByClassName('outlet');
          if (
            this.router.url !== '/wallet' &&
            !this.router.url.includes('campaign')
          ) {
            let content = this.document.getElementById('center-content');
            content.classList.remove('center-content-2');
          } else {
            let content = this.document.getElementById('center-content');
            content.classList.add('center-content-2');
          }
          if (outlet.length > 0) {
            outlet[0].scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }
  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    if (window.innerWidth <= 768 && isPlatformBrowser(this.platformId)) {
      this.smDevice = true;
    } else {
      this.smDevice = false;
    }
    if (
      this.tokenStorageService.getSecureWallet('visited-passPhrase') === 'false'
    ) {
      this.router.navigate(['social-registration/pass-phrase']);
      // window.location.reload()
    }
    if (this.tokenStorageService.getToken()) {
      if (isPlatformBrowser(this.platformId)) {
        this.walletFacade.initWallet(); // initialize total balance// initialize crypto list and gaz
        this.draftCampaignStore.init(); // initialize draft campaign list data
        this.profileSettingsFacade.loadUserProfilePic(); // initialize user profile picture
        this.accountFacadeService.initAccount();
        this.socialAccountFacadeService.initSocialAccount();
        this.kycFacadeService.initKyc();
      }
    }
  }
  //change chart wallet position on the window re-size
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getScreenWidth = event.target.innerWidth;
    if (isPlatformBrowser(this.platformId)) {
      let topBar = this.document.getElementById('campaign-top-bar');
      let btnApply = this.document.getElementById('btn-apply');
      if (window.innerWidth < 768) {
        this.smDevice = true;
      } else {
        this.smDevice = false;
      }
      if (this.router.url.startsWith('/campaign/')) {
        if (
          event.target.innerWidth > 768 &&
          event.target.innerWidth < 1025 &&
          topBar
        ) {
          topBar.style.display = 'none';
          if (btnApply) btnApply.style.display = 'none';
        } else {
          if (btnApply) btnApply.style.display = 'flex';
        }
        //  else {
        //   if (this.scrolled) {
        //     topBar.style.display = 'flex';
        //     if (btnApply) btnApply.style.display = 'none';
        //     header.style.backgroundColor = '#2F3347';
        //   } else {
        //     topBar.style.display = 'none';
        //     if (btnApply) btnApply.style.display = 'flex';
        //     header.style.backgroundColor = 'transparent';
        //   }
        // }
      }
      if (this.router.url.startsWith('/wallet')) {
        let chart = this.document.getElementById('chart');

        if (chart) {
          if (event.target.innerWidth > 767.98) {
            chart.style.position = 'relative';
          } else {
            chart.style.position = 'absolute';
          }
        }
      }
    }
  }
  getStorageInformation() {
    if (!this.storageInformation) {
      this.storageInformation = window.localStorage.getItem('phishing');
    }
    return window.localStorage.getItem('phishing');
  }
  close() {
    window.localStorage.setItem('phishing', 'false');
    this.phishingVisibility = true;
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    // console.log('event.target.clientWidth', event.target.clientWidth);
    // visible height + pixel scrolled >= total height
    if (isPlatformBrowser(this.platformId)) {
      if (
        event.target.offsetHeight + event.target.scrollTop >=
        event.target.scrollHeight - 5
      ) {
        if (this.router.url.startsWith('/ad-pools')) {
          this.campaignService.loadDataAddPoolWhenEndScroll.next(true);
        }
        if (this.router.url.startsWith('/farm-posts')) {
          this.campaignService.loadDataPostFarmWhenEndScroll.next(true);
        }
        if (this.router.url.startsWith('/campaign/')) {
          this.campaignService.loadDataEarningsWhenEndScroll.next(true);
        }
        if (this.router.url.startsWith('/welcome') && this.smDevice) {
          this.campaignService.loadDataWelcomePageWhenEndScroll.next(true);
        }
      }
      let cover = this.document.getElementById('campaign-cover');
      //change chart wallet position on scroll
      if (this.router.url.startsWith('/wallet')) {
        let chart = this.document.getElementById('chart');
        let header = this.document.getElementById('navbar-id');
        let content = this.document.getElementById('center-content');
        header.style.background = '';
        header.classList.remove('navbar-trans2');

        if (event.target.scrollTop > 225) {
          header.classList.add('navbar-wallet');
        } else {
          header.classList.remove('navbar-wallet');
        }
        if (event.target.scrollTop < 768) {
          if (chart) {
            if (event.target.scrollTop >= 68) {
              chart.style.position = 'relative';
            }
            if (event.target.scrollTop < 68) {
              chart.style.position = 'fixed';
            }
            if (event.target.scrollTop < 274) {
              chart.style.position = 'fixed';
            }
          }
        }
      } else if (
        this.router.url.startsWith('/campaign/') &&
        !this.router.url.includes('edit')
      ) {
        let main = this.document.getElementById('campaign-main-content');
        let topBar = this.document.getElementById('campaign-top-bar');
        let header = this.document.getElementById('navbar-id');
        let btnApply = this.document.getElementById('btn-apply');
        let disabledPic = this.document.getElementById('back-top-pic-disabled');
        let disabledText = this.document.getElementById(
          'back-top-text-disabled'
        );
        let bluePic = this.document.getElementById('back-top-pic');
        let blueText = this.document.getElementById('back-top-text');
        let content = this.document.getElementById('center-content');
        header.style.background = '';
        header.classList.remove('navbar-trans2');
        header.classList.remove('navbar-wallet');
        if (event.target.clientWidth < 1025) {
          header.classList.add('navbar-trans2');
          //header.style.background = '';
          //if (btnApply) btnApply.style.display = 'none';
          if (event.target.scrollTop < 159) {
            header.classList.remove('navbar-trans2');
            if (blueText && bluePic && disabledText && disabledPic) {
              blueText.style.display = 'none';
              bluePic.style.display = 'none';
              disabledText.style.display = 'block';
              disabledPic.style.display = 'block';
              this.campaignService.scrolling.next(true);
            }

            // cover.style.position = 'fixed';
            // main.style.marginTop = '28%';
            // // cover.style.position = 'fixed';
            // header.style.background = 'transparent';
          } else {
            // cover.style.position = 'relative';
            // main.style.marginTop = '-16vw';
            if (blueText && bluePic && disabledText && disabledPic) {
              blueText.style.display = 'block';
              bluePic.style.display = 'block';
              disabledText.style.display = 'none';
              disabledPic.style.display = 'none';
              this.campaignService.scrolling.next(false);
            }
            header.style.background = '';
          }
          if (topBar) topBar.style.display = 'none';
        } else {
          if (
            event.target.clientWidth > 1024 &&
            event.target.scrollTop >= 440
          ) {
            //cover.style.position = 'relative';
            //  main.style.marginTop = '-35px';
            if (topBar) topBar.style.display = 'flex';
            if (btnApply) btnApply.style.display = 'none';
            header.style.background = '#2F3347';
          } else if (
            event.target.clientWidth <= 1024 &&
            event.target.scrollTop > 477
          ) {
            if (event.target.innerWidth > 768) {
              if (btnApply) btnApply.style.display = 'none';
            }
            this.scrolled = true;
            if (cover) cover.style.position = 'relative';
            if (main) main.style.marginTop = '-16vw';
            if (topBar) topBar.style.display = 'none';
            header.style.background = '#2F3347';
          } else {
            this.scrolled = false;
            if (topBar) topBar.style.display = 'none';
            if (btnApply) btnApply.style.display = 'flex';
            if (cover) cover.style.position = 'fixed';
            //  if (main) main.style.marginTop = '28%';
            header.style.background = '';
          }
        }
      } else {
        let header = this.document.getElementById('navbar-id');
        header.style.background =
          'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%);';
        header.classList.add('navbar-trans2');
        let content = this.document.getElementById('center-content');
        header.classList.remove('navbar-wallet');

        if (event.target.scrollTop === 0) {
          header.style.background = '';
          header.classList.remove('navbar-trans2');
          header.classList.remove('navbar-trans');
          header.classList.remove('navbar-wallet');
        }
      }
    }
  }
}
