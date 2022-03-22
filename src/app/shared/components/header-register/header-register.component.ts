import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { DOCUMENT, Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header-register',
  templateUrl: './header-register.component.html',
  styleUrls: ['./header-register.component.css']
})
export class HeaderRegisterComponent implements OnInit {
  english: boolean = true;
  private isDestroyed = new Subject();

  constructor(
    public translate: TranslateService,
    public router: Router,
    private _location: Location,
    private campaignDataStore: CampaignsStoreService,
    private tokenStorageService: TokenStorageService,
    public _changeDetectorRef: ChangeDetectorRef,

    @Inject(DOCUMENT) private document: Document
  ) {
    translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocalLang()) {
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
    this.campaignDataStore.clearDataStore(); // clear globale state before logging out user.
    this.tokenStorageService.signOut();
    //window.location.assign("https://satt.atayen.us/#/")
    this.router.navigate(['/auth/login']);
  }

  refresh() {
    this._location.back();
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
