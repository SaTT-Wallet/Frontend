import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { sattUrl } from '@app/config/atn.config';

import { ProfileService } from '@core/services/profile/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { of, Subject } from 'rxjs';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { isPlatformBrowser } from '@angular/common';

export interface IGetSocialNetworksResponse {
  facebook: { [key: string]: string | boolean }[];
  google: { [key: string]: string | boolean }[];
  linkedin: { [key: string]: string | boolean }[];
  twitter: { [key: string]: string | boolean }[];
}
@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss']
})
export class SocialNetworksComponent implements OnInit {
  nameAccount = '';
  networkLogo = './assets/Images/youtube-add.png';
  networkLogoFacebook = './assets/Images/fb_image.svg';
  networkLogoTwitter = './assets/Images/twitter.svg';
  networkLogoInstagram = './assets/Images/img_satt/Instagram.png';
  networkLogoLinkedin = './assets/Images/linkedin-icon.svg';
  accounts: any;
  accountsTwitter: any;
  channelId: string = '';
  twitterId: string = '';
  organization: string = '';
  channelTitle: string = '';
  id: string = '';
  channelName: string = '';
  errorMessage = '';
  successMessage = '';
  routerSub: any;
  channelGoogle: any;
  channelTwitter: any;
  channelFacebook: any;
  channelInstagram: any;
  channelLinkedin: any;
  allChannels: any;
  showGoogleList: boolean = false;
  showTwitterList: boolean = false;
  showFacebookList: boolean = false;
  showLinkedinList: boolean = false;
  deactivateGoogle: boolean = false;
  deactivateLinkedin: boolean = false;
  deactivateTwitter: boolean = false;
  deactivateFacebook: boolean = false;
  networkName: string = '';
  percentSocial: any;
  private isDestroyed = new Subject();
  userId = this.tokenStorageService.getIdUser();
  showSpinner: boolean = true;
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;
  constructor(
    private profile: ProfileService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}
  ngOnInit(): void {
    this.getSocialNetwork();
  }
  openModalDeleteOne(
    content: any,
    title: string,
    id: string,
    network: string,
    chname: string
  ) {
    this.modalService.open(content);
    this.channelTitle = title;
    this.channelId = id;
    this.networkName = network;
    this.channelName = chname;
  }
  openModalDeleteAll(content: any, network: string) {
    this.modalService.open(content);
    this.networkName = network;
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
    this.networkName = '';
  }

