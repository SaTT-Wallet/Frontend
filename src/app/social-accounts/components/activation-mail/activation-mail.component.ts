import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/User';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileSettingsFacadeService } from '@app/core/facades/profile-settings-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-activation-mail',
  templateUrl: './activation-mail.component.html',
  styleUrls: ['./activation-mail.component.scss']
})
export class ActivationMailComponent implements OnInit {
  formCode: UntypedFormGroup;
  formL: UntypedFormGroup;
  errorMessagecode = '';
  successMsg = '';
  user!: User;
  codesms: boolean = false;
  codeTimer: boolean = false;
  // idInterval: any = 0;
  timeLeft: number = 60;
  countDown: any;
  email: any;
  codeData: any;
  userId: any;
  private account$ = this.accountFacadeService.account$;
  private isDestroyed = new Subject();

  constructor(
    private accountFacadeService: AccountFacadeService,
    private authService: AuthService,
    public translate: TranslateService,
    public router: Router,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private profileSettingsFacade: ProfileSettingsFacadeService
  ) {
    (this.formCode = new UntypedFormGroup({
      code: new UntypedFormControl(null, [Validators.required])
    })),
      (this.formL = new UntypedFormGroup({
        email: new UntypedFormControl(null, [Validators.required, Validators.email])
      }));
  }

  ngOnInit(): void {
    this.email = this.getEmail();
    this.account$
      .pipe(
        filter((res) => res !== null)
        // takeUntil(this.onDestoy$)
      )
      .subscribe((profile) => {
        this.userId = profile?.idUser;
      });
  }

  onCodeCompleted(code: string) {
    // console.log(code);
    this.formCode.get('code')?.setValue(code);
    this.verifyCode();
  }

  verifyCode() {
    this.successMsg = '';
    let code = this.formCode.get('code')?.value;
    //console.log(code);
    let email = this.email.toLowerCase();
    let type = 'validation';
    this.authService
      .confirmCode(email, code, type)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(
        (data: any) => {
          if (data.message === 'code is matched' && data.code === 200) {
            this.codesms = true;
            this.errorMessagecode = 'code correct';
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
            // this.formCode.reset();
            //  this.codeInput.reset();
            this.codesms = false;
            // setTimeout(() => {
            //   this.errorMessagecode = "";
            // }, 2000);
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
  confirmCode() {
    let data_profile = {
      new: true,
      enabled: 1
    };
    this.profileSettingsFacade
      .updateProfile(data_profile)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response: any) => {
        if (response.message === 'profile updated') {
          this.accountFacadeService.dispatchUpdatedAccount();
          this.tokenStorageService.setEnabled('1');
          this.tokenStorageService.setSecureWallet(
            'visited-completeProfile',
            'true'
          );
          this.tokenStorageService.setIdUser(this.userId);

          setTimeout(() => {
            this.router.navigateByUrl('/social-registration/monetize-facebook');
            this.errorMessagecode = '';
          }, 1000);
        }

        // route to next page
      });
    // if (this.codeData.message == "code incorrect") {
    //   this.errorMessagecode = "code incorrect";
    //   this.formCode.reset();
    //   //  this.codeInput.reset();

    //   setTimeout(() => {
    //     this.errorMessagecode = "";
    //   }, 2000);
    // } else if (this.codeData.message == "code match") {
    //   this.errorMessagecode = "code correct";
    //   this.tokenStorageService.setSecureWallet("visited-completeProfile", "true");
    //    this.router.navigateByUrl("/social-registration/monetize-facebook");
    // }
  }

  // confirmCode() {

  // this.ProfileService.updateprofile(update).subscribe((response:any)=>{
  //   if(response.success== "updated"){
  //     this.tokenStorageService.setSecureWallet("visited-completeProfile", "true");
  //     this.router.navigateByUrl("/social-registration/monetize-facebook");
  //      this.tokenStorageService.setItem("enabled",'1');
  //   }
  // })

  //   }

  getEmail() {
    const a = this.route.snapshot.queryParamMap.get('email');
    return a;
    // console.log(this.email);
  }

  resendCode() {
    //  console.log(this.email, "email");
    this.authService
      .sendConfirmationMail(this.email)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(
        (response: any) => {
          if (response.message === 'Email sent' && response.code === 200) {
            this.successMsg = 'Email sent';
            // this.errorMessagecode = '';
            this.errorMessagecode = 'Email sent';
            this.codesms = false;
            this.formCode.reset();
          }
          // this.idInterval = setInterval(() => {
          //   console.log('heeere!!!')
          //   this.codesms = true
          // }, 5000)

          this.codeTimer = true;
          setTimeout(() => {
            // console.log("can't resend before 15 seconds!")
            this.codeTimer = false;
          }, 60000);

          var timer = setInterval(() => {
            // this.codeTimer = false;
            if (this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              this.timeLeft = 60;
              clearInterval(timer)
            }
          }, 1000);

          // //120 Seconds timer...
          // var timeleft = 120;
          // var countDown
          // setInterval(() => {
          //   if (timeleft <= 0) {
          //     clearInterval(timeleft);
          //     // document.getElementById("countdown").innerHTML = "Finished";
          //     countDown = "Finished"
          //   } else {
          //     countDown = timeleft + " seconds remaining";
          //   }
          //   timeleft -= 1;
          // }, 1000);

        },
        (err) => {
          this.successMsg = '';
          if (err.error.error === 'user not found' && err.error.code === 404) {
            this.errorMessagecode = 'user not found';
          }
        }
      );
  }


  // startTimer() {
  //   var timer = setInterval(() => {
  //     if (this.timeLeft > 1) {
  //       this.timeLeft--;
  //     } else {
  //       this.timeLeft = 5;
  //       clearInterval(timer)
  //     }
  //   }, 1000);
  // }

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
    // if (this.idInterval) {
    //   clearInterval(this.idInterval);
    // }
  }
}
