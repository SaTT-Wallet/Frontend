import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  Renderer2,
  PLATFORM_ID
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { forkJoin, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  pattMedia,
  pattLinks,
  sattUrl,
  GazConsumedByCampaign
} from '@config/atn.config';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-participer',
  templateUrl: './participer.component.html',
  styleUrls: ['./participer.component.css']
})
export class ParticiperComponent implements OnInit {
  msg2: string = '';
  values: Array<any> = [];
  value: any = {};
  campaigndata: any;
  sendform: FormGroup;
  application: any;
  errorResponse: any = '';
  applyPassword: boolean = false;
  loadingButton!: boolean;
  showButtonSend: boolean = true;
  balanceNotEnough: boolean = false;
  wrongpass: boolean = false;
  campaignId: any;
  errorMessage = '';
  errorfbin: boolean = false;
  isLinkConfirmationChecked = false;
  oracleLinkMessage = '';
  connectValue = '';
  url = '';
  message: any;
  error = '';
  success = '';
  networkWallet: any;
  successMessage = false;
  requiredChannel = false;
  transactionHash = '';
  spinner = false;
  errorDescription: any;
  linked = false;
  bnb: any;
  eth: any;
  gazsend: any;
  eRC20Gaz: any;
  bEPGaz: any;
  oracleType!: string;
  isDestroyedSubject = new Subject();
  idvideo: any;
  imagevideo: any;
  titlevideo: any;
  idstatus: any;
  userfaceook: any;
  idfaceook: any;
  idinstagram: any;
  idlinkedin: any;
  sharedid: any;
  accountDeactivatedError = false;
  // @ViewChild('draggable') private draggableElement: ElementRef | undefined;
  // @ViewChild('draggableinsta') private draggableinstaElement:
  // | ElementRef
  // | undefined;
  linkNetorwkMutch: boolean = true;
  validUrl: boolean = true;
  twitter: any;
  window!: (Window & typeof globalThis) | null;
  @ViewChild('myIframe') myIframe?: ElementRef;
  @ViewChild('facebookDiv') facebookDiv?: ElementRef;
  @ViewChild('TwitterDiv') twitterDiv?: ElementRef;
  @ViewChild('instagramDiv') instagramDiv?: ElementRef;
  @ViewChild('instaDiv') instaDiv?: ElementRef;
  @ViewChild('linkedinDiv') linkedinDiv?: ElementRef;
  @ViewChild('linkDiv') linkDiv?: ElementRef;
  @ViewChild('tweetId') tweetId?: ElementRef;
  ratioLink: boolean = false;
  isGoogleUrl: boolean = false;
  constructor(
    private router: Router,
    public CampaignService: CampaignHttpApiService,
    private campaignStore: CampaignsStoreService,
    private ActivatedRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private Fetchservice: CryptofetchServiceService,
    private walletFacade: WalletFacadeService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    if (isPlatformBrowser(this.platformId))
      this.window = this.document.defaultView;
    this.sendform = new FormGroup({
      url: new FormControl('', [
        Validators.required,
        Validators.pattern(pattMedia)
      ]),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.sendform
      .get('url')
      ?.valueChanges.pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((value: any) => {
        if (value !== '') {
          this.linkNetorwkMutch = true;
          this.linked = false;
          this.validUrl = true;
        }
        this.spinner = true;
        this.errorResponse = '';

        setTimeout(() => {
          this.spinner = false;
          this.sendLink();
        }, 1000);
      });
    this.parentFunction();
    this.showLinkedMessage();
    this.ActivatedRoute.params
      .pipe(
        mergeMap((params) => {
          this.campaignId = params['campaign_id'];
          return this.CampaignService.getAllInfo(this.campaignId);
        }),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((data: any) => {
        this.campaigndata = data;
        this.networkWallet = data.token.type;
        let performance = this.campaigndata.ratios[0]?.oracle;

        if (performance?.length > 1 && performance === 'twitter') {
          this.ratioLink = true;
        }
      });
  }

  matchLinkType(): ValidatorFn {
    return (
      control: AbstractControl
    ): { [key: string]: boolean } | null | any => {
      const link = control.value;
      //   const typeLink:string =control.value.typeLink as string
      // @ts-ignore
      if (link.includes('Facebook')) {
        return { linkMisMutch: true };
      }
      return null;
    };
  }
  openYoutubeurl() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://www.youtube.com/watch?v=tAZHZwrZh0o', '_blank');
  }
  connect(social: any) {
    var linkFacebook: string =
      sattUrl +
      '/link/fb_insta/' +
      this.tokenStorageService.getIdUser() +
      '/' +
      this.campaignId;
    var linkGoogle: string =
      sattUrl +
      '/link/google/' +
      this.tokenStorageService.getIdUser() +
      '/' +
      this.campaignId;
    var linkTwitter: string =
      sattUrl +
      '/link/twitter/' +
      this.tokenStorageService.getIdUser() +
      '/' +
      this.campaignId;
    var linkLinkedin: string =
      sattUrl +
      `/linkedin/link/${this.tokenStorageService.getIdUser()}?redirect=/part/${
        this.campaignId
      }`;
    if (isPlatformBrowser(this.platformId)) {
      if (social === 'facebook') {
        window.location.href = linkFacebook;
      } else if (social === 'google') {
        window.location.href = linkGoogle;
      } else if (social === 'twitter') {
        window.location.href = linkTwitter;
      } else {
        window.location.href = linkLinkedin;
      }
    }
  }
  redirect(link: any) {
    this.sendform.reset();
    this.userfaceook = '';
    this.idinstagram = '';
    this.validUrl = false;
    if (link === 'send_link') {
      // this.linked = false;
      this.sendform.get('url')?.setValue('', { onlySelf: true });
      this.sendform.get('url')?.clearValidators();
      this.sendform.get('password')?.setValue('', { onlySelf: true });
      // this.sendform.get('password')?.clearValidators();
      //this.sendform.controls['url'].updateValueAndValidity();
      this.linkNetorwkMutch = false;
      this.success = '';
      this.error = '';
      this.router.navigate([]);
    } else if (link === 'FAQ') {
      this.router.navigate(['home/FAQ']);
    } else {
      this.router.navigate(['home/campaign/' + this.campaignId]);
    }
  }

  sendLink(): void {
    let performance = this.campaigndata?.ratios.length
      ? this.campaigndata?.ratios
      : this.campaigndata?.bounties;
    this.tokenStorageService.saveUrlCampaign(this.sendform.get('url')?.value);
    this.showButtonSend = false;
    let myApplication: any = {};

    const media = this.sendform.get('url')?.value || '';
    if (
      media?.indexOf('https://www.facebook.com/') !== -1 &&
      media?.indexOf('posts') !== -1
    ) {
      this.validUrl = true;
      let parts = media?.split('/');
      if (parts[3] !== '' && parts[5] !== '') {
        myApplication.idUser = parts[3].replace(pattLinks, '');
        this.userfaceook = myApplication.idUser;
        myApplication.idPost = parts[5].split('?')[0].replace(pattLinks, '');
        this.idfaceook = myApplication.idPost;
        myApplication.typeSN = 1;
        this.application = myApplication;
        this.idinstagram = '';
        this.idstatus = '';
        this.idvideo = '';
        this.idlinkedin = '';
        this.renderer.setAttribute(
          this.myIframe?.nativeElement,
          'src',
          'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F' +
            this.userfaceook +
            '%2Fposts%2F' +
            this.idfaceook +
            '&show_text=true&appId=214777317448706'
        );

        if (!!this.idfaceook && isPlatformBrowser(this.platformId)) {
          this.renderer.removeChild(
            this.myIframe?.nativeElement,
            this.myIframe?.nativeElement
          );
          setTimeout(() => {
            var embed = this.renderer.createElement('embed');
            this.renderer.setAttribute(
              embed,
              'src',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F' +
                this.userfaceook +
                '%2Fposts%2F' +
                this.idfaceook +
                '&show_text=true&appId=214777317448706'
            );

            embed.setAttribute('id', this.myIframe?.nativeElement);

            embed.setAttribute(
              'style',
              'position:absolute;top: 8%;left: 144px;width: 69%;height:  201% '
            );
            this.renderer.appendChild(this.facebookDiv?.nativeElement, embed);
          }, 1000);
        }
        if (this.application) {
          this.tokenStorageService.setIdPost(myApplication.idPost);
          this.tokenStorageService.setIdUserPost(myApplication.idUser);
          this.tokenStorageService.setTypeSN(myApplication.typeSN);
        } else {
          myApplication.idPost = this.tokenStorageService.getIdPost();
          myApplication.idUser = this.tokenStorageService.getIdUserPost();
          myApplication.typeSN = this.tokenStorageService.getTypeSN();

          this.application = myApplication;
        }

        if (performance.find((ratio: any) => ratio.oracle === 'facebook')) {
          this.CampaignService.verifyLink(this.application)
            .pipe(takeUntil(this.isDestroyedSubject))
            .subscribe(
              () => {},
              (err) => {
                this.spinner = false;
                if (err.error.text === '{result:true}') {
                  this.linked = true;
                  this.loadingButton = false;
                } else if (err.error.text === '{result:false}') {
                  this.error = 'Not_your_link';
                  this.oracleType = 'facebook';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else if (err.error.text === '{message:"Link already sent"}') {
                  this.error = 'Lien_déjà_envoyé';
                  this.success = '';
                  this.loadingButton = false;
                } else if (err.error.text === '{error:"account not linked"}') {
                  this.connectValue = 'facebook';
                  this.errorResponse = 'facebook';
                  this.error = '';
                  this.success = '';
                  this.loadingButton = false;
                } else if (err.error.text === '{error:"lien_invalid"}') {
                  this.connectValue = 'facebook';
                  this.errorResponse = 'facebook';
                  this.error = 'Not_your_link';
                  this.success = '';
                  this.loadingButton = false;
                  this.oracleType = 'facebook';
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else {
                  this.error = 'Default';
                  this.errorDescription = 'Default paragraphe';
                  this.success = '';
                  this.loadingButton = false;
                }
              }
            );
        } else {
          this.spinner = false;
          this.error = 'oracle_not_exist';
          this.success = '';
          this.loadingButton = false;
        }
      }
    } else if (media.indexOf('https://twitter.com/') !== -1) {
      this.validUrl = true;
      this.twitter = true;
      let parts = media.split('/');

      if (parts[3] && parts[3] !== '' && parts[5] && parts[5] !== '') {
        parts[5] = parts[5].split('?')[0];
        myApplication.idUser = parts[3].replace(pattLinks, '');
        myApplication.idPost = parts[5].replace(pattLinks, '');
        this.idstatus = myApplication.idPost;

        myApplication.typeSN = 4;

        this.application = myApplication;
        this.userfaceook = '';
        this.idinstagram = '';
        this.idvideo = '';
        setTimeout(() => {
          // var element = this.document.getElementById('twitter-widget-0');
          // element.outerHTML = element.outerHTML.replace('iframe', 'embed');
        }, 3000);
        if (!!this.idstatus && isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            var firstelement = this.document.getElementById('twitter-widget-0');

            if (!!firstelement) {
              firstelement.outerHTML = firstelement.outerHTML.replace(
                'iframe',
                'embed'
              );
            }

            var element = this.document.getElementById('twitter-widget-1');

            if (!!element) {
              element.outerHTML = element.outerHTML.replace('iframe', 'embed');
            }

            var newelement = this.document.getElementById('twitter-widget-2');
            if (!!newelement) {
              newelement.outerHTML = newelement.outerHTML.replace(
                'iframe',
                'embed'
              );
            }
            var newsecondelement =
              this.document.getElementById('twitter-widget-3');
            if (!!newsecondelement) {
              newsecondelement.outerHTML = newsecondelement.outerHTML.replace(
                'iframe',
                'embed'
              );
            }
          }, 3000);
        }
        if (this.application) {
          this.tokenStorageService.setIdPost(myApplication.idPost);
          this.tokenStorageService.setIdUserPost(myApplication.idUser);
          this.tokenStorageService.setTypeSN(myApplication.typeSN);
        } else {
          myApplication.idPost = this.tokenStorageService.getIdPost();
          myApplication.idUser = this.tokenStorageService.getIdUserPost();
          myApplication.typeSN = this.tokenStorageService.getTypeSN();

          this.application = myApplication;
        }

        if (performance.find((ratio: any) => ratio.oracle === 'twitter')) {
          this.CampaignService.verifyLink(this.application)
            .pipe(takeUntil(this.isDestroyedSubject))
            .subscribe(
              () => {},
              (err) => {
                if (err.error.text === '{result:true}') {
                  this.linked = true;
                  this.loadingButton = false;
                } else if (err.error.text === '{result:false}') {
                  this.error = 'Not_your_link';
                  this.oracleType = 'twitter';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else if (err.error.text === '{error:"lien_invalid"}') {
                  this.error = 'Not_your_link';
                  this.oracleType = 'twitter';
                  this.success = '';
                  this.loadingButton = false;
                  this.oracleType = 'twitter';
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else {
                  this.connectValue = 'twitter';
                  this.errorResponse = 'twitter';
                  this.error = '';
                  this.success = '';
                  this.loadingButton = false;
                }
              }
            );
        } else {
          this.spinner = false;
          this.error = 'oracle_not_exist';
          this.success = '';
          this.loadingButton = false;
        }
      }
    } else if (media.indexOf('https://www.instagram.com/') !== -1) {
      this.validUrl = true;
      let parts = media.split('/');
      if (parts[3] !== '' && parts[4] !== '') {
        myApplication.idPost = parts[4];
        myApplication.idUser = parts[3].replace(pattLinks, '');
        myApplication.typeSN = 3;
        this.idinstagram = myApplication.idPost;
        this.application = myApplication;

        this.userfaceook = '';
        this.idstatus = '';
        this.idvideo = '';
        this.idlinkedin = '';

        this.renderer.setAttribute(
          this.instagramDiv?.nativeElement,
          'src',
          'https://www.instagram.com/p/' +
            this.idinstagram +
            '/embed/captioned/?cr=1&v=14&wp=540&rd=http%3A%2F%2Flocalhost%3A4200&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A15257.489999999962%2C%22ls%22%3A1741.52000000322%2C%22le%22%3A1848.8950000028126%7D'
        );
        if (!!this.idinstagram) {
          const myEl = this.instaDiv?.nativeElement;

          this.renderer.removeChild(myEl, myEl.lastChild);

          setTimeout(() => {
            var embed = this.renderer.createElement('embed');
            embed.setAttribute(
              'src',
              'https://www.instagram.com/p/' +
                this.idinstagram +
                '/embed/captioned/?cr=1&v=14&wp=540&rd=http%3A%2F%2Flocalhost%3A4200&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A15257.489999999962%2C%22ls%22%3A1741.52000000322%2C%22le%22%3A1848.8950000028126%7D'
            );
            embed.setAttribute('id', 'instagram-embed-0');
            embed.setAttribute('height', '541px');

            this.renderer.appendChild(this.instaDiv?.nativeElement, embed);
          }, 1000);
        }

        if (this.application) {
          this.tokenStorageService.setIdPost(myApplication.idPost);
          this.tokenStorageService.setIdUserPost(myApplication.idUser);
          this.tokenStorageService.setTypeSN(myApplication.typeSN);
        } else {
          myApplication.idPost = this.tokenStorageService.getIdPost();
          myApplication.idUser = this.tokenStorageService.getIdUserPost();
          myApplication.typeSN = this.tokenStorageService.getTypeSN();

          this.application = myApplication;
        }
        if (performance.find((ratio: any) => ratio.oracle === 'instagram')) {
          this.CampaignService.verifyLink(this.application)
            .pipe(takeUntil(this.isDestroyedSubject))
            .subscribe(
              () => {},
              (err) => {
                this.spinner = false;
                if (err.error.text === '{result:true}') {
                  this.linked = true;
                  this.loadingButton = false;
                } else if (err.error.text === '{result:false}') {
                  this.error = 'Not_your_link';
                  this.oracleType = 'instagram';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else if (err.error.text === '{message:"Link already sent"}') {
                  this.error = 'Lien_déjà_envoyé';
                  this.success = '';
                  this.loadingButton = false;
                } else if (err.error.text === '{error:"account not linked"}') {
                  this.connectValue = 'facebook';
                  this.errorResponse = 'facebook';
                  this.error = '';
                  this.success = '';
                  this.loadingButton = false;
                } else if (err.error.text === '{error:"lien_invalid"}') {
                  this.connectValue = 'facebook';
                  this.errorResponse = 'facebook';
                  this.error = 'Not_your_link';
                  this.success = '';
                  this.loadingButton = false;
                  this.oracleType = 'instagram';
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else {
                  this.error = 'Default';
                  this.errorDescription = 'Default paragraphe';
                  this.success = '';
                  this.loadingButton = false;
                }
              }
            );
        } else {
          this.spinner = false;
          this.error = 'oracle_not_exist';
          this.success = '';
          this.loadingButton = false;
        }
      }
    } else if (media.indexOf('https://www.linkedin.com/') !== -1) {
      //let parts = media.replace(/\D/g, '');
      this.validUrl = true;
      let url = media.split('activity');
      let parts = url[url.length - 1];
      if (parts.includes('-') || parts.includes(':')) {
        parts = parts.includes('-') ? parts.split('-')[1] : parts.split(':')[1];

        myApplication.idUser = 666;
        myApplication.idPost = parts;
        myApplication.typeSN = 5;
        this.idlinkedin = parts;
        this.application = myApplication;
        this.CampaignService.linkedinSharedid(this.idlinkedin)
          .pipe(takeUntil(this.isDestroyedSubject))
          .subscribe((linkedin: any) => {
            this.sharedid = linkedin.shareId;
            this.renderer.setAttribute(
              this.linkedinDiv?.nativeElement,
              'src',
              'https://www.linkedin.com/embed/feed/update/' + this.sharedid
            );
          });
        if (!!this.idlinkedin) {
          this.renderer.removeChild(
            this.linkedinDiv?.nativeElement,
            this.linkedinDiv?.nativeElement
          );
          setTimeout(() => {
            var embed = this.renderer.createElement('embed');
            this.CampaignService.linkedinSharedid(this.idlinkedin)
              .pipe(takeUntil(this.isDestroyedSubject))
              .subscribe(() => {
                embed.setAttribute(
                  'src',
                  'https://www.linkedin.com/embed/feed/update/' + this.sharedid
                );

                embed.setAttribute('id', 'linkedin-embed-0');
                embed.setAttribute('width', '504');
                embed.setAttribute('height', '240');
                embed.setAttribute('title', 'Post intégré');

                this.renderer.appendChild(
                  this.linkedinDiv?.nativeElement,
                  embed
                );
              });
          }, 1000);
        }
        this.userfaceook = '';
        this.idstatus = '';
        this.idvideo = '';
        this.idinstagram = '';

        if (this.application) {
          this.tokenStorageService.setIdPost(myApplication.idPost);
          this.tokenStorageService.setIdUserPost(myApplication.idUser);
          this.tokenStorageService.setTypeSN(myApplication.typeSN);
        } else {
          myApplication.idPost = this.tokenStorageService.getIdPost();
          myApplication.idUser = this.tokenStorageService.getIdUserPost();
          myApplication.typeSN = this.tokenStorageService.getTypeSN();
          this.application = myApplication;
        }

        if (performance.find((ratio: any) => ratio.oracle === 'linkedin')) {
          this.CampaignService.verifyLink(this.application)
            .pipe(takeUntil(this.isDestroyedSubject))
            .subscribe(
              () => {},
              (err) => {
                if (err.error.text === '{result:true}') {
                  this.linked = true;
                  this.loadingButton = false;
                } else if (err.error.text === '{result:false}') {
                  this.error = 'Not_your_link';
                  this.oracleType = 'linkedin';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else if (err.error.text === '{error:"lien_invalid"}') {
                  this.error = 'Not_your_link';
                  this.oracleType = 'linkedin';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else {
                  this.connectValue = 'linkedin';
                  this.error = '';
                  this.success = '';
                  this.loadingButton = false;
                }
              }
            );
        } else {
          this.spinner = false;
          this.error = 'oracle_not_exist';
          this.success = '';
          this.loadingButton = false;
          // }
        }
      }
    } else if (
      media.indexOf('youtube.com/watch') !== -1 ||
      media.indexOf('https://youtu.be/') !== -1 ||
      media.indexOf('https://www.youtube.com/embed/') !== -1
    ) {
      if (media.indexOf('youtube.com/watch') !== -1) {
        this.validUrl = true;
        var parts = media.split('=');
        var videos = parts[1].split('&');
        let videoId = videos[0];
        myApplication.idPost = videoId;
        this.idvideo = videoId;
        myApplication.idUser = '0';
        myApplication.typeSN = 2;
      }
      if (media.indexOf('https://youtu.be/') !== -1) {
        var parts = media.split('/');
        let videoId = parts[3];
        myApplication.idPost = videoId;
        myApplication.idUser = '0';
        myApplication.typeSN = 2;
      }
      if (media.indexOf('https://www.youtube.com/embed/') !== -1) {
        var parts = media.split('/');
        let videoId = parts[4];
        myApplication.idPost = videoId;
        myApplication.idUser = '0';
        myApplication.typeSN = 2;

        this.userfaceook = '';
        this.idinstagram = '';
        this.idstatus = '';
        this.idlinkedin = '';
      }
      this.application = myApplication;

      if (this.application) {
        this.tokenStorageService.setIdPost(myApplication.idPost);
        this.tokenStorageService.setIdUserPost(myApplication.idUser);
        this.tokenStorageService.setTypeSN(myApplication.typeSN);
      } else {
        myApplication.idPost = this.tokenStorageService.getIdPost();
        myApplication.idUser = this.tokenStorageService.getIdUserPost();
        myApplication.typeSN = this.tokenStorageService.getTypeSN();

        this.application = myApplication;
      }
      if (performance.find((ratio: any) => ratio.oracle === 'youtube')) {
        //TODO: send correct json
        this.CampaignService.verifyLink(this.application)
          .pipe(takeUntil(this.isDestroyedSubject))
          .subscribe(
            () => {},
            (err) => {
              this.spinner = false;

              if (err.error.text === '{result:true}') {
                this.linked = true;
                this.getdatavideo();
                this.loadingButton = false;
                this.spinner = false;
              } else if (err.error.text === '{result:false}') {
                this.error = 'Not_your_link';
                this.oracleType = 'youtube';
                this.success = '';
                this.loadingButton = false;
                this.router.navigate([], {
                  queryParams: {
                    errorMessage: 'error'
                  }
                });
              } else if (err.error.text === '{error:"account not linked"}') {
                this.connectValue = 'google';
                this.errorResponse = 'google';
                this.error = '';
                this.success = '';
                this.loadingButton = false;
              } else if (err.error.text === '{error:"account desactivated"}') {
                this.error = 'account_deactivated_error';
              } else if (err.error.text === '{error:"lien_invalid"}') {
                this.connectValue = 'google';
                this.errorResponse = 'google';
                this.error = '';
                this.success = '';
                this.loadingButton = false;
                this.oracleType = 'youtube';
              } else {
                this.error = 'Default';
                this.errorDescription = 'Default paragraphe';
                this.success = '';
                this.loadingButton = false;
              }
            }
          );
      } else {
        this.spinner = false;
        this.error = 'oracle_not_exist';
        this.success = '';
        this.loadingButton = false;
      }
    } else {
      this.validUrl = false;
    }
  }

  // videoDescription$: Observable<any> = this.promData$.pipe(
  //   takeUntil(this.isDestroyedSubject),
  //   switchMap((prom) =>
  //     this.CampaignService.videoDescription(prom.postId).pipe(
  //       catchError((error) => {
  //         console.log(error);
  //         return of({});
  //       })
  //     )
  //   )
  // );

  getdatavideo() {
    this.CampaignService.videoDescription(this.idvideo)
      .pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((datavideo: any) => {
        this.imagevideo = datavideo.thumbnail_url;
        this.titlevideo = datavideo.title;
      });
  }
  // getdatatweeter() {
  //   this.CampaignService.twitterDescription(this.idstatus).subscribe(
  //     (datavideo: any) => {
  //       //     console.log("dede",datavideo);
  //       //     var iframe = document.getElementById('twitter-widget-0');
  //       //     var embed = document.createElement("embed");
  //       //  //@ts-ignore
  //       //     iframe.outerHTML = iframe.outerHTML.replace(/iframe/g,"embed");
  //       //     var index;
  //       //     while (iframe?.firstChild) {
  //       //       embed.appendChild(iframe.firstChild); // *Moves* the child
  //       //   }
  //       //   for (index = iframe?.attributes.length - 1; index >= 0; --index) {
  //       //     embed.attributes.setNamedItem(iframe.attributes[index].cloneNode());
  //       // }
  //       // //@ts-ignore
  //       // iframe.parentNode.replaceChild(embed, iframe);
  //     }
  //   );
  // }
  //applySync() {
  //this.sendlink(this.applyCampaign.bind(this));
  //}

  applyCampaign(): void {
    let application = this.application;
    if (!application) {
      application = {};
      application.idPost = this.tokenStorageService.getIdPost();
      application.idUser = this.tokenStorageService.getIdUserPost();
      application.typeSN = this.tokenStorageService.getTypeSN();

      this.tokenStorageService.removeItem('idPost');
      this.tokenStorageService.removeItem('userIdPost');
      this.tokenStorageService.removeItem('typeSN');
    }

    let campaign = this.campaignId;
    let password = this.sendform.get('password')?.value;
    this.loadingButton = true;
    this.showButtonSend = false;

    this.applyPassword = true;

    this.CampaignService.applyLink(
      campaign,
      application,
      this.campaigndata.title,
      password,
      this.campaigndata.hash
    )
      .pipe(takeUntil(this.isDestroyedSubject))
      .subscribe(
        (data: any) => {
          this.linkNetorwkMutch = true;
          this.linked = false;
          this.sendform.get('url')?.setValue('', { onlySelf: true });
          this.sendform.get('url')?.clearValidators();
          this.sendform.get('password')?.setValue('', { onlySelf: true });
          // this.sendform.get('password')?.clearValidators();
          this.loadingButton = false;
          this.showButtonSend = true;
          if (data.message === 'Link already sent') {
            this.error = 'link_already_exist';
            this.success = '';
            this.loadingButton = false;
            this.router.navigate([], {
              queryParams: {
                errorMessage: 'error'
              }
            });
          } else {
            if (data['error']) {
              this.balanceNotEnough = false;
              if (
                data['error'] ===
                'Returned error: insufficient funds for gas * price + value'
              ) {
                // this.error = "out_of_gas_error";
                this.router.navigate([], {
                  queryParams: {
                    errorMessage: 'error'
                  }
                });

                if (this.networkWallet === 'bep20') {
                  this.error = 'out_of_gas_bnb';
                  this.success = '';
                } else {
                  this.error = 'out_of_gas_eth';
                  this.success = '';
                }
              } else if (data['error'] === 'Wrong password') {
                this.error = 'wrong_password';
                this.success = '';
                this.loadingButton = false;
              } else {
                this.error = 'Default';
                this.errorDescription = 'Default paragraphe';
                this.success = '';
                this.loadingButton = false;
              }
            } else {
              this.notifyLink(data.idProm);
              this.error = '';
              this.success = data.transactionHash;
              this.loadingButton = false;
              if (data['transactionHash']) {
                this.transactionHash = data['transactionHash'];
              }
              this.router.navigate([], {
                queryParams: {
                  successMessage: 'linkSubmitted'
                }
              });
            }
          }
        },
        () => {
          this.loadingButton = false;
          this.showButtonSend = true;
        }
      );
  }

  parentFunction() {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        map((response: any) => response.data),
        mergeMap((data: any) => {
          this.bnb = data['BNB'].price;
          this.eth = data['ETH'].price;
          let arrayOfObs = [];
          arrayOfObs.push(this.walletFacade.etherGaz$);
          arrayOfObs.push(this.walletFacade.bnbGaz$);
          return forkJoin(arrayOfObs);
        }),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((resArray) => {
        let priceEther;
        const gazEther = resArray[0];
        priceEther = gazEther.data.gasPrice;
        this.gazsend = (
          ((priceEther * GazConsumedByCampaign) / 1000000000) *
          this.eth
        ).toFixed(2);
        this.eRC20Gaz = this.gazsend;
        ////
        const gazBnb = resArray[1];
        let priceBnb = gazBnb.data.gasPrice;
        this.bEPGaz = (
          ((priceBnb * GazConsumedByCampaign) / 1000000000) *
          this.bnb
        ).toFixed(2);
      });
  }

  notifyLink(idProm: string): void {
    if (this.sendform.valid) {
      let link = this.sendform.get('url')?.value;
      let campaign = this.campaigndata._id;
      this.CampaignService.notifyLink(campaign, link, idProm)
        .pipe(
          catchError(() => {
            return of(null);
          }),
          takeUntil(this.isDestroyedSubject)
        )
        .subscribe();
    }
  }

  toggleCheckbox() {
    this.isLinkConfirmationChecked = !this.isLinkConfirmationChecked;
  }
  goBack(campaignId: any) {
    this.router.navigate(['home/campaign', campaignId]);
  }
  showLinkedMessage() {
    this.linked = false;
    // this.url=this.router.url;
    //   this.message=this.url.split("=");
    this.ActivatedRoute.queryParams
      .pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((p) => {
        this.message = p.message;
      });

    if (this.message === 'account_linked_with_success') {
      this.sendform
        .get('url')
        ?.setValue(this.tokenStorageService.getUrlCampaign());
      this.successMessage = true;
      this.linked = true;

      setTimeout(() => {
        this.successMessage = false;
        this.router.navigate(['/home/part/' + this.campaignId]);
      }, 3000);
    }
    if (
      this.message === 'account_linked_with_success_instagram_facebook' &&
      this.tokenStorageService.getUrlCampaign()?.indexOf('instagram') !== -1
    ) {
      this.successMessage = true;
      this.sendform
        .get('url')
        ?.setValue(this.tokenStorageService.getUrlCampaign());
      this.linked = true;
      if (!!this.application) {
        let myApplication = this.application;

        this.tokenStorageService.setIdPost(myApplication.idPost);
        this.tokenStorageService.setIdUserPost(myApplication.idUser);
        this.tokenStorageService.setTypeSN(myApplication.typeSN);
      } else {
        let myApplication: any = {};

        myApplication.idPost = this.tokenStorageService.getIdPost();
        myApplication.idUser = this.tokenStorageService.getIdUserPost();
        myApplication.typeSN = this.tokenStorageService.getTypeSN();

        this.application = myApplication;
      }

      this.CampaignService.verifyLink(this.application)
        .pipe(takeUntil(this.isDestroyedSubject))
        .subscribe(
          () => {},
          (err) => {
            this.spinner = false;

            if (err.error.text === '{result:true}') {
              //  this.linked = true;
              this.loadingButton = false;
            } else if (err.error.text === '{result:false}') {
              this.error = 'Compte non vérifié';
              this.success = '';
              this.loadingButton = false;
            } else if (err.error.text === '{message:"Link already sent"}') {
              this.error = 'Lien_déjà_envoyé';
              this.success = '';
              this.loadingButton = false;
            } else if (err.error.text === '{error:"account not linked"}') {
              this.connectValue = 'facebook';
              this.errorResponse = 'facebook';
              this.error = '';
              this.success = '';
              this.loadingButton = false;
            } else {
              this.error = 'Default';
              this.errorDescription = 'Default paragraphe';
              this.success = '';
              this.loadingButton = false;
            }
          }
        );

      setTimeout(() => {
        this.successMessage = false;
        this.router.navigate(['/home/part/' + this.campaignId]);
      }, 3000);
    } else if (
      this.message === 'account_linked_with_success_instagram_facebook' &&
      this.tokenStorageService.getUrlCampaign()?.indexOf('facebook') !== -1
    ) {
      this.successMessage = true;
      this.sendform
        .get('url')
        ?.setValue(this.tokenStorageService.getUrlCampaign());
      this.linked = true;

      // setTimeout(() => {
      //   this.successMessage = false;
      //   this.router.navigate(['/home/part/' + this.campaignId]);
      // }, 3000);
    } else if (
      (this.message === 'account_linked_with_success_instagram_facebook' &&
        this.tokenStorageService.getUrlCampaign()?.indexOf('facebook') !==
          -1) ||
      (this.message === 'account_linked_with_success_facebook' &&
        this.tokenStorageService.getUrlCampaign()?.indexOf('instagram') !== -1)
    ) {
      this.sendform
        .get('url')
        ?.setValue(this.tokenStorageService.getUrlCampaign());
      this.errorResponse = 'facebook';
      this.errorfbin = true;
      this.linked = false;
    }

    if (this.message === 'channel_obligatoire') {
      //isGoogleUrl used to set error channel required or page required
      if (
        this.tokenStorageService.getUrlCampaign()?.indexOf('youtube') !== -1
      ) {
        this.isGoogleUrl = true;
      } else {
        this.isGoogleUrl = false;
      }
      this.requiredChannel = true;
      setTimeout(() => {
        this.requiredChannel = false;
        this.router.navigate(['/home/part/' + this.campaignId]);
      }, 3000);
    }
  }
  //  goToDoc(){ window.open("https://satt-token.com/files/POCYouTubeChallenge-min.pdf", "_blank");
  goToDoc() {
    if (isPlatformBrowser(this.platformId))
      window.open(
        'https://satt-token.com/blog/2021/09/23/satt-documentation',
        '_blank'
      );
  }
  ngOnDestroy(): void {
    this.isDestroyedSubject.next('');
    this.isDestroyedSubject.unsubscribe();
  }
}
