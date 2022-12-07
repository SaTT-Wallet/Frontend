import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from '@core/services/profile/profile.service';
import { filter, tap } from 'rxjs/operators';
import { AuthService } from '../Auth/auth.service';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsStoreService {
  private _profilePic: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  readonly profilePic$ = this._profilePic
    .asObservable()
    .pipe(filter((pic) => pic !== null));

  constructor(
    public router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    private localStorageService: TokenStorageService
  ) {}

  loadProfilePic() {
    this.profileService.getUserProfilePic().subscribe((res: any) => {
      this._profilePic.next(res);
    });
  }

  getProfilePic() {
    return this.profileService.getUserProfilePic().pipe(
      tap((res: any) => {
        this._profilePic.next(res);
      })
    );
  }

  updateprofile(body: any) {
    return this.profileService.updateprofile(body).pipe(
      tap(() => {
        this.loadProfilePic();
      })
    );
  }

  hydrateLocalStorage() {
    this.authService.verifyAccount().subscribe((data: any) => {
      if (data.passphrase) {
        this.localStorageService.setSecureWallet('visited-passPhrase', 'true');
      }
    });
  }
}
