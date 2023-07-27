import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { sattUrl } from '@app/config/atn.config';

import { ProfileService } from '@core/services/profile/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { of, Subject } from 'rxjs';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomToastComponent } from '../custom-toast/custom-toast.component';

export interface IGetSocialNetworksResponse {
  facebook: { [key: string]: string | boolean }[];
  google: { [key: string]: string | boolean }[];
  linkedin: { [key: string]: string | boolean }[];
  twitter: { [key: string]: string | boolean }[];
  tiktok: { [key: string]: string | boolean }[];
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
  networkLogoThreads = './assets/Images/img_satt/Threads.png';
  networkLogoLinkedin = './assets/Images/linkedin-icon.svg';
  networkLogoTiktok = './assets/Images/tiktok.svg';
  networkLogoFacebookInsta='./assets/Images/Fb_insta.svg';
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
  channelTiktok: any;
  channelThreads: any;
  allChannels: any;
  showGoogleList: boolean = false;
  showTwitterList: boolean = false;
  showFacebookList: boolean = false;
  showLinkedinList: boolean = false;
  showTiktokList: boolean = false;
  deactivateGoogle: boolean = false;
  deactivateLinkedin: boolean = false;
  deactivateTwitter: boolean = false;
  deactivateFacebook: boolean = false;
  deactivateTiktok: boolean = false;
  networkName: string = '';
  percentSocial: any;
  isLoading: any = false;
  threadIdToDelete: any = '';
  private isDestroyed = new Subject();
  userId = this.tokenStorageService.getIdUser();
  showSpinner: boolean = true;
  checkThreadsExist: boolean = false;
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;
  constructor(
    private profile: ProfileService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: string
  ) { }
  ngOnInit(): void {
    this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
    // this.socialAccountFacadeService.checkThreads().subscribe((res:any) => {
    //   if(res.message === true) this.checkThreadsExist = true
    //   else this.checkThreadsExist = false;
    // });
    this.getSocialNetwork();

    // this.profilService.getTiktokProfilPrivcay().subscribe((res:any)=>
    // {

    //   this.tiktokProfilePrivacy = res.data;
    //  this.CheckPrivacy();

    // }
    // )
  }

