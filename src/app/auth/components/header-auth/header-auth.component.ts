import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-auth',
  templateUrl: './header-auth.component.html',
  styleUrls: ['./header-auth.component.css']
})
export class HeaderAuthComponent implements OnInit {
  languageSelected: string = 'en';
  constructor(
    public translate: TranslateService,
    private router: Router,
    public _changeDetectorRef: ChangeDetectorRef,
    private tokenStorageService: TokenStorageService
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
  }

  ngOnInit(): void {}

  switchLang(lang: string) {
    //this.tokenStorageService.removeLocalLang()
    this.tokenStorageService.setLocalLang(lang);
    this.languageSelected = lang;
    this.translate.use(lang);
  }

  goToRegistration() {
    this.router.navigate(['/auth/registration']);
    // this.router.navigate(['/auth/registration'], { queryParams: { code: '399857b944bb4bbcbb9dc1a4c056f35363120',id:"60868533aa7c4e04f4ade44f" } });
  }

  onGoToHome() {
    this.router.navigate(['']);
    // if (this.tokenStorageService.getIsAuth() !== 'true') {
    //   this.tokenStorageService.signOut();
    //   this.router.navigate([''], { skipLocationChange: true });
    // } else {
    //   this.router.navigate(['']);
    // }
  }

  trackByLanguage(index: number, language: string) {
    return language;
  }
}
