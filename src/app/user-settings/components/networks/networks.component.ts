import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';

import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { User } from '@app/models/User';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  arrayNetworks,
  sattUrl,
  regexTwitter,
  regexFacebook,
  regexYoutube,
  regexInstagram,
  regexTiktok,
  regexLinkedin,
  regexNetwork
} from '@config/atn.config';
import { ActivatedRoute, Router } from '@angular/router';
import { environment as env } from '@environments/environment';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css']
})
export class NetworksComponent implements OnInit, OnDestroy {
  @ViewChild('script') script!: ElementRef;
  urlArray: Array<{ value: string; name: string }>;
  formProfileNetworks: UntypedFormGroup;
  formAddNetwork: UntypedFormGroup;
  user!: User;
  isValidLink: boolean = false;
  allLinksExiste!: boolean;
  linkToRemove: boolean = false;
  showSpinner!: boolean;
  fbLink: any;
  instagramLink: any;
  linkedinLink: any;
  youtubeLink: any;
  twitterLink: any;
  tikTokLink: any;
  urlNotMutch!: boolean;
  urlToAdd: any;
  nameUrl: any;
  typeUrl: any;
  urlToDelete: any;
  percentNetwork: any;
  errorMessage = '';
  successMessage = '';
  routerSub: any;
  languageSelected!: any;
  frenchLang: boolean = false;
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  constructor(
    private accountFacadeService: AccountFacadeService,
    public translate: TranslateService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    //list of page type from atn.config
    this.urlArray = arrayNetworks;

    // let pattern = "^(https?:\\/\\/){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.(com))+)(/(.)*)?(\\?(.)*)?"
    this.formProfileNetworks = this.formBuilder.group({
      fbLink: new UntypedFormControl(this.fbLink, Validators.pattern(regexFacebook)),
      linkedinLink: new UntypedFormControl(
        this.linkedinLink,
        Validators.pattern(regexLinkedin)
      ),
      twitterLink: new UntypedFormControl(
        this.twitterLink,
        Validators.pattern(regexTwitter)
      ),
      instagramLink: new UntypedFormControl(
        this.instagramLink,
        Validators.pattern(regexInstagram)
      ),
      youtubeLink: new UntypedFormControl(
        this.youtubeLink,
        Validators.pattern(regexYoutube)
      ),
      tikTokLink: new UntypedFormControl(
        this.tikTokLink,
        Validators.pattern(regexTiktok)
      )
    });
    //formGroup in modal "add a page"
    this.formAddNetwork = this.formBuilder.group({
      type: new UntypedFormControl(null, Validators.required),
      linkInput: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern(regexNetwork)
      ])
    });
  }

  ngOnInit(): void {
    this.getUrlError();
    this.getDetails();
    this.getLang();
    this.convertToScript();
    //put exist link in input link
    this.formAddNetwork
      .get('type')
      ?.valueChanges.pipe(takeUntil(this.onDestoy$))
      .subscribe((value: any) => {
        if (value === 'fbLink') {
          this.formAddNetwork.get('linkInput')?.setValue(this.fbLink);
        }
        if (value === 'instagramLink') {
          this.formAddNetwork.get('linkInput')?.setValue(this.instagramLink);
        }
        if (value === 'linkedinLink') {
          this.formAddNetwork.get('linkInput')?.setValue(this.linkedinLink);
        }
        if (value === 'youtubeLink') {
          this.formAddNetwork.get('linkInput')?.setValue(this.youtubeLink);
        }
        if (value === 'twitterLink') {
          this.formAddNetwork.get('linkInput')?.setValue(this.twitterLink);
        }
        if (value === 'tikTokLink') {
          this.formAddNetwork.get('linkInput')?.setValue(this.tikTokLink);
        }
      });

    //check if type and link are match
    this.formAddNetwork
      .get('linkInput')
      ?.valueChanges.pipe(takeUntil(this.onDestoy$))
      .subscribe((value: any) => {
        if (value !== null) {
          this.urlToAdd = value;
          if (this.typeUrl) {
            this.matchLinkType(value, this.typeUrl);
          }
        }
      });
  }

  ngAfterViewInit() {
    this.convertToScript();
  }

  //get errors from url
  getUrlError() {
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((p) => {
        if (p.message) {
          var element = this.document.getElementById('linkAccounts');
          if (element) element.classList.add('show');
          if (p.message === 'account_linked_with success') {
            this.successMessage = 'account_linked_with_success';
            setTimeout(() => {
              // this.ngOnInit();
              this.successMessage = '';
              this.router.navigate(['home/settings/security']);
            }, 6000);
          } else if (p.message === 'account exist') {
            this.errorMessage = 'account_linked_other_account';
            setTimeout(() => {
              // this.ngOnInit();
              this.errorMessage = '';
              this.router.navigate(['home/settings/security']);
            }, 6000);
          }
        }
      });
  }

  //connect to google and facebook
  snlogin(social: any) {
    if (isPlatformBrowser(this.platformId)) {
      let authFacebook: string =
        sattUrl +
        '/profile/connect/facebook/' +
        this.user.idUser +
        '?redirect=' +
        this.router.url;
      let linkGoogle: string =
        sattUrl +
        '/profile/connect/google/' +
        this.user.idUser +
        '?redirect=' +
        this.router.url;

      if (social === 'facebook') {
        window.location.href = authFacebook;
      } else if (social === 'google') {
        window.location.href = linkGoogle;
      }
    }
  }

  logout(social: any) {
    this.getDetails();
    this.profileSettingsFacade
      .logoutRS(social)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe(() => {
        this.successMessage = 'deconnect_successfully';
        this.accountFacadeService.dispatchUpdatedAccount();
        setTimeout(() => {
          // this.authStoreService.getAccount().subscribe();
          this.errorMessage = '';
          this.successMessage = '';
          this.router.navigate(['home/settings/security']);

        }, 2000);

        // let msg="";
        // this.translate.get('deconnect_successfully').subscribe((message: any) => {
        //     msg = message
        // });
        // this.toastr.success(msg);
        //     this.ngOnInit();
        //     this.errorMessage = ''
        //     this.successMessage = ''
        //    this.router.navigate(['home/settings/security'])
      });
  }

  //get all social networks
  getDetails() {
    let countNetwork = 0;
    this.showSpinner = true;
    this.account$
      .pipe(
        filter((res: User | null) => {
          return res !== null;
        }),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: User | null) => {
        if (response !== null) {
          this.showSpinner = false;
          this.user = response;
          this.fbLink = this.user?.fbLink;
          this.instagramLink = this.user?.instagramLink;
          this.linkedinLink = this.user?.linkedinLink;
          this.youtubeLink = this.user?.youtubeLink;
          this.twitterLink = this.user?.twitterLink;
          this.tikTokLink = this.user?.tikTokLink;

          //verify if all links existe to show button add network
          if (
            this.user.twitterLink &&
            this.user.linkedinLink &&
            this.user.twitterLink &&
            this.user.instagramLink &&
            this.user.youtubeLink &&
            this.user.tikTokLink
          ) {
            this.allLinksExiste = true;
          } else {
            this.allLinksExiste = false;
          }
          //stat networks
          if (this.user.twitterLink && this.user.twitterLink !== '') {
            countNetwork++;
          }
          if (this.user.youtubeLink && this.user.youtubeLink !== '') {
            countNetwork++;
          }
          if (this.user.fbLink && this.user.fbLink !== '') {
            countNetwork++;
          }
          if (this.user.instagramLink && this.user.instagramLink !== '') {
            countNetwork++;
          }
          if (this.user.linkedinLink && this.user.linkedinLink !== '') {
            countNetwork++;
          }
          if (this.user.tikTokLink && this.user.tikTokLink !== '') {
            countNetwork++;
          }
          if (this.user.idOnSn) {
            countNetwork++;
          }
          if (this.user.idOnSn2) {
            countNetwork++;
          }
          if (this.user.idOnSn3) {
            countNetwork++;
          }
          let calcul = (countNetwork * 100) / 9;
          this.percentNetwork = calcul.toFixed(0);
        }
      });
  }

  //open modal
  openModal(content: any) {
    this.nameUrl = '';
    this.typeUrl = '';
    this.formAddNetwork.get('linkInput')?.setValue('');
    this.modalService.open(content);
  }

  //close modal
  closeModal(content: any) {
    this.modalService.dismissAll(content);
    this.nameUrl = '';
    this.typeUrl = '';
    this.urlNotMutch = false;
    this.formAddNetwork.get('linkInput')?.setValue(null);
    this.formAddNetwork.get('type')?.setValue(null);
  }

  //action onselect page type
  selectValue(type: any, name: any) {
    this.nameUrl = name;
    this.typeUrl = type;
    this.formAddNetwork.get('type')?.setValue(type);
    if (this.urlToAdd) {
      this.matchLinkType(this.urlToAdd, this.typeUrl);
    }
  }

  //open modal delete page with the type of page
  deleteLink(typeUrl: string, modal: any) {
    this.openModal(modal);
    this.urlToDelete = typeUrl;
  }

  //confirm delete page in data base
  confirmDeleteLink(modal: any) {
    this.closeModal(modal);
    this.linkToRemove = true;
    this.formProfileNetworks.get(this.urlToDelete)?.reset();
    this.updateNetworks();
  }

  //verify if link and its type match
  matchLinkType(url: any, type: any) {
    switch (type) {
      case 'fbLink':
        if (url.indexOf('facebook') !== -1) {
          this.urlNotMutch = false;
        } else {
          this.urlNotMutch = true;
        }
        break;
      case 'linkedinLink':
        if (url.indexOf('linkedin') !== -1) {
          this.urlNotMutch = false;
        } else {
          this.urlNotMutch = true;
        }
        break;
      case 'twitterLink':
        if (url.indexOf('twitter') !== -1) {
          this.urlNotMutch = false;
        } else {
          this.urlNotMutch = true;
        }
        break;
      case 'instagramLink':
        if (url.indexOf('instagram') !== -1) {
          this.urlNotMutch = false;
        } else {
          this.urlNotMutch = true;
        }
        break;
      case 'youtubeLink':
        if (url.indexOf('youtube') !== -1) {
          this.urlNotMutch = false;
        } else {
          this.urlNotMutch = true;
        }
        break;
      case 'tikTokLink':
        if (url.indexOf('tiktok') !== -1) {
          this.urlNotMutch = false;
        } else {
          this.urlNotMutch = true;
        }
        break;
    }
  }

  //save data in data base
  updateNetworks() {
    const data_profile = {
      fbLink: this.formProfileNetworks.get('fbLink')?.value,
      linkedinLink: this.formProfileNetworks.get('linkedinLink')?.value,
      twitterLink: this.formProfileNetworks.get('twitterLink')?.value,
      instagramLink: this.formProfileNetworks.get('instagramLink')?.value,
      youtubeLink: this.formProfileNetworks.get('youtubeLink')?.value,
      tikTokLink: this.formProfileNetworks.get('tikTokLink')?.value
    };
    if (this.formProfileNetworks.valid || this.linkToRemove) {
      this.showSpinner = true;
      this.getUpdateService(data_profile);
    }
  }

  // service update profile
  getUpdateService(data_profile: any) {
    this.profileSettingsFacade
      .updateProfile(data_profile)
      .pipe(
        mergeMap((response: any) => {
          this.showSpinner = false;
          if (response) {
            return this.translate.get('update_profile');
          } else {
            return of(null);
          }
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: any) => {
        let msg: string = '';
        msg = response;
        this.toastr.success(msg);
        this.ngOnInit();
      });
  }

  //validaten new url , put it in formProfileNetworks and close modal addNetworksModal
  validateUrl(urlvalue: any, modal: any) {
    switch (this.typeUrl) {
      case 'fbLink':
        this.fbLink = urlvalue;
        this.formProfileNetworks.get('fbLink')?.setValue(urlvalue);
        break;
      case 'linkedinLink':
        this.linkedinLink = urlvalue;
        this.formProfileNetworks.get('linkedinLink')?.setValue(urlvalue);
        break;
      case 'twitterLink':
        this.twitterLink = urlvalue;
        this.formProfileNetworks.get('twitterLink')?.setValue(urlvalue);
        break;
      case 'instagramLink':
        this.instagramLink = urlvalue;
        this.formProfileNetworks.get('instagramLink')?.setValue(urlvalue);
        break;
      case 'youtubeLink':
        this.youtubeLink = urlvalue;
        this.formProfileNetworks.get('youtubeLink')?.setValue(urlvalue);
        break;
      case 'tikTokLink':
        this.tikTokLink = urlvalue;
        this.formProfileNetworks.get('tikTokLink')?.setValue(urlvalue);
        break;
    }
    this.closeModal(modal);
  }

  //script connexion to telegram
  convertToScript() {
    
    if (isPlatformBrowser(this.platformId)) {
      const element = this.script?.nativeElement;

      const script = this.document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?14';
      script.setAttribute('data-telegram-login', env.telegramBot);
      script.setAttribute('data-size', 'large');
      //script.setAttribute("data-onauth","onTelegramAuth(user)");
      script.setAttribute(
        'data-auth-url',
        sattUrl +
          '/profile/connect/telegram/' +
          this.tokenStorageService.getIdUser()
      );
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-radius', '15');
      // Callback function in global scope
      const parentElement = element?.parentElement;
      parentElement?.replaceChild(script, element);
    }
  }
  getLang() {
    this.languageSelected = this.tokenStorageService.getLocalLang();
    if (this.languageSelected === 'fr') {
      this.frenchLang = true;
    } else {
      this.frenchLang = false;
    }
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
}
