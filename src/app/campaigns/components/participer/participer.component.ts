import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  Renderer2,
  PLATFORM_ID,
  ChangeDetectorRef,
  AfterContentChecked,
  Input
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';

import { of, Subject, forkJoin } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  takeUntil,
  take,
  tap,
  switchMap
} from 'rxjs/operators';
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
import { DomSanitizer } from '@angular/platform-browser';
import { environment as env } from '../../../../environments/environment';
import { ProfileService } from '@app/core/services/profile/profile.service';
import { environment } from '@environments/environment.prod';

@Component({
  selector: 'app-participer',
  templateUrl: './participer.component.html',
  styleUrls: ['./participer.component.css']
})
export class ParticiperComponent implements OnInit, AfterContentChecked {
  msg2: string = '';
  values: Array<any> = [];
  value: any = {};
  campaigndata: any;
  sendform: UntypedFormGroup;
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
  idThreads: any;
  idlinkedin: any;
  urlTronsformed: any;
  idtiktok: any;
  shortUrl: boolean = false;
  sharedid: any;
  network: string = '';
  networkProtocol: any;
  networkGas: any;
  accountDeactivatedError = false;
  tiktokProfilePrivacy = '';
  TiktokPrivate: boolean = false;
  tokenName: string = '';
  urlFromInput: any;