  getSocialNetwork(): void {
    this.showSpinner = true;
    this.socialAccount$
      .pipe(
        catchError((error: any) => {
          if (error.error.error === 'Not found' && error.error.code === 404) {
            this.channelLinkedin = [];
          }
          return of(null);
        }),
        filter((res) => res !== null),
        mergeMap((data) => {
          return this.route.queryParams.pipe(
            map((params) => {
              return { params, data };
            })
          );
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe(({ params, data }: { params: Params; data: any }) => {
        if (data !== null) {
          let count = 0;
          this.allChannels = data;
          this.channelGoogle = data.google;
          this.channelTwitter = data.twitter;
          this.channelFacebook = data.facebook;
          this.channelLinkedin = data.linkedin;

          this.setUrlMsg(params, data);

          if (this.channelGoogle?.length !== 0) {
            count++;
          } else {
            this.channelGoogle?.forEach((ch: any) => {
              this.deactivateGoogle = !!data.google[ch].deactivate;
            });
          }

          if (this.channelTwitter?.length !== 0) {
            count++;
          } else {
            this.channelTwitter?.forEach((ch: any) => {
              this.deactivateTwitter = !!data.twitter[ch].deactivate;
            });
          }

          if (this.channelFacebook?.length !== 0) {
            count++;
          } else {
            this.channelFacebook?.forEach((ch: any) => {
              this.deactivateFacebook = !!data.facebook[ch].deactivate;
            });
          }

          if (this.channelLinkedin?.length !== 0) {
            count++;
          } else {
            this.channelLinkedin?.forEach((ch: any) => {
              this.deactivateLinkedin = !!data.linkedin[ch].deactivate;
            });
          }
          let stat = (count * 100) / 4;
          this.percentSocial = stat.toFixed(0);
          this.showSpinner = false;
        }
      });
  }
  //get errors from url
  setUrlMsg(p: Params, data: IGetSocialNetworksResponse): void {
    if (p.message) {
      if (p.message === 'access-denied') {
        this.errorMessage = 'access-cancel';
        setTimeout(() => {
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 6000);
      } else if (p.message === 'channel obligatoire') {
        this.errorMessage = 'no_channel_found';
        setTimeout(() => {
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 6000);
      } else if (
        p.message === 'account_linked_with_success' ||
        p.message === 'account_linked_with_success_instagram_facebook' ||
        p.message === 'required_page'
      ) {
        if (p.sn === 'fb' && data.facebook.length === 0) {
          this.errorMessage = 'no_page_selected';
        } else {
          this.successMessage = 'account_linked_with_success';
        }
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 6000);
      } else if (p.message === 'account exist') {
        this.errorMessage = 'account_linked_other_account';
        setTimeout(() => {
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 6000);
      } else if (p.message === 'external_account') {
        this.errorMessage = 'Your facebook page ';
        setTimeout(() => {
          this.errorMessage = 'account_linked_other_account';
          this.router.navigate(['/home/settings/social-networks']);
        }, 6000);
      } else if (p.message === 'page already exists') {
        this.errorMessage = 'page already exists';
        setTimeout(() => {
          // this.ngOnInit();
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 6000);
      }
    }
  }

  onReditectSocial(social: string) {
    let url = this.router.url.split('?')[0];
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        `/addChannel/${social}/${this.userId}` +
        '?redirect=' +
        url +
        '&social-network=' +
        social;
  }
  onReditectLinkedin() {
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        '/profile/addChannel/linkedin/' +
        this.userId +
        '?redirect=' +
        this.router.url;
  }

  goToAccount(network: string, userName: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (network === 'twitter') {
        window.open('https://www.twitter.com/' + userName, '_blank');
        // window.location.href ="https://www.twitter.com/"+userName;
      } else if (network === 'google') {
        window.open('https://www.youtube.com/channel/' + userName, '_blank');
        //   window.location.href ="https://www.youtube.com/channel/"+userName;
      } else if (network === 'facebook') {
        window.open('https://www.facebook.com/' + userName, '_blank');
      } else if (network === 'instagram') {
        window.open('https://www.instagram.com/' + userName, '_blank');
      } else if (network === 'linkedin') {
        window.open('https://www.linkedin.com/company/' + userName, '_blank');
      }
    }
  }
  toggelGoogleBlock() {
    this.showGoogleList = !this.showGoogleList;
  }
  toggelTwitterBlock() {
    this.showTwitterList = !this.showTwitterList;
  }
  toggelFacebookBlock() {
    this.showFacebookList = !this.showFacebookList;
  }
  toggelLinkedinBlock() {
    this.showLinkedinList = !this.showLinkedinList;
  }

  deleteAccount(id: string, network: string) {
    if (network === 'google') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksGoogle(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'twitter') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksTwitter(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.getSocialNetwork();
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.closeModal(id);
          }
        });
    } else if (network === 'facebook') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksFb(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'linkedin') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksLinkedin(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    }
  }
  deleteList(modalName: any, network: string) {
    if (network === 'google') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksGoogle()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.getSocialNetwork();
            this.closeModal(modalName);
          }
        });
    } else if (network === 'facebook') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksFb()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.getSocialNetwork();
            this.closeModal(modalName);
          }
        });
    } else if (network === 'twitter') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksTwitter()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.getSocialNetwork();
            this.closeModal(modalName);
          }
        });
    } else if (network === 'linkedin') {
      this.socialAccountFacadeService
        .deleteAllSocialNetworksLinkedin()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            this.getSocialNetwork();
            this.closeModal(modalName);
          }
        });
    }
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
  }

  socialStateGoogle(i: any) {
    this.socialAccountFacadeService
      .getSocialNetworks()
      .pipe(
        mergeMap((data: any) => {
          this.deactivateGoogle = !this.deactivateGoogle;
          this.channelGoogle = this.channelGoogle.map(
            (chanel: any, index: number) => {
              if (index === i) {
                return { ...chanel, deactivate: this.deactivateGoogle };
              }
              return chanel;
            }
          );
          this.channelId = data.google[i].channelId;
          return this.socialAccountFacadeService.socialStateGoogle(
            this.deactivateGoogle,
            this.channelId
          );
        }),
        takeUntil(this.isDestroyed)
      )

      .subscribe(() => {
        this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
      });
  }

  socialStateFacebook(i: any) {
    this.socialAccountFacadeService
      .getSocialNetworks()
      .pipe(
        mergeMap((data: any) => {
          this.deactivateFacebook = !this.deactivateFacebook;
          this.channelFacebook = this.channelFacebook.map(
            (chanel: any, index: number) => {
              if (index === i) {
                return { ...chanel, deactivate: this.deactivateFacebook };
              }
              return chanel;
            }
          );
          this.id = data.facebook[i].id;
          return this.socialAccountFacadeService.socialStateFacebook(
            this.deactivateFacebook,
            this.id
          );
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe(() => {
        this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
      });
  }

  socialStateLinkedin(i: any) {
    this.socialAccountFacadeService
      .getSocialNetworks()
      .pipe(
        mergeMap((data: any) => {
          console.log(data);
          this.deactivateLinkedin = !data.linkedin[i].deactivate;
          this.channelLinkedin = this.channelLinkedin.map(
            (chanel: any, index: number) => {
              if (index === i) {
                return { ...chanel, deactivate: this.deactivateLinkedin };
              }
              return chanel;
            }
          );
          this.organization = data.linkedin[i].organization;
          return this.socialAccountFacadeService.socialStateLinkedin(
            this.deactivateLinkedin,
            this.organization
          );
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe(() => {
        this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
      });
  }

  socialStateTwitter(i: any) {
    this.socialAccountFacadeService
      .getSocialNetworks()
      .pipe(
        mergeMap((data: any) => {
          this.deactivateTwitter = !this.deactivateTwitter;
          this.channelTwitter = this.channelTwitter.map(
            (chanel: any, index: number) => {
              if (index === i) {
                return { ...chanel, deactivate: this.deactivateTwitter };
              }
              return chanel;
            }
          );
          this.twitterId = data.twitter[i].twitter_id;
          return this.socialAccountFacadeService.socialStateTwitter(
            this.deactivateTwitter,
            this.twitterId
          );
        }),
        takeUntil(this.isDestroyed)
      )

      .subscribe(() => {
        this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
      });
  }

  trackByChannelId(index: any, ch: any) {
    return ch?.id;
  }

  trackByChannelOrganization(index: any, ch: any) {
    return ch?.organization;
  }

  trackBuChannelDisplayName(index: any, ch: any) {
    return ch?.displayName;
  }

  trackByCahnnelName(index: any, ch: any) {
    return ch?.name;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
