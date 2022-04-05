import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '@app/models/User';
import { ProfileService } from '@core/services/profile/profile.service';
import { Observable, of, Subject } from 'rxjs';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';

@Component({
  selector: 'app-user-picture',
  templateUrl: './user-picture.component.html',
  styleUrls: ['./user-picture.component.scss']
})
export class UserPictureComponent implements OnInit {
  @Input() isHeaderPic: boolean = true;
  picUserUpdated: boolean = false;
  user!: User;
  private isDestroyed = new Subject();

  picture$!: Observable<any>;
  private account$ = this.accountFacadeService.account$;
  constructor(
    private accountFacadeService: AccountFacadeService,
    private sanitizer: DomSanitizer,
    private profileSettingsFacade: ProfileSettingsFacadeService
  ) {}

  ngOnInit(): void {
    this.getUserPic();
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
    this.profileSettingsFacade.profilePic$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((profile: any) => {
        (URL || webkitURL).revokeObjectURL(profile); // clean-up memory
      });
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
    // event.target.src =  this.user?.userPicture
  }

  getUserPic() {
  //   this.account$
  //     .pipe(
  //       mergeMap((response: any) => {
  //         if (response !== null && response !== undefined) {
  //           this.picUserUpdated = response.photoUpdated;
  //           this.user = new User(response);
  //           return this.profileSettingsFacade.profilePic$;
  //         } else {
  //           return of(null);
  //         }
  //       })
  //     )
  //     .pipe(
  //       filter((res) => res !== null),

  //       takeUntil(this.isDestroyed)
  //     )
  //     .subscribe((profile: any) => {
  //       if (
  //         (this.user.idSn === 0 ||
  //           (this.picUserUpdated && this.user.idSn !== 0)) &&
  //         !!profile
  //       ) {
  //         let objectURL = (URL || webkitURL).createObjectURL(profile);
  //         this.user.userPicture =
  //           this.sanitizer.bypassSecurityTrustUrl(objectURL);
  //       } else if (this.user.picLink && !this.picUserUpdated) {
  //         this.user.userPicture = this.user?.picLink;
  //       }
  //     });
  // }



  this.account$
  .pipe(
    filter((res) => res !== null)
  )
  .subscribe((response: any) => {
    if (response !== null && response !== undefined) {
                this.picUserUpdated = response.photoUpdated;
                this.user = new User(response);


                this.profileSettingsFacade.profilePic$.subscribe((profile: any) => {
                  if (
                            (this.user.idSn === 0 ||
                              (this.picUserUpdated && this.user.idSn !== 0)) &&
                            !!profile
                          ) {
                            let objectURL = (URL || webkitURL).createObjectURL(profile);
                            this.user.userPicture =
                              this.sanitizer.bypassSecurityTrustUrl(objectURL);
                          } else if (this.user.picLink && !this.picUserUpdated) {
                            this.user.userPicture = this.user?.picLink;
                          }
                        });  
                      }
  });
}











}
