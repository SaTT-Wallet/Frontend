import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  ChangeDetectorRef,
  HostBinding,
  HostListener,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { SocialUser } from 'angularx-social-login';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactMessageService } from '@core/services/contactmessage/contact-message.service';
import { TelegramLinkAccountService } from '@core/services/telegramAuth/telegram-link-account.service';
import { MatchPasswordValidator } from '@helpers/form-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  catchError,
  filter,
  mergeMap,
  takeUntil,
  map,
  tap
} from 'rxjs/operators';
import { of, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { sattUrl } from '@config/atn.config';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { environment } from '@environments/environment';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { IResponseWallet } from '@app/core/iresponse-wallet';
import { User } from '@app/models/User';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@core/services/notification/notification.service';
import { SocialAccountsFacade } from '@app/social-accounts/facade/social-accounts.facade';
import { ESocialMediaNames } from '@app/core/enums';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import jwt_decode from 'jwt-decode';
import { WalletService } from '@app/core/services/wallet/wallet.service';
// interface credantials {
//   email: string;
//   password: string;
// }
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  public code!: number;
  isClicked!: boolean;
  status = 'start';
  @HostBinding('style.background') backgroundImage =
    'url("/assets/Images/new_back_gradient.svg")';
  @HostBinding('style.background') backgroundColor =
    'linear-gradient(180deg, #001C59 20.34%, #F52079 99.19%)';
  query = '(max-width: 767.98px)';
  mediaQueryList?: MediaQueryList;
  @ViewChild('countdown') counter!: CountdownComponent;
  @ViewChild('countdowncode') countercode!: CountdownComponent;

  // @ViewChild('ErrorModal', { static: false })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  // public ErrorModal!: TemplateRef<any>;
  @ViewChild('lostpwdModal', { static: false })
  public lostpwdModal!: TemplateRef<ElementRef>;
  @ViewChild('script') script!: ElementRef;
  @ViewChild('iframe') myIframe: ElementRef | null = null;
  eventsSubject: Subject<void> = new Subject<void>();

  reset: object = {
    username: null
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  errorMessage_validation: string = '';
  routerSub!: Subscription;
  loginNet: string = '';
  authForm: UntypedFormGroup;
  formL: UntypedFormGroup;
  resetPasswordForm: UntypedFormGroup;
  language: string = 'Fr';
  isSuccessful = false;
  isSubmitting = false;
  errorMessage = '';
  errorMessagecode = '';
  accountInvalideError: string = '';
  errorMessagePwd = '';
  // snLoginLoading: any[''];
  pltfrm: string = '';
  // vars: any;
  // error: any = null;
  isCollapsed: boolean = true;
  emailNotFound: boolean = false;
  languageSelected: string = 'en';
  isNotAuthorized = false;
  showSpinner: boolean = false;
  socialUser: SocialUser | undefined;
  isLoggedin: boolean = false;
  authresetpwd: string = sattUrl + '/resetpssword';
  authFacebook: string = sattUrl + '/auth/signin/facebook';
  authGoogle: string = sattUrl + '/auth/signin/google';
  authTelegram: string = sattUrl + '/auth/signin/telegram';
  cookiesClicked!: boolean;
  validated = '';
  // codeFromUrl: any;
  // idFromUrl: any;
  isSub = false;
  french: boolean = false;
  disabled: boolean = false;
  authError: boolean = false;
  english: boolean = true;
  showBigSpinner: boolean = false;
  cookieValue: string = this.cookie.get('satt_cookies');
  cookieExists: boolean = this.cookie.check('satt_cookies');
  scale: boolean = false;
  boo: boolean = false;
  condition: boolean = false;
  blocktime!: number;
  timeLeftToUnLock!: number;
  blockedForgetPassword: boolean = false;
  formCode: UntypedFormGroup;
  confirmCodeShow: boolean = false;
  codesms: boolean = false;
  loginshow: boolean = true;
  expiresToken!: number;
  isModalClosed: boolean = false;
  show = '';
  idUser!: number;
  forgotpassword: boolean = true;
  recoverpassword: boolean = false;
  loggedrs!: boolean;
  showResendLink: boolean = false;
  timeLeft: number = 60;
  private onDestroy$ = new Subject();
  private account$ = this.accountFacadeService.account$;
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;

  blockDate: any;
  successMessagecode: string = '';
  constructor(
    private walletService: WalletService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public contactmessage: ContactMessageService,
    private telegramLinkAccountService: TelegramLinkAccountService,
    public _changeDetectorRef: ChangeDetectorRef,
    private cookie: CookieService,
    private spinner: NgxSpinnerService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private walletFacade: WalletFacadeService,
    private accountFacadeService: AccountFacadeService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private tokenStorageService: TokenStorageService,
    private notificationService: NotificationService,
    private socialAccountsFacade: SocialAccountsFacade,
    private socialAccountFacadeService: SocialAccountFacadeService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQueryList = window.matchMedia(this.query);
    }
    translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocale()) {
      // @ts-ignore
      this.languageSelected = this.tokenStorageService.getLocale();
      translate.setDefaultLang(this.languageSelected);
      this.translate.use(this.languageSelected);
    } else {
      this.tokenStorageService.setLocalLang('en');
      this.languageSelected = 'en';
      translate.setDefaultLang('en');
      this.translate.use(this.languageSelected);
    }
    // translate.onLangChange
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((event: LangChangeEvent) => {
    //     this.languageSelected = event.lang;
    //     this._changeDetectorRef.detectChanges();
    //     this.translate.use(this.languageSelected);

    //     if (this.languageSelected === 'en') {
    //       this.english = true;
    //     } else {
    //       this.english = false;
    //     }
    //     if (this.languageSelected === 'fr') {
    //       this.french = true;
    //     } else {
    //       this.french = false;
    //     }
    //   });
    this.formCode = new UntypedFormGroup({
      code: new UntypedFormControl(null, [Validators.required])
    });

    this.authForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', Validators.required)
    });
    this.formL = new UntypedFormGroup({
      email: new UntypedFormControl(null, [Validators.required, Validators.email])
    });
    this.telegramLinkAccountService.init();
    this.resetPasswordForm = new UntypedFormGroup(
      {
        password: new UntypedFormControl(null, {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{0,}/
            )
          ]
        }),
        confirmPassword: new UntypedFormControl(null, [Validators.required])
      },
      { validators: MatchPasswordValidator() }
    );
  }
  /*****************cookies********************
getCookie(key: string){
  return this.cookieService.get(key);
}
/****************************************** */

  ngOnInit() {
    if (this.mediaQueryList?.matches) {
      this.backgroundImage = '';
      this.backgroundColor =
        'linear-gradient(180deg, #001C59 20.34%, #F52079 99.19%)';
    } else {
      this.backgroundImage = '';
      this.backgroundColor = '';
    }
    if (!this.cookieExists) {
      this.cookiesClicked = true;
    }
    if (this.cookieValue === 'pass') {
      this.cookiesClicked = false;
    }
    this.skipLoginWhenRedirected();
    this.convertToScript();
  }
  get getControls() {
    return this.authForm.controls;
  }
  ngAfterViewInit() {
    this.convertToScript();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId) && event) {
      if (this.mediaQueryList?.matches) {
        this.backgroundColor =
          'linear-gradient(180deg, #001C59 20.34%, #F52079 99.19%)';
      } else {
        this.backgroundImage = '';
        this.backgroundColor = '';
      }
    }
  }
  onCodeCompleted(code: string) {
    // this.codesms = code
    this.formCode.get('code')?.setValue(code);
    if (code.length === 6) this.verifyQRCode();
  }
  onCodeConfirmCompleted(code: string) {
    // this.codesms = code
    this.formCode.get('code')?.setValue(code);
    this.verifyCode();
  }

  /**
   * Will redirect user to his wallet page without passing through
   * the login page when a query param containing token exist in th url.
   */

  skipLoginWhenRedirected() {
    this.routerSub = this.route.queryParams
      .pipe(
        takeUntil(this.onDestroy$),
        mergeMap((p) => {
          if (p.message === 'account_already_used') {
            if (p.idSn === 1) {
              this.errorMessage = 'connect_with_fb';
              setTimeout(() => {
                this.errorMessage = '';
                this.router.navigate(['/auth/login']);
              }, 6000);
            } else if (p.idSn === 2) {
              this.errorMessage = 'connect_with_gplus';
              setTimeout(() => {
                this.errorMessage = '';
                this.router.navigate(['/auth/login']);
              }, 6000);
            } else if (p.idSn === 5) {
              this.errorMessage = 'connect_with_telegram';
              setTimeout(() => {
                this.errorMessage = '';
                this.router.navigate(['/auth/login']);
              }, 6000);
            } else {
              this.errorMessage = 'connect_with_form';
              setTimeout(() => {
                this.errorMessage = '';
                this.router.navigate(['/auth/login']);
              }, 6000);
            }
          } else if (
            p.message === 'Register First' ||
            p.message === 'account_invalide'
          ) {
            this.errorMessage = 'Register_First';
            setTimeout(() => {
              this.errorMessage = '';
              this.router.navigate(['/auth/login']);
            }, 6000);
          } else if (
            p.message === 'account already activated' ||
            p.message === 'activated'
          ) {
            this.errorMessage = 'account_already_activated';
            this.boo = true;
            setTimeout(() => {
              this.errorMessage = '';
              this.router.navigate(['/auth/login']);
            }, 6000);
          } else if (p.message?.indexOf('account_locked') > -1) {
            this.errorMessage = 'account_locked';
            this.blockDate = Number(p.message.split(':')[1]);
            this.blocktime = this.blockDate + 1800;
            if (this.blocktime && this.blocktime !== this.blockDate) {
              this.counter?.restart();
              this.timeLeftToUnLock =
                this.blocktime - Math.floor(Date.now() / 1000);
            }
          }
          if (p.token) {
            const user = jwt_decode(p.token);
            this.showBigSpinner = true;
            let token = JSON.parse(p.token);
            this.tokenStorageService.saveToken(token.access_token);
            this.tokenStorageService.saveExpire(token.expires_in);
            this.accountFacadeService.dispatchUpdatedAccount();
            return this.account$.pipe(
              filter((res) => res !== null),
              map((response) => {
                return {
                  response,
                  user
                };
              }),
              takeUntil(this.onDestroy$)
            );
          } else {
            return of(null);
          }
        }),
        filter(({ response }: any) => {
          return response !== null;
        }),
        catchError(() => {
          // if (error.error.text === 'Invalid Access Token') {
          //   this.tokenStorageService.signOut();
          // }
          return of(null);
        }),
        mergeMap(({ response, user }) => {
          this.tokenStorageService.setHeader();
          this.tokenStorageService.saveUserId(response.idUser);
        
          this.tokenStorageService.saveLastLogin(response.lastLogin);
          this.tokenStorageService.saveIdSn(response.idSn?.toString());
          this.idUser = Number(response.idUser);

          if (response.visitedFacebook) {
            this.tokenStorageService.setSecureWallet(
              'visited-facebook',
              'true'
            );
          }

          if (response.visitedTwitter) {
            this.tokenStorageService.setSecureWallet('visited-twitter', 'true');
          }
          if (response.visitedLinkedIn) {
            this.tokenStorageService.setSecureWallet(
              'visited-linkedin',
              'true'
            );
          }
          if (response.visitedYoutube) {
            this.tokenStorageService.setSecureWallet('visited-google', 'true');
          }
          if (response.visitedTiktok) {
            this.tokenStorageService.setSecureWallet('visited-tiktok', 'true');
          }

          if (response.is2FA === true) {
            this.tokenStorageService.setItem('valid2FA', 'false');
            this.confirmCodeShow = true;
            this.loginshow = false;
            this.showBigSpinner = false;
          } else if (response.enabled === 0) {
            // this.errorMessage_validation="account_not_verified";
            // tokenStorageService.clear();any
            this.tokenStorageService.setItem('enabled', '0');
            this.router.navigate(['/social-registration/activation-mail'], {
              queryParams: {
                email: user.email
              }
            });
          } else {
            if (
              // eslint-disable-next-line eqeqeq
              response.completed == '0' ||
              response.completed === false ||
              (response.completed && !response.enabled)
            ) {
              this.router.navigateByUrl('/social-registration/completeProfile');
              // this.showBigSpinner = false;
              // this.spinner.hide();
            } else {
              return this.walletFacade.getUserWallet().pipe(
                map((myWallet: IResponseWallet) => ({
                  myWallet,
                  response
                })),
                takeUntil(this.onDestroy$)
              );
            }
          }
          return of(null);
        }),

        take(2),
        tap((response: any) => {
          if (response?.myWallet === null) {
            this.tokenStorageService.setSecureWallet(
              'visited-completeProfile',
              'true'
            );
            this.router.navigate(['social-registration/monetize-facebook']);
            this.showBigSpinner = false;
          }
        }),
        filter((res: any) => {
          if (!res) {
            return false;
          }
          return res;
        }),
        mergeMap(
          ({
            myWallet,
            response
          }: {
            myWallet: IResponseWallet;
            response: User;
          }) => {
            this.socialAccountFacadeService.initSocialAccount();
            if (myWallet === null) {
              return this.socialAccount$.pipe(
                catchError(() => {
                  this.tokenStorageService.setSecureWallet(
                    'visited-completeProfile',
                    'true'
                  );
                  this.router.navigate([
                    'social-registration/monetize-facebook'
                  ]);
                  return of({ myWallet, response });
                }),
                tap((data) => {
                  this.showBigSpinner = true;
                  if (data !== null) {
                    this.socialAcountCheck(data);
                  } else {
                    this.tokenStorageService.setSecureWallet(
                      'visited-completeProfile',
                      'true'
                    );
                    this.router.navigate([
                      'social-registration/monetize-facebook'
                    ]);
                  }
                }),
                filter((res: any) => res !== null),
                takeUntil(this.onDestroy$)
              );
            }
            return of({ myWallet, response });
          }
        ),
        filter((res: any) => {
          if (!res) {
            return false;
          }
          return res.wallet !== null;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (res: any) => {
          if (!res.myWallet) {
            return;
          }
          if (res.myWallet.data.address) {
            if (res.response?.new) {
              // if (!res.response.passphrase) {
              //   this.router.navigate(['/social-registration/pass-phrase']);
              // } else {
              this.tokenStorageService.saveIdWallet(res.myWallet.data.address);
              this.tokenStorageService.saveTronWallet(
                res.myWallet.data?.tronAddress
              );
              this.router.navigateByUrl('/ad-pools');
              this.showBigSpinner = true;
              this.backgroundImage = '';
              this.backgroundColor = '';
              this.onDestroy$.next('');
              // }
            } else {
              this.tokenStorageService.saveIdWallet(res.myWallet.data.address);
              this.tokenStorageService.saveTronWallet(
                res.myWallet.data?.tronAddress
              );
              this.router.navigateByUrl('/ad-pools');
              this.onDestroy$.next('');
              this.showBigSpinner = true;
              this.backgroundImage = '';
              this.backgroundColor = '';
            }

            // this.spinner.hide();
          }
        },
        (error: HttpErrorResponse) => {
          if (
            error.error &&
            error.error.error === 'Wallet not found' &&
            error.error.code === 404
          ) {
            this.tokenStorageService.setSecureWallet(
              'visited-completeProfile',
              'true'
            );
            this.router.navigate(['social-registration/monetize-facebook']);
            this.showBigSpinner = true;
          }
        }
      );

    // .subscribe((data: User | null) => {
    //   this.tokenStorageService.saveIdSn(data?.idSn);
    //   this.tokenStorageService.saveUserId(data?.idUser);
    //   if (
    //     (!data?.completed && data?.idSn !== 0) ||
    //     (data?.completed && data?.idSn !== 0 && !data?.enabled) ||
    //     (data?.completed === undefined && data?.idSn !== 0) ||
    //     (data?.enabled === undefined && data?.idSn !== 0)
    //   ) {
    //     this.router.navigate(['social-registration/completeProfile']);
    //     this.onDestroy$.next('');
    //   } else {
    //     setTimeout(() => this.router.navigate(['wallet']), 2000);
    //   }
    // });
  }

  snlogin(social: string) {
    this.tokenStorageService?.saveWalletVersion('v1');
    this.tokenStorageService?.setModaleMigrate('open');
    this.scale = true;
    this.loggedrs = true;
    if (this.cookie.get('satt_cookies') === 'pass') {
      //window.location.href = sattUrl + "/snlogin/" + social;
      if (social === 'facebook') {
        this.loginNet = 'facebook';
        window.location.href = this.authFacebook;
      } else if (social === 'google') {
        this.loginNet = 'google';
        window.location.href = this.authGoogle;
      } else if (social === 'telegram') {
        this.loginNet = 'telegram';
        window.location.href = this.authTelegram;
      }
    }
  }

  /**
   * Get authForm controls.
   */
  get f() {
    return this.authForm.controls;
  }
  get formF() {
    return this.formL.controls;
  }

  onValueChanged(value: boolean, puzzle: TemplateRef<ElementRef>) {
    if (value === true) {
      this.login();
      this.closeModal(puzzle);
    }
  }
  goToSignup() {
    this.router.navigate(['/auth/registration']);
  }
  /**
   * Authenticate user
   */
  login() {
    this.tokenStorageService?.setModaleMigrate('open');
    this.tokenStorageService?.saveWalletVersion('v1');
    this.isSubmitting = true;
    this.showSpinner = true;
    this.loggedrs = false;
    this.scale = true;
  
    if (this.authForm.valid && this.cookie.get('satt_cookies') === 'pass') {
      this.authService
        .login(this.f.email?.value, this.f.password?.value)
        .pipe(
          takeUntil(this.onDestroy$),
          //( error.error.message.startsWith('ValidationError')
          catchError((error: HttpErrorResponse) => {
            let errorMessage = 'login_error'; // Default error message
          
            if (error.error && error.error.error) {
              const errorType = error.error.error.message;
          
              switch (errorType) {
                case 'ValidationError':
                  errorMessage = 'incorrectPassword';
                  break;
                case 'user not found':
                  errorMessage = 'invalidEmailAddress';
                  break;
                case 'invalid_credentials':
                  errorMessage = 'incorrectPassword';
                  break;
                case 'account_locked':
                  errorMessage = 'Account locked';
          
                  if (
                    this.blocktime &&
                    this.blocktime !== error.error.error.blockedDate.blockedDate
                  ) {
                    this.counter.restart();
                  }
          
                  this.blocktime = error.error.error.blockedDate + 1800;
                  this.timeLeftToUnLock = Math.max(0, this.blocktime - Math.floor(Date.now() / 1000));
          
                  this.f.password.reset();
                  this.blockedForgetPassword = true;
                  break;
                default:
                  // Handle other error types here if needed
              }
            }

            this.errorMessage = errorMessage;
            this.authForm.get('password')?.setValue('');
            this.f.password.reset();
            this.f.email.clearValidators();
            this.f.email.updateValueAndValidity();
            this.showSpinner = false;
          
            return of(null);
          }),
          mergeMap((data: any) => {
            if (data?.data.access_token !== undefined) {
              this.tokenStorageService.setItem(
                'access_token',
                data.data.access_token
              );
              this.tokenStorageService.saveExpire(data.data.expires_in);
              this.expiresToken = data.data.expires_in;
              this.accountFacadeService.dispatchUpdatedAccount();
              return this.account$.pipe(
                filter((response) => response !== null),
                map((response) => {
                  return { data, response };
                }),
                take(1)
              );
            }
            return of(null);
          }),
          filter(({ data, response }: any) => {
            return response !== null && data !== null;
          }),
          catchError(() => {
            return of(null);
          }),
          mergeMap(({ data, response }: { data: any; response: User }) => {
            this.tokenStorageService.setHeader();
            this.tokenStorageService.saveUserId(response.idUser);
            this.tokenStorageService.saveLastLogin(response.lastLogin);
            this.tokenStorageService.saveIdSn(response.idSn.toString());
            this.idUser = Number(response.idUser);
  
            if (response.visitedFacebook) {
              this.tokenStorageService.setSecureWallet(
                'visited-facebook',
                'true'
              );
            }
            if (response.visitedTwitter) {
              this.tokenStorageService.setSecureWallet(
                'visited-twitter',
                'true'
              );
            }
            if (response.visitedLinkedIn) {
              this.tokenStorageService.setSecureWallet(
                'visited-linkedin',
                'true'
              );
            }
            if (response.visitedYoutube) {
              this.tokenStorageService.setSecureWallet(
                'visited-google',
                'true'
              );
            }
            if (response.visitedTiktok) {
              this.tokenStorageService.setSecureWallet(
                'visited-tiktok',
                'true'
              );
            }  
            if (response.is2FA === true) {
              this.tokenStorageService.setItem('valid2FA', 'false');
              this.confirmCodeShow = true;
              this.loginshow = false;
            } else {
              this.tokenStorageService.saveToken(data.data.access_token);
              if (response.enabled === 0) {
                this.tokenStorageService.setItem('enabled', '0');
                this.router.navigate(['/social-registration/activation-mail'], {
                  queryParams: {
                    email: this.authForm.get('email')?.value
                  }
                });
              } else {
                this.tokenStorageService.setNewUserV2(response?.passphrase !== undefined ? !response?.passphrase : true);
                if (response.idSn !== 0 && response.idSn !== null) {
                  if (
                    !response.completed ||
                    (response.completed && !response.enabled)
                  ) {
                    this.router.navigate(['social-registration/completeProfile']);
                    this.showBigSpinner = true;
                  } else {
                    return this.walletFacade.getUserWallet().pipe(
                      map((myWallet: IResponseWallet) => ({
                        myWallet,
                        response
                      })),
                      takeUntil(this.onDestroy$)
                    );
                  }
                } else {
                  return this.walletFacade.getUserWallet().pipe(
                    map((myWallet: IResponseWallet) => ({
                      myWallet,
                      response
                    })),
                    takeUntil(this.onDestroy$)
                  );
                }
              }
            }
            return of(null);
          }),
          filter((res: any) => {
            if (!res) {
              return false;
            }
            return res;
          }),
          mergeMap(
            ({
              myWallet,
              response
            }: {
              myWallet: IResponseWallet;
              response: User;
            }) => {
              this.showBigSpinner = true;
              this.socialAccountFacadeService.initSocialAccount();
              if (myWallet === null) {
                return this.socialAccount$.pipe(
                  catchError(() => {
                    this.tokenStorageService.setSecureWallet(
                      'visited-completeProfile',
                      'true'
                    );
                    this.router.navigate([
                      'social-registration/monetize-facebook'
                    ]);
                    return of({ myWallet, response });
                  }),
                  tap((data) => {
                    if (data !== null) {
                      this.socialAcountCheck(data);
                    } else {
                      this.tokenStorageService.setSecureWallet(
                        'visited-completeProfile',
                        'true'
                      );
                      this.router.navigate([
                        'social-registration/monetize-facebook'
                      ]);
                    }
                  }),
                  filter((res: any) => res !== null),
                  takeUntil(this.onDestroy$)
                );
              }
              return of({ myWallet, response });
            }
          ),
          filter((res: any) => {
            if (!res) {
              return false;
            }
            return res.wallet !== null;
          }),
          takeUntil(this.onDestroy$)
        )
        .subscribe(
          (res: any) => {
            if (!res.myWallet) {
              this.showBigSpinner = true;
              return;
            }
            if (res.myWallet.data.address) {
              if (res.response.data?.new) {
                this.tokenStorageService.saveIdWallet(res.myWallet.data.address);
                this.tokenStorageService.saveTronWallet(
                  res.myWallet.data?.tronAddress
                );
                this.notificationService.triggerFireBaseNotifications.next(
                  true
                );
                this.router.navigate(['/ad-pools']);
                this.showBigSpinner = true;
                this.backgroundImage = '';
                this.backgroundColor = '';
              } else {
                this.tokenStorageService.saveIdWallet(res.myWallet.data.address);
                this.tokenStorageService.saveTronWallet(
                  res.myWallet.data?.tronAddress
                );
                this.notificationService.triggerFireBaseNotifications.next(
                  true
                );
                this.router.navigate(['/ad-pools']);
                this.showBigSpinner = true;
                this.backgroundImage = '';
                this.backgroundColor = '';
              }
            }
          },
          (error: HttpErrorResponse) => {
            if (
              error?.error?.error === 'Wallet not found' &&
              error?.error?.code === 404
            ) {
              this.tokenStorageService.setSecureWallet(
                'visited-completeProfile',
                'true'
              );
              this.router.navigate(['social-registration/monetize-facebook']);
              this.showBigSpinner = true;
            }
          }
        );
    } else {
      this.showSpinner = false;
    }
  }
  
  socialAcountCheck(data: any) {
    this.tokenStorageService.setSecureWallet('visited-completeProfile', 'true');
    if (data?.facebook?.length === 0) {
      this.router.navigate(['social-registration/monetize-facebook']);
    } else if (data?.twitter?.length === 0) {
      this.tokenStorageService.setSecureWallet('visited-facebook', 'true');
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.facebook);
      this.router.navigate(['social-registration/monetize-twitter']);
    } else if (data?.linkedin?.length === 0) {
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.twitter);
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.facebook);
      this.tokenStorageService.setSecureWallet('visited-facebook', 'true');
      this.tokenStorageService.setSecureWallet('visited-twitter', 'true');
      this.router.navigate(['social-registration/monetize-linkedin']);
    } else if (data?.google?.length === 0) {
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.twitter);
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.facebook);
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
      this.tokenStorageService.setSecureWallet('visited-facebook', 'true');
      this.tokenStorageService.setSecureWallet('visited-twitter', 'true');
      this.tokenStorageService.setSecureWallet('visited-linkedin', 'true');

      this.router.navigate(['social-registration/monetize-google']);
    } else {
      this.tokenStorageService.setSecureWallet('visited-facebook', 'true');
      this.tokenStorageService.setSecureWallet('visited-twitter', 'true');
      this.tokenStorageService.setSecureWallet('visited-linkedin', 'true');
      this.tokenStorageService.setSecureWallet('visited-google', 'true');
      this.tokenStorageService.setSecureWallet('visited-tiktok', 'true');
      this.tokenStorageService.setSecureWallet('visited-socialConfig', 'true');
      this.tokenStorageService.setSecureWallet(
        'visited-transactionPwd',
        'true'
      );
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.facebook);
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.youtube);
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.linkedIn);
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.twitter);
      this.socialAccountsFacade.pageVisited(ESocialMediaNames.tiktok);
      this.router.navigate(['social-registration/password_wallet']);
    }
  }

  verifyQRCode() {
    let body = {
      code: this.formCode.get('code')?.value
    };
    this.profileSettingsFacade
      .verifyQRCode(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (data: any) => {
          if (data.data.verifiedCode === false) {
            this.errorMessagecode = 'code incorrect';
            this.codesms = false;
          } else if (data.data.verifiedCode === true) {
            this.codesms = true;
            this.errorMessagecode = 'code correct';
          }
        },
        () => {
          // this.errorMessage = 'error';
        }
      );
  }
  nextRedirection() {
    if (!this.codesms) {
      return;
    }
    this.account$
      .pipe(
        filter((response: User | null) => response !== null),
        takeUntil(this.onDestroy$),
        mergeMap((response: User | null) => {
          if (response) {
            this.tokenStorageService.saveUserId(response.idUser);
            this.tokenStorageService.saveLastLogin(response.lastLogin);
            this.tokenStorageService.saveIdSn(response.idSn.toString());
            this.tokenStorageService.setItem('valid2FA', '');
            this.tokenStorageService.setItem('isAuthenticated', 'true');
            this.tokenStorageService.saveExpire(this.expiresToken);
            this.tokenStorageService.setHeader();
            return this.walletFacade.getUserWallet();
          }
          return of(null);
        }),
        catchError(() => {
          this.tokenStorageService.signOut();
          this.router.navigate(['auth/login']);
          return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestroy$),
        catchError((error: HttpErrorResponse) => {
          if (error.error.errror === 'Wallet not found') {
            this.tokenStorageService.setSecureWallet(
              'visited-completeProfile',
              'true'
            );
            this.router.navigate(['/social-registration/monetize-facebook']);
            this.showBigSpinner = true;
            //this.spinner.hide();
          } else {
            this.tokenStorageService.signOut();
            this.router.navigate(['auth/login']);
            return of(false);
          }
          return of(null);
        })
      )
      .subscribe((myWallet: IResponseWallet | null) => {
        if (myWallet && myWallet.data.address) {
          this.tokenStorageService.saveIdWallet(myWallet.data.address);
          this.tokenStorageService.saveTronWallet(myWallet.data?.tronAddress);
          this.router.navigate(['/ad-pools']);
          this.showBigSpinner = true;
          this.backgroundImage = '';
          this.backgroundColor = '';
          // this.spinner.hide();
        }
      });
    // this.authService
    //   .verifyAccount()
    //   .pipe(
    //     mergeMap((response: IresponseAccount) => {
    //       if (response) {
    //         this.tokenStorageService.saveUserId(response.data.idUser);
    //         this.tokenStorageService.saveIdSn(response.data.idSn);
    //         this.tokenStorageService.setItem('valid2FA', '');
    //         this.tokenStorageService.setItem('isAuthenticated', 'true');
    //         this.tokenStorageService.saveExpire(this.expiresToken);
    //         this.tokenStorageService.setHeader();

    //         if (
    //           (!response.data.completed && response.data.idSn !== '0') ||
    //           (response.data.completed &&
    //             response.data.idSn !== '0' &&
    //             !response.data.enabled)
    //         ) {
    //           this.router.navigate(['/social-registration/completeProfile']);
    //           this.showBigSpinner = true;
    //           // this.spinner.hide();
    //         } else {
    //           return this.walletFacade.getUserWallet();
    //         }
    //       }
    //       return of(null);
    //     })
    //   )
    //   .pipe(
    //     filter((res) => res !== null),
    //     takeUntil(this.onDestroy$)
    //   )
    //   .subscribe((myWallet: IResponseWallet | null) => {
    //     if (myWallet?.data.address) {
    //       this.tokenStorageService.saveIdWallet(myWallet.data.address);
    //       this.router.navigate(['']);
    //       this.showBigSpinner = true;
    //       this.backgroundImage = '';
    //       this.backgroundColor = '';
    //       // this.spinner.hide();
    //     } else if (myWallet && myWallet.error === 'Wallet not found') {
    //       this.tokenStorageService.setSecureWallet(
    //         'visited-completeProfile',
    //         'true'
    //       );
    //       this.router.navigate(['/social-registration/monetize-facebook']);
    //       this.showBigSpinner = true;
    //       //this.spinner.hide();
    //     }
    //   });
  }
  /**
   * Sends a new confirmation mail to th user.
   */
  sendConfirmationMail() {
    let email = this.authForm.get('email')?.value;
    const link = `<span style="color:#4048FF" >${email}</span >`;
    this.authService
      .sendConfirmationMail(this.authForm.get('email')?.value)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response) => {
        if (response) {
          if (this.languageSelected === 'fr') {
            Swal.fire({
              icon: 'success',
              html: `Un nouveau email de verification a été envoyé à l'adresse ${link}. Merci de verfier votre spam si vous puver pas le trouvez `
            }).then(() => {
              // window.location.href = "/auth/login";
              if (isPlatformBrowser(this.platformId)) {
                window.location.reload();
              }
            });
          } else {
            Swal.fire({
              icon: 'success',
              html: `A new verification email has been sent to ${link}. please check your spam in case you can't find it.`
            }).then(() => {
              if (isPlatformBrowser(this.platformId)) {
                window.location.href = '/auth/login';
              }
            });
          }
        }
      });
  }

  goToRegistration() {
    this.router.navigate(['auth/registration']);
    // this.closeModal(this.ErrorModal)
  }

  switchLang(lang: string) {
    //TOOD: Not sure what this line of code does!!
    //document.getElementById('content');
    this.tokenStorageService.removeItem('local');
    this.tokenStorageService.setItem('local', lang);
    this.languageSelected = lang;
    this.translate.use(lang);
  }
  convertToScript() {
    if (
      this.cookie.get('satt_cookies') === 'pass' &&
      isPlatformBrowser(this.platformId)
    ) {
      this.loggedrs = true;
      const element = this.script?.nativeElement;
      const script = this.document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?14';
      script.setAttribute('data-telegram-login', environment.telegramBot);
      script.setAttribute('data-size', 'large');
      //script.setAttribute("data-onauth","onTelegramAuth(user)");
      script.setAttribute('data-auth-url', sattUrl + '/auth/signin/telegram');

      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-radius', '15');
      // Callback function in global scope
      if (element) element?.parentElement?.replaceChild(script, element);
    }
  }

  openModal(content: TemplateRef<ElementRef>) {
    if (!this.blockedForgetPassword) {
      this.modalService.open(content);
    }
  }

  chooseModal() {
    this.show = 'first';
  }

  closeModal(content: TemplateRef<ElementRef>) {
    this.modalService.dismissAll(content);
    this.showSpinner = false;
    this.successMessagecode = '';
  }

  verifyCode() {
    let code = this.formCode.get('code')?.value;
    let email = this.formL.get('email')?.value;
    let type = 'reset';
    this.authService
      .confirmCode(email.toLowerCase(), code, type)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (data: any) => {
          if (data.message === 'code is matched') {
            this.codesms = true;
            this.successMessagecode = 'code correct';
            this.errorMessagecode = '';
          }
        },
        (err) => {
          if (err.error.error === 'user not found' && err.error.code === 404) {
            this.errorMessagecode = 'user not found';
          } else if (
            err.error.error === 'wrong code' &&
            err.error.code === 401
          ) {
            this.errorMessagecode = 'code incorrect';
            this.formCode.reset();
            this.successMessagecode = '';
            // this.codeInput.reset();
            setTimeout(() => {
              this.errorMessagecode = '';
            }, 2000);
          } else if (
            err.error.error === 'code expired' &&
            err.error.code === 401
          ) {
            this.errorMessagecode = 'code expired';
            this.codesms = false;
          }
        }
      );
  }
  changePwd() {
    let email = this.formL.get('email')?.value;
    this.router.navigate(['auth/resetpassword'], {
      queryParams: { email, code: this.formCode.get('code')?.value }
    });
  }

  clickedReset: boolean = false;
  resetPassword() {
    this.isSub = true;
    let email = this.formL.get('email')?.value;
    //const link = `<span style="color:#4048FF" >${email}</span >`;
    this.authService
      .resetPassword(email)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (res) => {
          if (!res) {
            this.closeModal(this.lostpwdModal);
            this.errorMessage = 'account_not_exists';
          }
          this.show = 'second';
          this.forgotpassword = false;
          this.recoverpassword = true;
          this.clickedReset = !this.clickedReset;
          // if (data.message === 'account_locked') {
          //   this.closeModal(this.lostpwdModal);

          //   this.errorMessage = 'account_locked';
          //   this.blocktime = data.blockedDate + 1800;
          //   this.timeLeftToUnLock =
          //     this.blocktime - Math.floor(Date.now() / 1000);
          //   this.blockedForgetPassword = true;
          // }

          this.isCollapsed = false;

          // Decompteur
          setTimeout(() => {
            this.showResendLink = true;
          }, 60000);
          // this.showResendLink = false;

          var timer = setInterval(() => {
            this.showResendLink = false;
            if (this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              this.timeLeft = 60;
              clearInterval(timer);
              this.showResendLink = true;
            }
          }, 1000);
        },
        (error) => {
          if (error.error.error === 'connect_with_gplus') {
            this.errorMessagePwd = 'connect_with_gplus';
          }
          if (error['error'].message === 'connect_with_fb') {
            this.errorMessagePwd = 'connect_with_fb';
          }
          if (error.error.error === 'account_locked') {
            this.closeModal(this.lostpwdModal);

            this.errorMessage = 'account_locked';
            this.blocktime = error.blockedDate + 1800;
            this.timeLeftToUnLock =
              this.blocktime - Math.floor(Date.now() / 1000);
            this.blockedForgetPassword = true;
          }
          if (error.error.error === 'account not exists') {
            this.closeModal(this.lostpwdModal);

            this.errorMessage = 'account_not_exists';
            this.blocktime = error.blockedDate + 1800;
            this.timeLeftToUnLock =
              this.blocktime - Math.floor(Date.now() / 1000);
            this.blockedForgetPassword = true;
          }

          // else {
          //   this.errorMessagePwd = 'account_not_exists';
          //   setTimeout(() => {
          //     this.errorMessagePwd = '';
          //     this.formL.reset();
          //     this.formF.email.clearValidators();
          //     this.formF.email.updateValueAndValidity();
          //   }, 6000);
          // }
        }
      );
  }

  // dontShowAgain(){
  //   this.toggle =false ;
  //    let data_profile = {
  //     toggle: false,
  //    }
  //    this.ProfileService.updateprofile(data_profile).subscribe(
  //        (response: any) => {}
  //    )
  //   }
  finishTest(event: CountdownEvent) {
    if (event.action === 'notify') {
      this.blockedForgetPassword = false;
    }
  }

  cookies() {
    this.cookie.set('satt_cookies', 'pass', { expires: 30, sameSite: 'Lax' });
    this.cookiesClicked = false;
  }

  captchapuzzle(puzzle: TemplateRef<ElementRef>) {
    this.showSpinner = true;
    setTimeout(() => {
      this.spinner.hide();
      this.showBigSpinner = false;
    }, 1000);
    this.spinner.show();
    // this.showBigSpinner = true;

    this.modalService.open(puzzle);
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.eventsSubject) this.eventsSubject.unsubscribe();
    if (this.onDestroy$) {
      this.onDestroy$.next('');
      this.onDestroy$.complete();
      this.onDestroy$.unsubscribe();
    }
    // this.translate.onLangChange.unsubscribe();
  }
}