  urlTiktok: string = env.urlSocialMedia.urlTiktok;
  // @ViewChild('draggable') private draggableElement: ElementRef | undefined;
  // @ViewChild('draggableinsta') private draggableinstaElement:
  // | ElementRef
  // | undefined;
  linkNetorwkMutch: boolean = true;
  validUrl: boolean = true;
  gazcurrency: string = '';
  twitter: any;
  window!: (Window & typeof globalThis) | null;
  @ViewChild('myIframe') myIframe?: ElementRef;
  @ViewChild('facebookDiv') facebookDiv?: ElementRef;
  @ViewChild('TwitterDiv') twitterDiv?: ElementRef;
  @ViewChild('instagramDiv') instagramDiv?: ElementRef;
  @ViewChild('threadsDiv') threadsDiv?: ElementRef;
  @ViewChild('instaDiv') instaDiv?: ElementRef;
  @ViewChild('linkedinDiv') linkedinDiv?: ElementRef;
  @ViewChild('linkDiv') linkDiv?: ElementRef;
  @ViewChild('tweetId') tweetId?: ElementRef;
  ratioLink: boolean = false;
  isGoogleUrl: boolean = false;
  gazproblem: boolean = false;
  embedTiktokVideo: any;
  privacy: string = 'public';
  errorMessageLimitParticipation: string = '';
  constructor(
    private profilService: ProfileService,
    private router: Router,
    private showNumbersRule: ShowNumbersRule,

    public CampaignService: CampaignHttpApiService,
    private campaignStore: CampaignsStoreService,
    private ActivatedRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private Fetchservice: CryptofetchServiceService,
    private walletFacade: WalletFacadeService,
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    if (isPlatformBrowser(this.platformId))
      this.window = this.document.defaultView;
    this.sendform = new UntypedFormGroup({
      url: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(pattMedia)
      ]),
      password: new UntypedFormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.ActivatedRoute.params
      .pipe(
        mergeMap((params) => {
          this.campaignId = params['campaign_id'];
          return this.CampaignService.getOneById(this.campaignId, 'projection');
        }),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((data: any) => {
        this.campaigndata = data.data;
        this.networkWallet = data.data.token.type;
        this.tokenName = data.data.token.name;
        let performance = this.campaigndata.ratios[0]?.oracle;
        if (performance?.length > 1 && performance === 'twitter') {
          this.ratioLink = true;
        }
        this.parentFunction(this.networkWallet).subscribe();
      });

    this.profilService.getTiktokProfilPrivcay().subscribe((res: any) => {
      this.tiktokProfilePrivacy = res.data;
      this.CheckPrivacy();
    });
    this.sendform
      .get('url')
      ?.valueChanges.pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((value: any) => {
        this.urlTronsformed = value;
        
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

    this.showLinkedMessage();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
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
  goToBuy() {
    if (this.error === 'out_of_gas_btt') {
      window.open(
        'https://sunswap.com/#/v2?lang=en-US&t0=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&t1=TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4&type=swap',
        '_blank'
      );
      return;
    }

    if (this.networkWallet === 'BEP20') {
      this.tokenName = 'BNB';
    } else if (this.networkWallet === 'ERC20') {
      this.tokenName = 'ETH';
    } else if (this.networkWallet === 'TRON') {
      this.tokenName = 'TRX';
    } else if (this.networkWallet === 'MATIC') {
      this.tokenName = 'MATIC';
      this.networkWallet = 'POLYGON';
    } else if (this.networkWallet === 'BTTC') {
      this.tokenName = '';
    }

    this.router.navigate(['/wallet/buy-token'], {
      queryParams: {
        id: this.tokenName,
        network: this.networkWallet
      },
      relativeTo: this.ActivatedRoute
    });
  }
  // shortUrlChanger(normalUrl: string) {
  //   const testTiktok = normalUrl?.search('vm.tiktok.com');
  //   const testYoutube = normalUrl?.search('youtu.be');

  //   if (testTiktok > -1 || testYoutube > -1) {
  //     this.CampaignService.expandUrl(normalUrl).subscribe((res: any) => {
  //       this.urlFromInput = res.data;
  //     });
  //   }
  // }

    shortUrlChanger(normalUrl: string) {
    const shortUrlTiktok = normalUrl?.search(env.TIKTOK_SHORTEN_LINK);
  


    if (shortUrlTiktok > -1 ) {


      this.CampaignService.expandUrl(normalUrl).subscribe((res: any) => {
       
        
        this.urlFromInput = res.data;
      });
    }
  }
  connect(social: any) {
    if(social === 'threads') {
      this.router.navigate(['/settings/social-networks']);
    } else {
      var linkFacebook: string =
      sattUrl +
      '/profile/addChannel/facebook/' +
      this.tokenStorageService.getIdUser() +
      '?redirect=' +
      this.router.url;

    var linkGoogle: string =
      sattUrl +
      '/profile/addChannel/youtube/' +
      this.tokenStorageService.getIdUser() +
      '?redirect=' +
      this.router.url;

    var linkTwitter: string =
      sattUrl +
      '/profile/addChannel/twitter/' +
      this.tokenStorageService.getIdUser() +
      '?redirect=' +
      this.router.url;

    var linkLinkedin: string =
      sattUrl +
      '/profile/addChannel/linkedin/' +
      this.tokenStorageService.getIdUser() +
      '?redirect=' +
      this.router.url;

    var linkTiktok: string =
      sattUrl +
      '/profile/addChannel/tiktok/' +
      this.tokenStorageService.getIdUser() +
      '?redirect=' +
      this.router.url;

    if (isPlatformBrowser(this.platformId)) {
      if (social === 'facebook') {
        window.location.href = linkFacebook;
      } else if (social === 'google') {
        window.location.href = linkGoogle;
      } else if (social === 'twitter') {
        window.location.href = linkTwitter;
      } else if (social === 'linkedin') {
        window.location.href = linkLinkedin;
      } else {
        window.location.href = linkTiktok;
      }
    }
    }
  
  }
  redirect(link: any) {
    this.sendform.reset();
    this.userfaceook = '';
    this.idinstagram = '';
    this.idThreads = '';
    this.idvideo = '';
    this.idtiktok = '';
    this.idlinkedin = '';
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
    } else if (link === 'adPools') {
      this.router.navigate(['/ad-pools']);
    } else {
      this.router.navigate(['home/campaign/' + this.campaignId]);
    }
  }

  sendLink(): void {
    this.connectValue = '';
    let performance = this.campaigndata?.ratios?.length
      ? this.campaigndata?.ratios
      : this.campaigndata?.bounties;

    this.tokenStorageService.saveUrlCampaign(this.sendform.get('url')?.value);
    this.showButtonSend = false;
    let myApplication: any = {};

    let media = this.sendform.get('url')?.value || '';

    if (
      (media?.indexOf(env.FACEBOOK_URL) !== -1 &&
        (media?.indexOf('posts') !== -1 ||
          media?.indexOf('photos') !== -1 ||
          media?.indexOf('videos') !== -1)) ||
      media?.indexOf(env.M_FACEBOOK_URL) !== -1 ||
      media.search('vm.tiktok.com') !== -1
    ) {
      this.validUrl = true;
      let parts = media?.split('/');
      if (parts[3] !== '' && parts[5] !== '') {
        if (media.indexOf(env.M_FACEBOOK_URL) !== -1) {
          let mfacebooklink = media?.replaceAll('&', '=');
          let parts1 = mfacebooklink?.split('=');
          let test = this.CampaignService.getFbUserName(parts1[3]).subscribe(
            (data: any) => {
          
              myApplication.idUser = data.data;
              myApplication.idPost = parts1[1];

              this.userfaceook = myApplication.idUser;
              this.idfaceook = myApplication.idPost;
              myApplication.typeSN = 1;
              this.application = myApplication;

              this.tokenStorageService.setIdPost(myApplication.idPost);
              this.tokenStorageService.setIdUserPost(myApplication.idUser);
              this.tokenStorageService.setTypeSN(myApplication.typeSN);
              this.renderer.setAttribute(
                this.myIframe?.nativeElement,
                'src',
                env.FACEBOOK_POST_URL +
                  this.userfaceook +
                  '%2Fposts%2F' +
                  this.idfaceook +
                  '&show_text=true&appId=214777317448706'
              );
            },
            (err) => {
              this.error = 'Not_your_link';
              this.oracleType = 'facebook';
              this.success = '';
              this.loadingButton = false;
              this.router.navigate([], {
                queryParams: {
                  errorMessage: 'error'
                }
              });
            }
          );
      
        } else {
          myApplication.idUser = parts[3].replace(pattLinks, '');
          this.userfaceook = myApplication.idUser;
          myApplication.idPost = parts[5].split('?')[0].replace(pattLinks, '');
          this.idfaceook = myApplication.idPost;
          myApplication.typeSN = 1;
          this.application = myApplication;
          this.renderer.setAttribute(
            this.myIframe?.nativeElement,
            'src',
            env.FACEBOOK_POST_URL +
              this.userfaceook +
              '%2Fposts%2F' +
              this.idfaceook +
              '&show_text=true&appId=214777317448706'
          );
        }

        this.idinstagram = '';
        this.idThreads = '';
        this.idstatus = '';
        this.idvideo = '';
        this.idlinkedin = '';

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
              env.FACEBOOK_POST_URL +
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
            .pipe(
              takeUntil(this.isDestroyedSubject)
              // catchError(() => {
              //   // return of(null);
              // })
            )
            .subscribe(
              (data: any) => {
                if (
                  data.message === 'success' &&
                  data.code === 200 &&
                  data.data === 'true'
                ) {
                  this.linked = true;
                  this.loadingButton = false;
                } else if (
                  data.data === 'false' &&
                  data.code === 200 &&
                  data.message === 'success'
                ) {
                  this.error = 'Not_your_link';
                  this.oracleType = 'facebook';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                }
              },
              (err) => {
                this.spinner = false;

                // if (err.error.text === '{result:false}') {
                //   this.error = 'Not_your_link';
                //   this.oracleType = 'facebook';
                //   this.success = '';
                //   this.loadingButton = false;
                //   this.router.navigate([], {
                //     queryParams: {
                //       errorMessage: 'error'
                //     }
                //   });
                // } else
                //  if (err.error.text === '{message:"Link already sent"}') {
                //   this.error = 'Lien_déjà_envoyé';
                //   this.success = '';
                //   this.loadingButton = false;
                // }
                if (
                  err.error.error === 'account not linked' &&
                  err.error.code === 406
                ) {
                  this.connectValue = 'facebook';
                  this.errorResponse = 'facebook';
                  this.error = '';
                  this.success = '';
                  this.loadingButton = false;
                } else if (
                  err.error.error === 'invalid link' &&
                  err.error.code === 406
                ) {
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
                }
                // else {
                //   this.error = 'Default';
                //   this.errorDescription = 'Default paragraphe';
                //   this.success = '';
                //   this.loadingButton = false;
                // }
              }
            );
        } else {
          this.spinner = false;
          this.error = 'oracle_not_exist';
          this.success = '';
          this.loadingButton = false;
        }
      }
    } else if (
      media.indexOf('https://twitter.com/') !== -1 ||
      media.indexOf('https://x.com/') !== -1
    ) {
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
        this.idThreads = '';
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
              (data: any) => {
                if (
                  data.message === 'success' &&
                  data.code === 200 &&
                  data.data === 'true'
                ) {
                  this.linked = true;
                  this.loadingButton = false;
                } else if (
                  data.data === 'false' &&
                  data.code === 200 &&
                  data.message === 'success'
                ) {
                  this.error = 'Not_your_link';
                  this.oracleType = 'twitter';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                }
              },
              (err) => {
                // if (err.error.text === '{result:true}') {
                //   this.linked = true;
                //   this.loadingButton = false;
                // } else
                // if (err.error.text === '{result:false}') {
                //   this.error = 'Not_your_link';
                //   this.oracleType = 'twitter';
                //   this.success = '';
                //   this.loadingButton = false;
                //   this.router.navigate([], {
                //     queryParams: {
                //       errorMessage: 'error'
                //     }
                //   });
                // } else
                if (
                  err.error.error === 'account not linked' &&
                  err.error.code === 406
                ) {
                  this.connectValue = 'twitter';
                  this.errorResponse = 'twitter';
                  this.error = '';
                  this.success = '';
                  this.loadingButton = false;
                } else if (
                  err.error.error === 'invalid link' &&
                  err.error.code === 406
                ) {
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
        this.idThreads = '';
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

            this.renderer?.appendChild(this.instaDiv?.nativeElement, embed);
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
              (data: any) => {
                if (
                  data.message === 'success' &&
                  data.code === 200 &&
                  data.data !== 'false'
                ) {
                  this.linked = true;
                  this.loadingButton = false;
                } else if (
                  data.data === 'false' &&
                  data.code === 200 &&
                  data.message === 'success'
                ) {
                  this.error = 'Not_your_link';
                  this.oracleType = 'instagram';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                }
              },
              (err) => {
                this.spinner = false;
                // if (err.error.text === '{result:true}') {
                //   this.linked = true;
                //   this.loadingButton = false;
                // }
                // else
                // if (err.error.text === '{result:false}') {
                //   this.error = 'Not_your_link';
                //   this.oracleType = 'instagram';
                //   this.success = '';
                //   this.loadingButton = false;
                //   this.router.navigate([], {
                //     queryParams: {
                //       errorMessage: 'error'
                //     }
                //   });
                // }
                // else
                if (
                  err.error.error === 'account not linked' &&
                  err.error.code === 406
                ) {
                  this.connectValue = 'facebook';
                  this.errorResponse = 'facebook';
                  this.error = '';
                  this.success = '';
                  this.loadingButton = false;
                } else if (
                  err.error.error === 'invalid link' &&
                  err.error.code === 406
                ) {
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
                }
                // if (err.error.text === '{message:"Link already sent"}') {
                //   this.error = 'Lien_déjà_envoyé';
                //   this.success = '';
                //   this.loadingButton = false;
                // } else if (err.error.text === '{error:"account not linked"}') {
                //   this.connectValue = 'facebook';
                //   this.errorResponse = 'facebook';
                //   this.error = '';
                //   this.success = '';
                //   this.loadingButton = false;
                // } else if (err.error.text === '{error:"lien_invalid"}') {
                //   this.connectValue = 'facebook';
                //   this.errorResponse = 'facebook';
                //   this.error = 'Not_your_link';
                //   this.success = '';
                //   this.loadingButton = false;
                //   this.oracleType = 'instagram';
                //   this.router.navigate([], {
                //     queryParams: {
                //       errorMessage: 'error'
                //     }
                //   });
                // }
                else {
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
      this.validUrl = true;
      let url = media.split('activity');
      
      let parts = url[url.length - 1];
      if (parts.includes('-') || parts.includes(':')) {
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
        
       
        
        
        myApplication.idUser = 666;
        myApplication.linkedinUserId = url[1].split(':')[1];
        myApplication.typeSN = 5;
        this.idlinkedin = url[1].split(':')[1];
        
        this.CampaignService.linkedinSharedid(this.idlinkedin)
          .pipe(takeUntil(this.isDestroyedSubject))
          .subscribe((linkedin: any) => {
            this.sharedid = linkedin.data;
            myApplication.idPost = linkedin.data.split(':').at(-1);
            this.tokenStorageService.setIdPost(myApplication.idPost);
            this.renderer.setAttribute(
              this.linkedinDiv?.nativeElement,
              'src',
              'https://www.linkedin.com/embed/feed/update/' + this.sharedid
            );
          });

          this.application = myApplication;
        this.userfaceook = '';
        this.idstatus = '';
        this.idvideo = '';
        this.idinstagram = '';
        this.idThreads = '';

        if (this.application) {
          this.tokenStorageService.setIdUserPost(myApplication.idUser);
          this.tokenStorageService.setTypeSN(myApplication.typeSN);
          this.tokenStorageService.setLinkedinUserId(parts)
        } else {
          myApplication.idPost = this.tokenStorageService.getIdPost();
          myApplication.idUser = this.tokenStorageService.getIdUserPost();
          myApplication.typeSN = this.tokenStorageService.getTypeSN();
          myApplication.linkedinUserId = this.tokenStorageService.getLinkedinUserId();;
          this.application = myApplication;
        }
        if (performance.find((ratio: any) => ratio.oracle === 'linkedin')) {
          let copyApplication = {...this.application}
          copyApplication.linkedinUserId = this.idlinkedin
          this.CampaignService.verifyLink(copyApplication)
            .pipe(takeUntil(this.isDestroyedSubject))
            .subscribe(
              (data: any) => {
                if (data.message === 'success' && data.code === 200) {
                  this.application.linkedinId = data.id;
                  this.linked = true;
                  this.loadingButton = false;
                } else if (data.data === 'false' && data.code === 200) {
                  this.error = 'Not_your_link';
                  this.oracleType = 'linkedin';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                }
              },
              (err) => {
                
                if (
                  err.error.error === 'invalid link' &&
                  err.error.code === 406
                ) {
                  this.error = 'Not_your_link';
                  this.oracleType = 'linkedin';
                  this.success = '';
                  this.loadingButton = false;
                  this.router.navigate([], {
                    queryParams: {
                      errorMessage: 'error'
                    }
                  });
                } else if (
                  err.error.error === 'account not linked' &&
                  err.error.code === 406
                ) {
                  this.connectValue = 'linkedin';
                  this.errorResponse = 'linkedin';
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
        } else {
          this.spinner = false;
          this.error = 'oracle_not_exist';
          this.success = '';
          this.loadingButton = false;
          // }
        }
      }
    } else if (
      media.indexOf(env.YOUTUBE_WATCH_LINK) !== -1 ||
      media.indexOf(env.YOUTUBE_SHORTEN_LINK) !== -1 ||
      media.indexOf(env.YOUTUBE_EMBED_LINK) !== -1
    ) {
      myApplication.idUser = '0';
      myApplication.typeSN = env.typeSN.youtube;
      this.oracleType = env.oracleType.youtube;
      if (media.indexOf(env.YOUTUBE_WATCH_LINK) !== -1) {
        this.validUrl = true;
        var parts = media.split('=');
        var videos = parts[1].split('&');
        let videoId = videos[0];
        myApplication.idPost = videoId;
        this.idvideo = videoId;
       
      }
      if (media.indexOf(env.YOUTUBE_SHORTEN_LINK) !== -1) {
        var parts = media.split('/');
        let videoId = parts[3];
        this.idvideo = videoId;
        myApplication.idPost = videoId;
  
        this.application = myApplication;
        this.tokenStorageService.setIdPost(myApplication.idPost);
        this.tokenStorageService.setIdUserPost(myApplication.idUser);
        this.tokenStorageService.setTypeSN(myApplication.typeSN);
      }
      if (media.indexOf(env.YOUTUBE_EMBED_LINK) !== -1) {
        var parts = media.split('/');
        let videoId = parts[4];
        this.idvideo = videoId;
        myApplication.idPost = videoId;
        this.userfaceook = '';
        this.idinstagram = '';
        this.idThreads = '';
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
            (data: any) => {
              if (
                data.message === 'success' &&
                data.code === 200 &&
                data.data === 'true'
              ) {
                this.linked = true;
                this.getdatavideo();
                this.loadingButton = false;
                this.spinner = false;
              } else if (
                data.data === 'false' &&
                data.code === 200 &&
                data.message === 'success'
              ) {
                this.error = 'Not_your_link';
                this.oracleType = 'youtube';
                this.success = '';
                this.loadingButton = false;
                this.router.navigate([], {
                  queryParams: {
                    errorMessage: 'error'
                  }
                });
              }
            },
            (err) => {
              this.spinner = false;

              // if (err.error.text === '{result:true}') {
              //   this.linked = true;
              //   this.getdatavideo();
              //   this.loadingButton = false;
              //   this.spinner = false;
              // } else if (err.error.text === '{result:false}') {
              //   this.error = 'Not_your_link';
              //   this.oracleType = 'youtube';
              //   this.success = '';
              //   this.loadingButton = false;
              //   this.router.navigate([], {
              //     queryParams: {
              //       errorMessage: 'error'
              //     }
              //   });
              // }
              //  else
              if (
                err.error.error === 'account not linked' &&
                err.error.code === 406
              ) {
                this.connectValue = 'google';
                this.errorResponse = 'google';
                this.error = '';
                this.success = '';
                this.loadingButton = false;
              } else if (
                err.error.error === 'invalid link' &&
                err.error.code === 406
              ) {
                this.connectValue = 'google';
                this.errorResponse = 'google';
                this.error = '';
                this.success = '';
                this.loadingButton = false;
              } else if (
                err.error.error === 'account deactivated' &&
                err.error.code === 405
              ) {
                this.error = 'account_deactivated_error';
              } else {
                this.error = 'Default';
                this.errorDescription = 'Default paragraphe';
                this.success = '';
                this.loadingButton = false;
              }
              // if (err.error.text === '{error:"account not linked"}') {
              //   this.connectValue = 'google';
              //   this.errorResponse = 'google';
              //   this.error = '';
              //   this.success = '';
              //   this.loadingButton = false;
              // } else if (err.error.text === '{error:"account desactivated"}') {
              //   this.error = 'account_deactivated_error';
              // } else if (err.error.text === '{error:"lien_invalid"}') {
              //   this.connectValue = 'google';
              //   this.errorResponse = 'google';
              //   this.error = '';
              //   this.success = '';
              //   this.loadingButton = false;
              //   this.oracleType = 'youtube';
              // } else {
              //   this.error = 'Default';
              //   this.errorDescription = 'Default paragraphe';
              //   this.success = '';
              //   this.loadingButton = false;
              // }
            }
          );
      } else {
        this.spinner = false;
        this.error = 'oracle_not_exist';
        this.success = '';
        this.loadingButton = false;
      }
    } else if (
      media.indexOf(env.TIKTOK_URL) !== -1 ||
      media.search('vm.tiktok.com') !== -1
    ) {
      if(media.indexOf('/embed/') !== -1){
        this.idtiktok = media.split('embed/')[1];


      }else{
        this.idtiktok = media.split('video/')[1].split('?')[0];
      }
      this.embedTiktokVideo = this.sanitizer.bypassSecurityTrustHtml(`
        <iframe
          src="https://www.tiktok.com/embed/v2/${this.idtiktok}"
          width="400"
          height="750"
          frameborder="0"
          allowfullscreen
        >
        </iframe>`);
      myApplication.idPost = this.idtiktok;
      myApplication.idUser = this.tokenStorageService.getUserId();
      myApplication.typeSN = 6;

      this.userfaceook = '';
      this.idinstagram = '';
      this.idThreads = '';
      this.idstatus = '';
      this.idlinkedin = '';

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

      if (performance.find((ratio: any) => ratio.oracle === 'tiktok')) {
        //TODO: send correct json
        this.CampaignService.verifyLink(this.application)
          .pipe(takeUntil(this.isDestroyedSubject))
          .subscribe(
            (data: any) => {
              if (
                data.message === 'success' &&
                data.code === 200 &&
                data.data === 'true'
              ) {
                this.linked = true;
                this.getdatavideo();
                this.loadingButton = false;
                this.spinner = false;
              } else if (
                data.data === 'false' &&
                data.code === 200 &&
                data.message === 'success'
              ) {
                this.error = 'Not_your_link';
                this.oracleType = 'tiktok';
                this.success = '';
                this.loadingButton = false;
                this.router.navigate([], {
                  queryParams: {
                    errorMessage: 'error'
                  }
                });
              }
            },
            (err) => {
              this.spinner = false;

              if (
                err.error.error === 'account not linked' &&
                err.error.code === 406
              ) {
                this.connectValue = 'tiktok';
                this.errorResponse = 'tiktok';
                this.error = '';
                this.success = '';
                this.loadingButton = false;
              } else if (
                err.error.error === 'invalid link' &&
                err.error.code === 406
              ) {
                this.connectValue = 'tiktok';
                this.errorResponse = 'tiktok';
                this.error = '';
                this.success = '';
                this.loadingButton = false;
              } else if (
                err.error.error === 'account deactivated' &&
                err.error.code === 405
              ) {
                this.error = 'account_deactivated_error';
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
    } else if (media.indexOf('vm.tiktok.com') !== -1) {
      this.idtiktok = 0;
    } else if(media.indexOf('https://www.threads.net/') !== -1 && media.indexOf('post') !== -1) {
      this.idinstagram = '';
      
      if(performance.find((ratio: any) => ratio.oracle === 'threads')) {
      const parts = media.split('/');
      const lastPart = parts[parts.length - 1];
      let linkApp = {
        typeSN: 7,
        idUser: this.tokenStorageService.getUserId(),
        idPost: lastPart
      };
      this.CampaignService.verifyLink(linkApp)
        .subscribe(
          (res:any) => {
            if (
              res.message === 'success' &&
              res.code === 200 &&
              res.data === 'true'
            ) {
              this.idThreads = lastPart;
              this.linked = true;
              this.loadingButton = false;
              this.spinner = false;
              this.tokenStorageService.setIdPost(linkApp.idPost);
              this.tokenStorageService.setTypeSN(linkApp.typeSN);
              this.tokenStorageService.setIdUserPost(linkApp.idUser)
              //application.idPost = this.tokenStorageService.getIdPost();
              //application.idUser = this.tokenStorageService.getIdUserPost();
              //application.typeSN = this.tokenStorageService.getTypeSN();
            } else if (res.data === 'false' && res.code === 200 && res.message === 'success') {
              this.error = 'Not_your_link';
              this.oracleType = 'threads';
              this.success = '';
              this.loadingButton = false;
              this.router.navigate([], {
                queryParams: {
                  errorMessage: 'error'
                }
              });
            }
          },(err) => {
            this.spinner = false;
            if (
              err.error.error === 'account not linked' &&
              err.error.code === 406
            ) {
              this.connectValue = 'threads';
              this.errorResponse = 'threads';
              this.error = '';
              this.success = '';
              this.loadingButton = false;
            } else if(
              err.error.error === 'link not found' &&
              err.error.code === 406
            ) {
              this.error = 'No link found on Threads with this link.';
              this.errorDescription = '';
              this.success = '';
              this.loadingButton = false;
            } else if (
              err.error.error === 'invalid link' &&
              err.error.code === 406
            ) {
              this.connectValue = 'threads';
              this.errorResponse = 'threads';
              this.error = '';
              this.success = '';
              this.loadingButton = false;
            } else if (
              err.error.error === 'account deactivated' &&
              err.error.code === 405
            ) {
              this.error = 'account_deactivated_error';
            } else {
              this.error = 'Default';
              this.errorDescription = 'Default paragraphe';
              this.success = '';
              this.loadingButton = false;
            }
          }
          )
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
  CheckPrivacy() {
    if (this.tiktokProfilePrivacy === 'private') {
      this.privacy = 'private';
      this.TiktokPrivate = true;
    }
  }
  getdatavideo() {

    
    this.CampaignService.videoDescription(this.idvideo, this.oracleType)
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
    this.errorMessageLimitParticipation = '';
    let application = this.application;
    if (!application) {
      application = {};
      application.idPost = this.tokenStorageService.getIdPost();
      application.idUser = this.tokenStorageService.getIdUserPost();
      application.typeSN = this.tokenStorageService.getTypeSN();
      application.typeSN == 5 && (application.linkedinUserId = this.tokenStorageService.getLinkedinUserId());
      this.tokenStorageService.removeItem('idPost');
      this.tokenStorageService.removeItem('userIdPost');
      this.tokenStorageService.removeItem('typeSN');
      this.tokenStorageService.removeItem('shareId');

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
          // if (data['error']) {
          //   this.balanceNotEnough = false;

          // } else {
          this.notifyLink(data?.data?._id);
          if (data?.data?.applyerSignature?.signature) {
            this.transactionHash = data?.data?.applyerSignature?.signature;
            
            this.error = '';
            this.success = data?.data?.applyerSignature?.signature;
            this.loadingButton = false;
          }
          this.router.navigate([], {
            queryParams: {
              successMessage: 'linkSubmitted'
            }
          });
          // }
        },
        (error) => {
          this.loadingButton = false;
          this.showButtonSend = true;
          if(error.error.code === 401 && error.error.error === "Limit participation reached") {
            this.errorMessageLimitParticipation = error.error.error;
          }
          if (
            error.error.code === 402 &&
            error.error.error === 'Returned error: already known'
          ) {
            this.balanceNotEnough = false;
          }

          if (error.error.code === 500) {
            if (
              error.error.error ===
              'Key derivation failed - possibly wrong password'
            ) {
              this.error = 'wrong_password';
              this.success = '';
              this.loadingButton = false;
            } else {
              this.error = 'Default';
              this.errorDescription = 'Default paragraphe';
              this.success = '';
              this.loadingButton = false;
            }
          } else if (error.error.code === 402) {
            if (
              error.error.error === 'Account resource insufficient error.' ||
              error.error.error ===
                'Contract validate error : account does not exist' ||
              error.error.error ===
                'Returned error: replacement transaction underpriced' ||
              error.error.error ===
                'Returned error: insufficient funds for gas * price + value'
            ) {
              this.gazproblem = true;
              this.error = 'out_of_gas_error';
              this.router.navigate([], {
                queryParams: {
                  errorMessage: 'error'
                }
              });
              if (this.networkWallet === 'BEP20') {
                this.error = 'out_of_gas_bnb';
                this.success = '';
              } else if (this.networkWallet === 'ERC20') {
                this.error = 'out_of_gas_eth';
                this.success = '';
              } else if (this.networkWallet === 'BTTC') {
                this.error = 'out_of_gas_btt';
                this.success = '';
              } else if (this.networkWallet === 'TRON') {
                this.error = 'out_of_gas_tron';
                this.success = '';
              } else if (this.networkWallet === 'MATIC') {
                this.error = 'out_of_gas_matic';
                this.success = '';
              } else if (this.networkWallet === 'BTTC') {
                this.error = 'out of gas';
                this.success = '';
              }
            }
          } else if (error.error.code === 401) {
            if (error.error.error === 'Link already sent') {
              this.error = 'link_already_exist';
              this.success = '';
              this.loadingButton = false;
              this.router.navigate([], {
                queryParams: {
                  errorMessage: 'error'
                }
              });
            } else if (error.error.error === 'Wallet v2 not found') {
              this.error = 'wallet not found';
              this.success = '';
              this.loadingButton = false;
            } else if (error.error.code === 'Limit participation reached'){
              this.error = 'Limit_participation_reached';
              this.success = '';
              this.loadingButton = false;
              this.router.navigate([], {
                queryParams: {
                  errorMessage: 'error'
                }
              });
            }
          } else {
            this.error = 'error-message';
          }
        }
      );
  }

  parentFunction(network: any) {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      take(1),
      map((data: any) => {
        let protocolrPrice;
        let networkProtocol;
        if (network === 'BEP20') {
          protocolrPrice = data['BNB'].price;
          networkProtocol = env.Network.BNB;
        } else if (network === 'ERC20') {
          protocolrPrice = data['ETH'].price;
          networkProtocol = env.Network.ETH;
        } else if (network === 'POLYGON') {
          protocolrPrice = data['MATIC'].price;
          networkProtocol = env.Network.MATIC;
        } else if (network === 'BTTC') {
          protocolrPrice = data['BTT'].price;
          networkProtocol = env.Network.BTT;
        } else if (network === 'TRON') {
          protocolrPrice = data['TRX'].price;
          networkProtocol = env.Network.TRX;
        }
        return { protocolrPrice, networkProtocol };
      }),

      switchMap(({ protocolrPrice, networkProtocol }) => {
        return this.walletFacade.getGas(network).pipe(
          take(1),
          tap((res: any) => {
            let price;
            price = res.data.gasPrice;
            this.networkProtocol = networkProtocol;

            this.gazsend =
              ((price * GazConsumedByCampaign) / 1000000000) * protocolrPrice;
            this.networkGas = this.showNumbersRule.transform(
              this.gazsend + '',
              true
            );
          })
        );
      })
    );
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
            }
            else if (err.error.text === '{error:"Limit participation reached"}') {
              this.error = 'Limit_participation_reached';
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
