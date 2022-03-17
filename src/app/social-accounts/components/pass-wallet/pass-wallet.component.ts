import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { User } from '@app/models/User';
import { MatchPasswordValidator } from '@app/helpers/form-validators';
import { debounceTime, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { pattPassword } from '@app/config/atn.config';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { AuthFacadeService } from '@app/core/facades/auth-facade/auth-facade.service';
//import { Console } from 'node:console';
declare const zxcvbn: any;
@Component({
  selector: 'app-pass-wallet',
  templateUrl: './pass-wallet.component.html',
  styleUrls: ['./pass-wallet.component.scss']
})
export class PassWalletComponent implements OnInit, OnDestroy {
  passwordExist: boolean = false;
  languageSelected: string = 'en';
  user!: User;
  erreuur: boolean = false;
  @ViewChild('passwordStrengthText') meter!: ElementRef;
  playWizard: boolean = false;
  wizardFinished: boolean = false;
  showSpinner: boolean = false;
  passwordStrengthMsg: string = '';
  form: FormGroup;
  show: boolean = false;
  showErrors!: Observable<boolean>;
  showBigSpinner: boolean = false;
  visited: boolean = false;
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  constructor(
    private accountFacadeService: AccountFacadeService,
    public translate: TranslateService,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private tokenStorageService: TokenStorageService,
    private walletFacade: WalletFacadeService,
    private authFacadeService: AuthFacadeService
  ) {
    this.form = new FormGroup(
      {
        password: new FormControl(null, {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(pattPassword)
          ]
        }),
        confirmPassword: new FormControl(null, [Validators.required])
        // confidential: new FormControl(null, [Validators.required]),
      },
      { validators: MatchPasswordValidator() }
    );
  }

  ngOnInit(): void {
    // this.getDetails();
    this.form?.valueChanges
      .pipe(
        debounceTime(200),
        map((data) => data.password),
        takeUntil(this.onDestoy$)
      )
      .subscribe((password) => {
        const strength: any = {
          0: 'password_worst',
          1: 'password_bad',
          2: 'password_weak',
          3: 'password_good',
          4: 'password_strong'
        };
        let result = zxcvbn(password);

        // Update the password strength meter
        // this.renderer.setAttribute(
        //   this.meter?.nativeElement,
        //   "data-password-strength",
        //   result.score
        // );

        // Update the text indicator
        if (password !== '') {
          if (result.score < 3) {
            this.passwordStrengthMsg = strength[result.score];
            this.renderer.setAttribute(
              this.meter?.nativeElement,
              'data-password-strength',
              result.score
            );
          } else {
            if (this.f.password.errors?.pattern) {
              this.passwordStrengthMsg = strength['3'];
              this.renderer.setAttribute(
                this.meter?.nativeElement,
                'data-password-strength',
                '3'
              );
              result.score = 3;
            } else {
              this.passwordStrengthMsg = strength[result.score];
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
    //   this.getSecure()
  }
  getDetails() {
    this.account$
      .pipe(
        mergeMap((data: any) => {
          if (data !== null && data !== undefined) {
            this.user = data;
            // this.tokenStorageService.saveUserId(data.idUser);
            //  this.tokenStorageService.saveIdSn(data.idSn);
            return this.walletFacade.wallet$;
          } else {
            return of(null);
          }
        })
      )
      .pipe(filter((res) => res !== null))
      .pipe(
        mergeMap((data: any) => {
          if (!data.error) {
            return this.profileSettingsFacade.profilePic$;
          } else return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((profile: any) => {
        if (!!profile) {
          let objectURL = URL.createObjectURL(profile);
          this.user.userPicture =
            this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
      });
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    let password = this.f.password.value;
    this.showSpinner = true;
    this.walletFacade.createPasswordWallet(password).subscribe(
      (response) => {
        if (response.message === 'success' && response.code === 200) {
          this.tokenStorageService.saveIdWallet(response.data.address);
          this.tokenStorageService.setSecureWallet('visited-pwd', 'true');
          this.router.navigate(['social-registration/pass-phrase']);
          this.showBigSpinner = false;
          this.spinner.hide();
          this.showSpinner = false;
        }
      },
      (err) => {
        if (err.error.error === 'same password' && err.error.code === 401) {
          this.showBigSpinner = false;
          this.showSpinner = false;
          this.spinner.hide();
          this.erreuur = true;
          setTimeout(() => {
            this.erreuur = false;
          }, 3000);
        }
        //  else if (
        //   err.error.error === 'Wallet already exist' &&
        //   err.error.code === 401
        // ) {
        //   this.router.navigate(['auth/login']);
        //   this.showBigSpinner = false;
        //   this.showSpinner = false;
        //   this.spinner.hide();
        // }
        else {
          //  this.router.navigate(['auth/login']);
          this.showBigSpinner = false;
          this.showSpinner = false;
          this.spinner.hide();
        }
      }
    );
    // this.authService
    //   .checkPass({ password })
    //   .pipe(
    //     mergeMap((data: any) => {
    //       this.spinner.show();
    //       this.showBigSpinner = true;
    //       if (data.message) {
    //         return this.walletFacade.createPasswordWallet(
    //           this.f.password.value
    //         );
    //       } else if (data.error === 'same password') {
    //         /*console.log("error same password")*/
    //         /*this.toastr.error("error same password");*/
    //         this.showBigSpinner = false;
    //         this.showSpinner = false;
    //         this.spinner.hide();
    //         this.erreuur = true;
    //         setTimeout(() => {
    //           this.erreuur = false;
    //         }, 3000);
    //       } else {
    //         this.router.navigate(['auth/login']);
    //         this.showBigSpinner = false;
    //         this.showSpinner = false;
    //         this.spinner.hide();
    //       }
    //       return of(null);
    //     })
    //   )
    //   .pipe(
    //     filter((res) => res !== null),
    //     takeUntil(this.onDestoy$)
    //   )
    //   .subscribe(
    //     (data: any) => {
    //       this.tokenStorageService.saveIdWallet(data.address);
    //       this.tokenStorageService.setSecureWallet('visited-pwd', 'true');
    //       this.router.navigate(['social-registration/pass-phrase']);
    //       this.showBigSpinner = false;
    //       this.spinner.hide();
    //       this.showSpinner = false;
    //     },
    //     () => {
    //       this.showSpinner = true;
    //     }
    //   );
  }
  // getSecure(){
  //   if (this.tokenStorageService.getItem('secure')) {
  //     this.visited == false;
  //     this.tokenStorageService.removeItem('secure')
  //   }

  // }
}
