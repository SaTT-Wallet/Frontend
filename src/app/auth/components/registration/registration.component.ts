import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Inject,
  TemplateRef,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { sattUrl, pattEmail, pattPassword } from '@app/config/atn.config';
import { CookieService } from 'ngx-cookie-service';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { environment } from '@environments/environment';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { Subject, Subscription } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AuthFacadeService } from '@app/core/facades/auth-facade/auth-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { WhiteSpaceValidator } from '@app/helpers/form-validators';

declare const zxcvbn: Function;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  strength: { [key: number]: string } = {
    0: 'password_worst',
    1: 'password_bad',
    2: 'password_weak',
    3: 'password_good',
    4: 'password_strong',
    5: ''
  };
  registrationconfirm: boolean = false;
  exist = false;
  isSuccessful = false;
  isSubmitting: boolean = false;
  routerSub!: Subscription;
  errorMessage = '';
  authForm: FormGroup;
  languageSelected: string = 'en';
  showSpinner: boolean = false;
  authFacebook: string = sattUrl + '/auth/signup/facebook';
  authGoogle: string = sattUrl + '/auth/signup/google';
  authTelegram: string = sattUrl + '/auth/signup/telegram';
  loginNet: string = '';
  cookiesClicked!: boolean;
  cookieValue: string = this.cookie.get('satt_cookies');
  cookieExists: boolean = this.cookie.check('satt_cookies');
  isClicked!: boolean;
  successUpper = false;
  successLower = false;
  successNumber = false;
  successSpecial = false;
  successWhitespaces = false;
  successLength = false;
  @ViewChild('passwordStrengthText') meter!: ElementRef;
  passwordStrengthMsg: string = '';
  passwordErrMsg: string = '';
  private onDestroy$ = new Subject();

  @ViewChild('script') script!: ElementRef;
  public isChecked: boolean = false;
  english: boolean = true;
  modifEmail: any;
  constructor(
    private walletFacade: WalletFacadeService,
    private authFacadeService: AuthFacadeService,
    private renderer: Renderer2,
    public modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public _changeDetectorRef: ChangeDetectorRef,
    private cookie: CookieService,
    @Inject(DOCUMENT) private document: Document,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string,
    private accountFacadeService: AccountFacadeService
  ) {
    translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocalLang()) {
      // @ts-ignore
      this.languageSelected = this.tokenStorageService.getLocalLang();
      translate.setDefaultLang(this.languageSelected);
      this.translate.use(this.languageSelected);
    } else {
      this.tokenStorageService.setLocalLang('en');
      this.languageSelected = 'en';
      translate.setDefaultLang('en');
      this.translate.use(this.languageSelected);
    }
    translate.onLangChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event: LangChangeEvent) => {
        this.languageSelected = event.lang;
        this._changeDetectorRef.detectChanges();
        this.translate.use(this.languageSelected);
        this.english = !this.english;
        if (this.languageSelected === 'en') {
          this.english = true;
        } else {
          this.english = false;
        }
      });
    this.authForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(pattEmail)
      ]),
      password: new FormControl('', {
        validators: [
          WhiteSpaceValidator.noWhiteSpace,
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(pattPassword)
          // Validators.pattern(pattUppercase)
        ]
      }),
      agreeBox: new FormControl('', [Validators.required]),
      newsLetterBox: new FormControl(false)
    });
  }

  ngOnInit() {
    this.authForm
      .get('email')
      ?.valueChanges.pipe(
        debounceTime(200),
        map((email) => {
          email = email?.trim();
          return email;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe((email) => {
        this.modifEmail = email;
        this._changeDetectorRef.detectChanges();
      });

    this.skipLoginWhenRedirected();
    this.convertToScript();
    if (!this.cookieExists) {
      this.cookiesClicked = true;
    }
    if (this.cookieValue === 'pass') {
      this.cookiesClicked = false;
    }
    this.authForm
      .get('password')
      ?.valueChanges.pipe(
        debounceTime(200),
        map((password) => password),
        takeUntil(this.onDestroy$)
      )
      .subscribe((password) => {
        let result = zxcvbn(password);
        // // Update the password strength meter
        // this.renderer.setAttribute(
        //   this.meter?.nativeElement,
        //   "data-password-strength",
        //   result.score
        // );
        // Update the text indicator
        if (password !== '') {
          if (result.score < 3) {
            this.passwordStrengthMsg = this.strength[result.score];
            this.renderer.setAttribute(
              this.meter?.nativeElement,
              'data-password-strength',
              result.score
            );
          } else {
            if (this.getControls.password.errors?.pattern) {
              this.passwordStrengthMsg = this.strength[3];
              this.renderer.setAttribute(
                this.meter?.nativeElement,
                'data-password-strength',
                '3'
              );
              result.score = 3;
            } else {
              this.passwordStrengthMsg = this.strength[result.score];
              this.renderer.setAttribute(
                this.meter?.nativeElement,
                'data-password-strength',
                result.score
              );
            }
          }
        } else {
          this.passwordStrengthMsg = '';
          this.renderer.setAttribute(
            this.meter?.nativeElement,
            'data-password-strength',
            '0'
          );
        }
      });

    this.authForm
      .get('password')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((pass) => {
        const regex = /[A-Z]/g;
        const regexLowerCase = /[a-z]/g;
        const regexNumber = /[0-9]+/g;
        const regexSpecial = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const regexWhitespaces = /\s/;
        if (pass.match(regex)) {
          let errMsg = this.document.getElementById('errMsgUpper');
          this.successUpper = true;
          //@ts-ignore
          errMsg?.style.color = '#00CC9E';
        } else {
          let errMsg = this.document.getElementById('errMsgUpper');
          this.successUpper = false;
          //@ts-ignore
          errMsg?.style.color = '#F52079';
        }

        if (pass.match(regexLowerCase)) {
          let errMsg = this.document.getElementById('errMsgLower');
          this.successLower = true;
          //@ts-ignore
          errMsg?.style.color = '#00CC9E';
        } else {
          let errMsg = this.document.getElementById('errMsgLower');
          this.successLower = false;
          //@ts-ignore
          errMsg?.style.color = '#F52079';
        }

        if (pass.match(regexNumber)) {
          let errMsg = this.document.getElementById('errMsgNumber');
          this.successNumber = true;
          //@ts-ignore
          errMsg?.style.color = '#00CC9E';
        } else {
          let errMsg = this.document.getElementById('errMsgNumber');
          this.successNumber = false;
          //@ts-ignore
          errMsg?.style.color = '#F52079';
        }

        if (pass.match(regexSpecial)) {
          let errMsg = this.document.getElementById('errMsgSpecial');
          this.successSpecial = true;
          //@ts-ignore
          errMsg?.style.color = '#00CC9E';
        } else {
          let errMsg = this.document.getElementById('errMsgSpecial');
          this.successSpecial = false;
          //@ts-ignore
          errMsg?.style.color = '#F52079';
        }
        if (!pass.match(regexWhitespaces)) {
          let errMsg = this.document.getElementById('errMsgWhitespaces');
          this.successWhitespaces = true;
          //@ts-ignore
          errMsg?.style.color = '#00CC9E';
        } else {
          let errMsg = this.document.getElementById('errMsgWhitespaces');
          this.successWhitespaces = false;
          //@ts-ignore
          errMsg?.style.color = '#F52079';
        }
        if (this.getControls.password.errors?.minlength) {
          let errMsg = this.document.getElementById('errLength');
          this.successLength = false;
          //@ts-ignore
          errMsg?.style.color = '#F52079';
        } else {
          let errMsg = this.document.getElementById('errLength');
          this.successLength = true;
          if (errMsg) errMsg.style.color = '#00CC9E';
        }
      });
  }
  ngAfterViewInit() {
    this.convertToScript();
  }
  check() {
    this.isChecked = !this.isChecked;
  }
  closeModal(content: TemplateRef<ElementRef>) {
    this.modalService.dismissAll(content);
  }
  openModal(content: TemplateRef<ElementRef>) {
    this.modalService.open(content);
  }

  snlogin(social: string) {
    if (social === 'facebook') {
      this.loginNet = 'facebook';
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = this.authFacebook;
      }
    } else if (social === 'google') {
      this.loginNet = 'google';
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = this.authGoogle;
      }
    } else if (social === 'telegram') {
      this.loginNet = 'telegram';
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = this.authTelegram;
      }
    }
    //window.location.href = gUrl + "/snlogin/" + social;
  }

  get getControls() {
    return this.authForm.controls;
  }
  checkControl(controlName: string) {
    return (
      this.authForm.get(controlName)?.invalid &&
      this.authForm.get(controlName)?.dirty
    );
  }
  skipLoginWhenRedirected() {
    this.routerSub = this.route.queryParams
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((p) => {
        if (p.message) {
          if (p.message === 'account_already_used') {
            if (p.idSn === '0') {
              this.errorMessage = 'connect_with_form';
            } else if (p.idSn === '1') {
              this.errorMessage = 'connect_with_fb';
            } else if (p.idSn === '2') {
              this.errorMessage = 'connect_with_gplus';
            } else if (p.idSn === '5') {
              this.errorMessage = 'connect_with_telegram';
            } else if (p.idSn === '') {
              this.errorMessage = 'account_already_used';
            }
          } else if (p.message === 'Register First') {
            this.errorMessage = 'Register_First';
          }
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['/auth/registration']);
          }, 9000);
        }
      });

    // this.walletFacade
    //   .getUserWallet()
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((response) => {
    //     if (!response.error) {
    //       this.router.navigate(['']);
    //     }
    //   });
  }

  register() {
    this.isSubmitting = true;
    this.showSpinner = true;
    if (this.authForm.valid) {
      const email = this.authForm.get('email')?.value;
      const password = this.authForm.get('password')?.value;
      // const password_confirmation = this.authForm.get('password')?.value;
      const newsLetter = this.authForm.get('newsLetterBox')?.value;

      // const noredirect = 'true';
      this.authService
        .register(email, password, newsLetter)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (data) => {
            if (data.data.loggedIn) {
              let param = {
                access_token: data.data.access_token,
                expires_in: data.data.expires_in,
                token_type: 'bearer',
                scope: 'user'
              };
              this.router.navigateByUrl(
                '/auth/login?token=' + JSON.stringify(param)
              );
              return;
            }
            if (data.code === 200 && data.message === 'success') {
              var result =
                this.document.getElementById('dropdown-menu')?.className;
              let newClass = result + ' show';
              this.document
                .getElementById('dropdown-menu')
                ?.setAttribute('class', newClass);
              this.exist = true;
              this.tokenStorageService.saveToken(data.data.access_token);
              this.tokenStorageService.saveExpire(data.data.expires_in);
              this.tokenStorageService.setUserSn('0');
              this.tokenStorageService.setEnabled('0');
              this.accountFacadeService.dispatchUpdatedAccount();
              this.tokenStorageService.setShowPopUp('false');
              // this.modalService.open(this.confirmModal);
              this.showSpinner = false;
              this.router.navigate(['/social-registration/activation-mail'], {
                queryParams: { email: this.authForm.get('email')?.value }
              });
            }
          },
          (err) => {
            if (err.error.error.message === 'connect_with_form') {
              this.errorMessage = 'connect_with_form';
              this.showSpinner = false;
            } else if (
              err.error.error.message === 'account_already_used' &&
              err.error.code === 401
            ) {
              this.errorMessage = 'account_already_used';
              setTimeout(() => (this.errorMessage = ''), 6000);
              this.showSpinner = false;
            }
            // else {
            //   this.errorMessage = 'server_error';
            //   this.showSpinner = false;
            // }
          }
        );
    } else {
      this.showSpinner = false;
    }
  }
  goToLogin() {
    this.router.navigate(['auth/login']);
    //this.router.navigate(['/auth/login'], { queryParams: { code: '399857b944bb4bbcbb9dc1a4c056f35363120',id:"60868533aa7c4e04f4ade44f" } });
  }
  onCheckboxChange(event: Event, form: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked === false) {
      this.authForm.get(form)?.setValue('');
    }
  }

  closePopup() {
    this.exist = false;
    this.router.navigate(['auth/login']);
  }
  switchLang(lang: string) {
    this.tokenStorageService.removeLocalLang();
    this.tokenStorageService.setLocalLang(lang);
    this.languageSelected = lang;
    this.translate.use(lang);
  }
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
              // window.location.href = "/auth/login";
              if (isPlatformBrowser(this.platformId)) {
                window.location.reload();
              }
            });
          }
        }
      });
  }

  convertToScript() {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.script?.nativeElement;
      const script = this.document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?14';
      script.setAttribute('data-telegram-login', environment.telegramBot);
      script.setAttribute('data-size', 'large');
      //script.setAttribute("data-onauth","onTelegramAuth(user)");
      script.setAttribute('data-auth-url', sattUrl + '/auth/signup/telegram');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-radius', '15');
      // Callback function in global scope
      element?.parentElement.replaceChild(script, element);
    }
  }
  ngOnDestroy() {
    if (!!this.routerSub) {
      this.routerSub.unsubscribe();
    }
    this.onDestroy$.next('');
    this.onDestroy$.complete();
  }

  onValueChanged(value: boolean, puzzle: TemplateRef<ElementRef>) {
    if (value === true) {
      this.register();
      this.closeModal(puzzle);
    }
  }
  cookies() {
    this.cookie.set('satt_cookies', 'pass', { expires: 30, sameSite: 'Lax' });
    this.cookiesClicked = false;
  }

  captchapuzzle(puzzle: TemplateRef<ElementRef>) {
    setTimeout(() => {}, 1000);
    //this.showSpinner=true;
    this.modalService.open(puzzle);
  }

  onCheckboxChangeNewsLetter(event: Event, form: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked === false) {
      this.authForm.get(form)?.setValue('');
    }
  }
}