  showToast(message: string): void {
    this.snackBar.openFromComponent(CustomToastComponent, {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'end', // Position of the toast (e.g., 'start', 'center', 'end')
      verticalPosition: 'top',
      panelClass: ['custom-snackbar'],
      data: {icon:'./assets/Images/error-icon.png', message: message}
    });
  }
  openModalDeleteOne(
    content: any,
    title: string,
    id: string,
    network: string,
    chname: string,
    threadsId? :any
  ) {
    if(!!threadsId)  this.threadIdToDelete = threadsId;
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
  // numberTiktok(){
  //   this.profile.getTicTokNbFollowers(3871).subscribe((data)=>{
  //     console.log({data});

  //     // this.tiktokFollowers=data.data
  //   })
  // }
  getSocialNetwork(): void {
    this.showSpinner = true;
    this.socialAccount$
      .pipe(
        catchError(() => {
          return of(null);
        }),
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

          this.channelTiktok = data.tikTok;
          this.setUrlMsg(params, data);
         this.channelThreads = this.checkTheradsAccountExit(data)
        
         
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

          if (this.channelTiktok?.length !== 0) {
            count++;
          } else {
            this.channelTiktok?.forEach((ch: any) => {
              this.deactivateTiktok = !!data.tiktok[ch].deactivate;
            });
          }
          if (this.channelThreads !== false) {
   
            count++;
          }
          let stat = (count * 100) / 6;
         
          
          this.percentSocial = stat.toFixed(0);
          setTimeout(() => {
            this.showSpinner = false;
          }, 2000);
        } else {
          this.percentSocial = 0;
          this.allChannels = [];
          this.channelGoogle = [];
          this.channelTwitter = [];
          this.channelFacebook = [];
          this.channelLinkedin = [];
          this.channelTiktok = [];
          this.channelThreads= [];
          setTimeout(() => {
            this.showSpinner = false;
          }, 2000);
        }
      });
  }
  checkTheradsAccountExit(data:any)
  {     
   return this.checkThreadsExist = data.facebook.some((elem : any) => elem.threads_id )      
   }  
  
  //get errors from url
 
  setUrlMsg(p: Params, data: IGetSocialNetworksResponse): void {
    
    
    if (p.message) {
      if (p.message === 'access-denied') {
        this.errorMessage = 'access-cancel';
        setTimeout(() => {
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 3000);
      } else if (p.message === 'channel obligatoire') {
        this.errorMessage = 'no_channel_found';
        setTimeout(() => {
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 3000);
      } else if (
        p.message === 'account_linked_with_success' ||
        p.message === 'account_linked_with_success_facebook' ||
        p.message === 'account_linked_with_success_instagram_facebook' ||
        p.message === 'required_page'
      ) {
        if (p.sn === 'fb' && data.facebook.length === 0) {
          this.errorMessage = 'no_page_selected';
        } else {
          this.router.navigate(['/home/settings/social-networks']);
          this.successMessage = 'account_linked_with_success';
        }
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 3000);
      } else if (p.message === 'account exist') {
        this.router.navigate(['/home/settings/social-networks']);
        this.errorMessage = 'account_linked_other_account';
        setTimeout(() => {
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 3000);
      } else if (p.message === 'external_account') {
        this.errorMessage = 'Your facebook page ';
        setTimeout(() => {
          this.errorMessage = 'account_linked_other_account';
          this.router.navigate(['/home/settings/social-networks']);
        }, 3000);
      } else if (p.message === 'page already exists') {
        this.errorMessage = 'page already exists';
        setTimeout(() => {
          // this.ngOnInit();
          this.errorMessage = '';
          this.router.navigate(['/home/settings/social-networks']);
        }, 3000);
      }
    }
  }

  onReditectSocial(social: string) {
    //let url = this.router.url.split('?')[0];
    if (isPlatformBrowser(this.platformId))
      window.location.href =
        sattUrl +
        `/profile/addChannel/${social}/${this.userId}` +
        '?redirect=' +
        this.router.url;
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
      } else if (network === 'tiktok') {
        window.open('https://www.tiktok.com/' + userName.replace(/\s/g, ''));
      } else if(network === 'threads') {
        window.open('https://threads.net/@' + userName, '_blank')
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
  toggelTiktokBlock() {
    this.showTiktokList = !this.showTiktokList;
  }

  deleteAccount(id: string, network: string,linkedinId : string ="") {
    if (network === 'google') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksGoogle(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            // this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'twitter') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksTwitter(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
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
            //this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'linkedin') {
      this.socialAccountFacadeService
        .deleteOneSocialNetworksLinkedin(id,linkedinId)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if (network === 'tiktok') {
      this.socialAccountFacadeService
        .deleteTiktokChannel(id)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(id);
          }
        });
    } else if(network === 'threads') {
      this.socialAccountFacadeService.deleteThreadAccount(this.threadIdToDelete).subscribe((response:any) => {
        if (response.message === 'deleted successfully') {
          this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
      
          //this.getSocialNetwork();
          this.closeModal(id);
        }
      })
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
            this.channelGoogle = [];
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
            this.channelFacebook = [];
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
            this.channelTwitter = [];
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
            this.channelLinkedin = [];
            this.closeModal(modalName);
          }
        });
    } else if (network === 'tiktok') {
      this.socialAccountFacadeService
        .deleteAllTiktokChannels()
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response.message === 'deleted successfully') {
            this.socialAccountFacadeService.dispatchUpdatedSocailAccount();
            //this.getSocialNetwork();
            this.closeModal(modalName);
          }
        });
    }
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
  }
  safeImageUrl(base64Image: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${base64Image}`);
  }
  getUpdatedItem(item:any, res:any) {
    const updatedItem = {
      ...item,
      threads_id: res.data.id,
      threads_picture: res.data.picture
    };
    return updatedItem;
  }
  addThreadsAccount() {
    this.isLoading = true;
    this.socialAccountFacadeService.addThreads().subscribe((res:any) => {
      if(res.message === 'threads_account_added') {
        this.isLoading = false;
    this.checkThreadsExist= true;
        const index = this.channelFacebook.findIndex((obj:any) => obj.instagram_username === res.data.username);
        if(index !== -1) {

          
          let newObj = {
            ...this.channelFacebook[index],
            threads_id: res.data.id,
            threads_picture: res.data.picture,
            threads_followers: res.data.threads_followers
          }
          this.channelFacebook = [
            ...this.channelFacebook.slice(0, index), 
            newObj,
            ...this.channelFacebook.slice(index + 1), 
          ];
          this.channelFacebook[index] = newObj;
        }
      } else if(res.message === 'threads_not_found'){
        this.isLoading = false;
        this.showToast('Sorry we cant find threads account with this name !');
      } else {
        this.isLoading = false;
        this.showToast('Something went wrong, please try again!');
      }
    }, error => {
      this.isLoading = false;
      this.showToast('Something went wrong, please try again!');
    })
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
