import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/User';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileSettingsFacadeService } from '@app/core/facades/profile-settings-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-activation-mail',
  templateUrl: './activation-mail.component.html',
  styleUrls: ['./activation-mail.component.scss']
})
export class ActivationMailComponent implements OnInit {
  formCode: FormGroup;
  formL: FormGroup;
  errorMessagecode = '';
  successMsg = '';
  user!: User;
  codesms: boolean = false;
  email: any;
  codeData: any;
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
    (this.formCode = new FormGroup({
      code: new FormControl(null, [Validators.required])
    })),
      (this.formL = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email])
      }));
  }

  ngOnInit(): void {
    this.email = this.getEmail();

    // this.resendCode()
  }

  onCodeCompleted(code: string) {
    // console.log(code);
    this.formCode.get('code')?.setValue(code);
    this.verifyCode();
  }

  verifyCode() {
    let code = this.formCode.get('code')?.value;
    //console.log(code);
    let email = this.email.toLowerCase();
    let type = 'validation';
    this.authService
      .confirmCode(email, code, type)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        //console.log(data.token);
        this.codeData = data;

        if (data.message === 'code incorrect') {
          this.errorMessagecode = 'code incorrect';
          // this.formCode.reset();
          //  this.codeInput.reset();
          this.codesms = false;
          // setTimeout(() => {
          //   this.errorMessagecode = "";
          // }, 2000);
        } else if (data.message === 'code match') {
          // console.log(data, '===>data');
          // this.accountFacadeService.dispatchUpdatedAccount();
          this.tokenStorageService.saveToken(data.token);
          this.tokenStorageService.saveExpire(data.expires_in);
          this.tokenStorageService.setItem('access_token', data.token);
          this.tokenStorageService.setIdUser(data.idUser);

          this.codesms = true;
          this.errorMessagecode = 'code correct';
        }
        //console.log(this.errorMessagecode);
      });
  }

  confirmCode() {
    this.tokenStorageService.setSecureWallet('visited-completeProfile', 'true');
    this.router.navigateByUrl('/social-registration/monetize-facebook');
    this.tokenStorageService.setEnabled('1');

    let data_profile = {
      new: true
    };

    this.profileSettingsFacade
      .updateProfile(data_profile)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.accountFacadeService.dispatchUpdatedAccount();
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
            this.errorMessagecode = '';
          }
          //  console.log(response, "response");
        },
        (err) => {
          this.successMsg = '';
          if (err.error.error === 'user not found' && err.error.code === 404) {
            this.errorMessagecode = 'user not found';
          }
        }
      );
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
