import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { ProfileSettingsStoreService } from './core/services/profile/profile-settings-store.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
// './services/notification/notification'
// declare ga as a function to set and sent the events
declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wallet-satt-angular';
  message: any;
  constructor(
    public router: Router,
    private tokenStorageService: TokenStorageService,
    private notificationService: NotificationService,
    private profileService: ProfileSettingsStoreService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
          )
        )
        .subscribe((event: NavigationEnd) => {
          /** START : Code to Track Page View  */
          gtag('event', 'page_view', {
            page_path: event.urlAfterRedirects
          });
          /** END */
        });
    }
  }

  ngOnInit() {
    // this.notificationService.requestPermission();

    // this.notificationService.receiveMessage();
    //this.message = this.notificationService.currentMessage;
    this.notificationService.triggerFireBaseNotifications.subscribe(() => {
      this.notificationService.requestPermission();
      this.notificationService.receiveMessage();
    });
    if (this.tokenStorageService.getIsAuth()) {
      this.profileService.hydrateLocalStorage();
    }
  }
}
