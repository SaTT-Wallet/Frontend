import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/User';
import { Subject } from 'rxjs';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { filter, takeUntil } from 'rxjs/operators';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

@Component({
  selector: 'app-left-component',
  templateUrl: './left-component.component.html',
  styleUrls: ['./left-component.component.css']
})
export class LeftComponentComponent implements OnInit, OnDestroy {
  percentNet: number = 0;
  percentNet2!: string;
  socialType: string = '';
  user!: User;
  pic: any;

  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;
  constructor(
    private accountFacadeService: AccountFacadeService,
    public router: Router,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    if (this.tokenStorageService.getEnabled() === '1') {
      this.getProfilePic();
    }
    this.calcPercent();
  }

  // calcPercent() {
  //   this.profileSettingsFacade.getSocialNetworks().subscribe((data: any) => {
  //     if (
  //       data.facebook.length == 0 &&
  //       data.google.length == 0 &&
  //       data.twitter.length == 0
  //     ) {
  //       this.socialType = 'none'
  //       console.log(this.socialType)
  //     }

  //     console.log(data, 'data')
  //     if (data.facebook.length !== 0) {
  //       this.socialType = 'facebook'
  //       console.log(this.socialType)
  //     }

  //     if (data.facebook.instagram_id !== 0) {
  //       this.socialType = 'instagram'
  //       console.log(this.socialType)
  //     }
  //     if (data.google.length !== 0) {
  //       this.socialType = 'google'
  //       console.log(this.socialType)
  //     }
  //     if (data.twitter.length !== 0) {
  //       this.socialType = 'twitter'
  //       console.log(this.socialType)
  //     }
  //     if (data.facebook.length !== 0 && data.facebook.instagram_id) {
  //       this.socialType = 'facebookinstagram'
  //       console.log(this.socialType)
  //     }
  //     if (data.twitter.length !== 0 && data.facebook.instagram_id) {
  //       this.socialType = 'twitterinstagram'
  //       console.log(this.socialType)
  //     }
  //     if (data.twitter.length !== 0 && data.facebook.length !== 0) {
  //       this.socialType = 'twitterfacebook'
  //       console.log(this.socialType)
  //     }
  //     if (data.twitter.length !== 0 && data.google.length !== 0) {
  //       this.socialType = 'twittergoogle'
  //       console.log(this.socialType)
  //     }
  //     if (data.facebook.instagram_id && data.google.length !== 0) {
  //       this.socialType = 'instagramgoogle'
  //       console.log(this.socialType)
  //     }
  //     if (data.facebook.instagram_id && data.google.length !== 0) {
  //       this.socialType = 'facebookgoogle'
  //       console.log(this.socialType)
  //     }
  //     if (
  //       data.facebook.length !== 0 &&
  //       data.facebook.instagram_id &&
  //       data.twitter.length !== 0
  //     ) {
  //       this.socialType = 'twitterinstagramfacebook'
  //       console.log(this.socialType)
  //     }
  //     if (
  //       data.facebook.length !== 0 &&
  //       data.twitter.length !== 0 &&
  //       data.google.length !== 0
  //     ) {
  //       this.socialType = 'twitterfacebookgoogle'
  //       console.log(this.socialType)
  //     }
  //     if (
  //       data.facebook.length !== 0 &&
  //       data.facebook.instagram_id &&
  //       data.google.length !== 0
  //     ) {
  //       this.socialType = 'facebookgoogleinstagram'
  //       console.log(this.socialType)
  //     }
  //     if (
  //       data.twitter.length !== 0 &&
  //       data.facebook.instagram_id &&
  //       data.google.length !== 0
  //     ) {
  //       this.socialType = 'twittergoogleinstagram'
  //       console.log(this.socialType)
  //     }
  //     if (
  //       data.twitter.length !== 0 &&
  //       data.facebook.instagram_id &&
  //       data.google.length !== 0 &&
  //       data.facebook.length !== 0
  //     ) {
  //       this.socialType = 'twitterinstagramfacebookgoogle'
  //       console.log(this.socialType)
  //     }
  //     //  console.log(this.percentNet,this.percentNet2)
  //   })
  // }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
  }
  getProfilePic() {
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: any) => {
        this.user = response;
        if (this.tokenStorageService.getTypeSN() !== '0') {
          this.pic = response.picLink;
        }
      });
  }
  calcPercent() {
    let count2 = 0;
    this.socialAccount$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((data: any) => {
        if (data.facebook.length !== 0 && data.facebook.instagram_username) {
          count2++;
        }
        if (data.facebook.length !== 0 && !data.facebook.instagram_username) {
          count2++;
        }
        if (data.google.length !== 0) {
          count2++;
        }
        if (data.twitter.length !== 0) {
          count2++;
        }
        if (data.linkedin.length !== 0) {
          count2++;
        }
        this.percentNet = (count2 * 100) / 5;
        this.percentNet2 = this.percentNet.toFixed(0) + '%';
      });
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
}
