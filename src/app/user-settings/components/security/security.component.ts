import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '@app/models/User';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

// import * as $ from 'jquery';

import { AuthService } from '../../../core/services/Auth/auth.service';
import { MatchPasswordValidator } from '@helpers/form-validators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { pattPassword } from '@config/atn.config';

import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { catchError, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
enum ExportType {
  eth = 'export',
  btc = 'exportbtc',
  mnemo = 'printseed'
}
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit, OnDestroy {
  //@ViewChild('codeInput') codeInput !: CodeInputComponent;
  public code: any;
  public show: boolean = false;
  public showme: boolean = false;
  public buttonName: any = 'Show';
  public secret: any = '';

  eExportType = ExportType;
  exportType!: string;
  formL: FormGroup;
  form: FormGroup;
  formAuth: FormGroup;
  deleteForm: FormGroup;
  formQrCode: FormGroup;
  formCode: FormGroup;
  qrCode: any;
  desactivate: boolean = false;
  errorMsg = '';
  domicileValid!: boolean;
  identityValid!: boolean;
  formExportData: FormGroup;
  formExportDataBTC: FormGroup;
  agreeBox!: boolean;
  formExportDataSubmitted: boolean = false;
  formExportDataBTCSubmitted: boolean = false;
  formUpdatePassword: FormGroup;
  password: any;
  passwordWrong: string = '';
  user!: User;
  dataLegal: any;
  dataLegalIdentity: any;
  dataLegalDomicile: any;
  idSn: any;
  readonlyInput: boolean = true;
  showSpinner!: boolean;
  showSpinnerBTC!: boolean;
  showSpinnerETH!: boolean;
  selectedReasonName: string = '';

  reasonList: any;
  isSub = false;
  errorMessage = '';
  successMsg = '';
  showQrCode: boolean = false;
  is2FAactivated: boolean = false;
  private account$ = this.accountFacadeService.account$;
  private onDestroy$ = new Subject();
  kycPendingReject: boolean = false;
  constructor(
    private accountFacadeService: AccountFacadeService,
    private tokenStorageService: TokenStorageService,
    public modalService: NgbModal,
    private AuthService: AuthService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private authStoreService: AuthStoreService,
    private clipboard: Clipboard,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.reasonList = [
      { name: 'prb-use' },
      { name: 'want-delete_info' },
      { name: 'create-second-account' },
      { name: 'privacy-problem' },
      { name: 'not-satisfied-with-service' },
      { name: 'not-find-content-creators' },
      { name: 'not-find-advertisers-matching' },
      { name: 'other-reason' }
    ];

    this.formUpdatePassword = new FormGroup(
      {
        old_password: new FormControl(null, Validators.required),
        password: new FormControl(null, {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(pattPassword)
          ]
        }),
        confirmPassword: new FormControl(null, [Validators.required])
      },
      { validators: MatchPasswordValidator() }
    );

    this.formExportData = new FormGroup({
      password: new FormControl(null, Validators.required)
    });
    this.formExportDataBTC = new FormGroup({
      password: new FormControl(null, Validators.required)
    });

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.formAuth = new FormGroup({
      secretKey: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required)
    });
    this.formL = new FormGroup(
      {
        password: new FormControl(null, [Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required])
      },
      { validators: MatchPasswordValidator() }
    );

    this.deleteForm = new FormGroup({
      agreeBox: new FormControl(null, [Validators.required]),
      reason: new FormControl(null, [Validators.required])
    });
    this.formQrCode = new FormGroup({
      qrCode: new FormControl(''),
      is2FA: new FormControl('', [Validators.required])
    });
    this.formCode = new FormGroup({
      code: new FormControl(''),
      valid: new FormControl(false)
    });
  }
  selectedReason(name: any) {
    this.selectedReasonName = name;
    this.deleteForm.get('reason')?.setValue(name);
  }
  get formF() {
    return this.formL.controls;
  }

  ngOnInit(): void {
    this.getProfileDetails();
    this.formUpdatePassword.controls['password'].disable();
    this.formUpdatePassword.controls['confirmPassword'].disable();
    this.formUpdatePassword
      .get('old_password')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((values) => {
        if (values === '') {
          this.formUpdatePassword.get('password')?.reset();
          this.formUpdatePassword.controls['password'].disable();
          // $("#newPassword").removeAttr('disabled');
        } else {
          //$("#newPassword").attr('disabled', 'disabled')
          this.formUpdatePassword.controls['password'].enable();
        }
      });
    this.formUpdatePassword
      .get('password')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((values2) => {
        if (
          values2 === '' ||
          values2 == null ||
          this.formUpdatePassword.get('password')?.invalid
        ) {
          this.formUpdatePassword.get('confirmPassword')?.reset();
          this.formUpdatePassword.controls['confirmPassword'].disable();
        } else {
          this.formUpdatePassword.controls['confirmPassword'].enable();
        }
      });

    this.idSn = this.tokenStorageService.getTypeSN();

    this.getListUserLegal();

    // this.account$
    //   .pipe(
    //     filter((res) => res !== null),
    //     takeUntil(this.onDestroy$)
    //   )
    //   .pipe(map((res: any) => res.is2FA as boolean))
    //   .subscribe((is2FA) => {
    //     this.is2FAactivated = is2FA;
    //   });
  }
  getProfileDetails() {
    this.showSpinner = true;
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestroy$)
      )
      .subscribe((data: any) => {
        if (data) {
          this.is2FAactivated = data.is2FA as boolean;
          this.showSpinner = false;
          this.user = data;
          if (this.user.is2FA === true) {
            this.formQrCode.get('is2FA')?.setValue(true);
            this.showme = true;
            this.show = true;
            this.desactivate = false;
          } else {
            this.formQrCode.get('is2FA')?.setValue(false);
            this.showme = false;
          }
        }
      });
  }
  onCheckboxChange(event: any, form: any) {
    if (event.target.checked === false) {
      this.deleteForm.get(form)?.setValue('');
    }
  }
  trackById(index: number, reason: any) {
    return reason;
  }

  deleteAccount() {
    let obj = {
      reason: this.formL.get('reason')?.value,
      password: this.formL.get('password')?.value
    };

    if (!this.formL.valid) {
      this.isSub = true;
      setTimeout(() => {
        this.isSub = false;
      }, 1500);
    }
    // if (this.formL.get("password")?.value !== this.formL.get("confirmPass")?.value) {
    //   this.errorMsg = "password does not match";
    //   setTimeout(() => {
    //     this.errorMsg = ''
    //   }, 4000);
    // }

    if (this.formL.valid && this.deleteForm.valid) {
      this.profileSettingsFacade
        .deleteAccount(obj)
        .pipe(
          catchError((error: any) => {
            if (error.error.error === 'wrong password') {
              this.errorMsg = 'wrong_pass';
            }
            return of(null);
          }),
          takeUntil(this.onDestroy$)
        )
        .subscribe((response: any) => {
          if (response && response.message === 'account deleted') {
            this.tokenStorageService.signOut();
            if (isPlatformBrowser(this.platformId)) window.location.reload();
          }
        });
    }
  }
  openModal(content: any) {
    this.modalService.open(content);
    this.showSpinner = true;
  }
  openModalAndCheckBTC(exportModal: any, checkModal: any) {
    this.showSpinnerBTC = true;
    if (this.domicileValid && this.identityValid) {
      this.modalService.open(exportModal);
    } else {
      if (this.dataLegalIdentity && this.dataLegalDomicile) {
        this.kycPendingReject = true;
      } else {
        this.kycPendingReject = false;
      }
      this.modalService.open(checkModal);
    }
  }

  openModalAndCheckETH(exportModal: any, checkModal: any) {
    this.showSpinnerETH = true;
    if (this.domicileValid && this.identityValid) {
      this.modalService.open(exportModal);
    } else {
      if (this.dataLegalIdentity && this.dataLegalDomicile) {
        this.kycPendingReject = true;
      } else {
        this.kycPendingReject = false;
      }
      this.modalService.open(checkModal);
    }
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
    this.formExportData.reset();
    this.formExportDataBTC.reset();
    this.showSpinnerBTC = false;
    this.showSpinnerETH = false;
    this.showSpinner = false;
  }
  isValidPwdExport(controlName: any) {
    return (
      this.formExportData.get(controlName)?.invalid &&
      this.formExportData.get(controlName)?.touched
    );
  }
  isValidPwdExportBTC(controlName: any) {
    return (
      this.formExportDataBTC.get(controlName)?.invalid &&
      this.formExportDataBTC.get(controlName)?.touched
    );
  }

  isValid(controlName: any) {
    return (
      this.form.get(controlName)?.invalid && this.form.get(controlName)?.touched
    );
  }
  removeMessage() {
    this.passwordWrong = '';
    this.errorMsg = '';
  }
  updatePassword() {
    //this.showSpinner=true;

    let oldpass = this.formUpdatePassword.get('old_password')?.value;
    let newpass = this.formUpdatePassword.get('password')?.value;
    let id = this.user.idUser;
    if (this.formUpdatePassword.valid) {
      if (oldpass === newpass) {
        setTimeout(() => {
          this.passwordWrong = 'profile.newPass';
        }, 3000);
      } else {
        this.AuthService.updatePassword(oldpass, newpass, id)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            () => {
              this.showSpinner = false;

              //    if (data.error == "wrong password") {

              //     this.passwordWrong = "profile.old_pass_wrong";
              //   }else if (data.message == "changed"){

              //     let msg:string="";
              //     this.translate.get('profile.password_change').subscribe((data1:any)=> {
              //       msg=data1
              //     });
              //     this.toastr.success(msg);
              //     this.formUpdatePassword.reset()
              // this.ngOnInit()
              //   }
            },
            (error) => {
              if (error.error.text === '{error:"wrong password"}') {
                this.passwordWrong = 'profile.old_pass_wrong';
              } else if (error.error.text === '{message:"changed"}') {
                let msg: string = '';
                this.translate
                  .get('profile.password_change')
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data1: any) => {
                    msg = data1;
                  });
                this.toastr.success(msg);
                this.formUpdatePassword.reset();
                this.ngOnInit();
              }
            }
          );
      }
    }
  }
  get f() {
    return this.formExportData.controls;
  }
  get fBtc() {
    return this.formExportDataBTC.controls;
  }
  confirmExport(password: any) {
    this.showSpinner = true;
    //this.formExportData.reset()
    //this.formExportData.updateValueAndValidity();
    let fileName: string = '';
    if (this.exportType === this.eExportType.eth) {
      fileName = 'keystore.json';
    } else if (this.exportType === this.eExportType.btc) {
      fileName = 'wallet.bip38';
    } else if (this.exportType === this.eExportType.mnemo) {
      fileName = 'wallet.txt';
    }
    this.formExportDataSubmitted = true;
    if (this.formExportData.valid) {
      this.profileSettingsFacade
        .exportProfileData(password)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (res: any) => {
            // this.showSpinner = false;
            // if (res.error === 'Wrong password') {
            //   this.formExportData
            //     .get('password')
            //     ?.setErrors({ checkPassword: true });
            // } else {
            this.formExportDataSubmitted = false;
            const file = new Blob([JSON.stringify(res)], {
              type: 'application/octet-stream'
            });

            const href = URL.createObjectURL(file);
            const a = this.document.createElement('A');
            a.setAttribute('href', href);
            a.setAttribute('download', fileName);
            this.document.body.appendChild(a);
            a.click();
            this.document.body.removeChild(a);
            this.formExportData.reset();
            this.modalService.dismissAll();
            this.showSpinnerBTC = false;
            this.showSpinnerETH = false;
            // }
          },
          (err) => {
            if (
              err.error.error === 'Wrong password' &&
              err.error.code === 401
            ) {
              this.formExportData
                .get('password')
                ?.setErrors({ checkPassword: true });
            }
          }
        );
    }
  }
  confirmExportBTC(password: any) {
    this.showSpinner = true;
    //this.formExportData.reset()
    //this.formExportData.updateValueAndValidity();
    let fileName: string = '';

    fileName = 'wallet.bip38';
    this.formExportDataBTCSubmitted = true;
    if (this.formExportDataBTC.valid) {
      this.profileSettingsFacade
        .exportProfileDataBTC(password)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (res: any) => {
            if (res.message === 'success' && res.code === 200) {
              this.showSpinner = false;
              // if (res.error === 'Wrong password') {
              //   this.formExportDataBTC
              //     .get('password')
              //     ?.setErrors({ checkPassword: true });
              // } else {
              this.formExportDataBTCSubmitted = false;
              const file = new Blob([JSON.stringify(res)], {
                type: 'application/octet-stream'
              });

              const href = URL.createObjectURL(file);
              const a = this.document.createElement('A');
              a.setAttribute('href', href);
              a.setAttribute('download', fileName);
              this.document.body.appendChild(a);
              a.click();
              this.document.body.removeChild(a);
              this.formExportDataBTC.reset();
              this.modalService.dismissAll();
              this.showSpinnerBTC = false;
              this.showSpinnerETH = false;
              // }
            }
          },
          (err) => {
            if (
              err.error.error === 'Wrong password' &&
              err.error.code === 401
            ) {
              this.formExportDataBTC
                .get('password')
                ?.setErrors({ checkPassword: true });
            }
          }
        );
    }
  }
  getListUserLegal() {
    this.showSpinner = true;
    this.profileSettingsFacade
      .getListUserLegal()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (data: any) => {
          if (data !== null && data !== undefined) {
            // *ngIf="dataLegalDomicile.validate && dataLegalIdentity.validate == 'validate'"
            this.showSpinner = false;
            this.dataLegal = data.data.legal;
            this.dataLegal.forEach((item: any) => {
              switch (item.type) {
                case 'proofId':
                  this.dataLegalIdentity = item;
                  if (
                    this.dataLegalIdentity.validate &&
                    this.dataLegalIdentity.validate === true
                  ) {
                    this.identityValid = true;
                  } else {
                    this.identityValid = false;
                  }
                  break;
                case 'proofDomicile':
                  this.dataLegalDomicile = item;
                  if (
                    this.dataLegalDomicile.validate &&
                    this.dataLegalDomicile.validate === true
                  ) {
                    this.domicileValid = true;
                  } else {
                    this.domicileValid = false;
                  }
                  break;
              }
            });
          } else {
            this.domicileValid = false;
            this.identityValid = false;
          }
        },
        (error) => {
          throw new Error(error);
        }
      );
  }
  copyCode(secret: any) {
    this.clipboard.copy(secret);
  }

  // toggle() {
  //    let check=!this.formQrCode.get('is2FA')?.value;
  //   this.formQrCode.get('is2FA')?.setValue(check);
  //   this.generateQRCode();
  //   if(this.formQrCode.get('is2FA')?.value==false) {
  //         this.descativateQRCode();
  //         this.showQrCode=false
  //   } else {
  //
  //     this.show=!this.show;
  //   }

  // }

  onToggle2FAChange(event: any) {
    if (event) {

      this.formQrCode.reset();
      this.showQrCode = true;
      this.show = !this.show;
      this.account$
        .pipe(
          
          filter((res) => res !== null),
          takeUntil(this.onDestroy$),
          mergeMap((res: User | null) => {
            if (event) {

              return this.profileSettingsFacade.generateQRCode();
            }
            return of(null);
          })
        )
        .pipe(
          filter((res) => res !== null),

          takeUntil(this.onDestroy$)
        )
        .subscribe((data: any) => {
          this.qrCode = data.data.qrCode;
          if (this.qrCode !== '') {
            this.formQrCode.get('qrCode')?.setValue(this.qrCode);
            this.secret = data.data.secret;
          }
        });
    } else {
      this.desactivate = false;
      this.show = !this.show;
    }
  }
  // generateQRCode() {
  //   this.profileSettingsFacade.generateQRCode().subscribe((data: any) => {
  //     this.qrCode = data.qrCode;
  //     if (this.qrCode !== '') {
  //       this.formQrCode.get('qrCode')?.setValue(this.qrCode);
  //       this.secret = data.secret;
  //     }
  //   });
  // }

  listenForCodeChange(code: string) {
    this.formCode.get('code')?.setValue(code);
    this.verifyQRCode();
  }

  verifyQRCode() {
    let body = {
      code: this.formCode.get('code')?.value,
    };
    this.profileSettingsFacade
      .verifyQRCode(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        if (data.data.error || data.data.verifiedCode === false) {
          this.formCode.get('valid')?.setValue(false);
          this.errorMessage = 'code incorrect';
          this.successMsg = '';
          this.formCode.get('code')?.setValue('');
       
        }
        
        else {
          this.formCode.get('valid')?.setValue(true);
          this.successMsg = 'code correct';
           this.errorMessage = 'code correct';
        
   
    
       
      
         

        }
      },
      
      (error: any)=>{
        this.errorMessage = 'error';
      });
  }

  confirmUpdate(TWO_FA: any) {
    this.showSpinner = true;
    let trueCode = this.formCode.controls.valid.value;
    let update = {
      is2FA: TWO_FA
    };
    if (!trueCode) {
      return;
    }

    this.formCode.get('is2FA')?.setValue(TWO_FA);
    this.profileSettingsFacade
      .updateProfile(update)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        if (data.message === 'profile updated' && isPlatformBrowser(this.platformId)) {
          this.accountFacadeService.dispatchUpdatedAccount();
          // this.is2FAactivated = true && update.is2FA;
          this.formQrCode.reset();
          this.formCode.get('code')?.setValue('');
          this.formCode.reset();
          this.successMsg = '';
          this.errorMessage = '';
          let msg = '';
          this.show = false;
          this.showQrCode = false;
          this.showme = false;
          this.desactivate = false;
          var element = this.document.getElementById('collapse2fa');
          if (element) element.classList.remove('show');
          // if (TWO_FA) {
          //this.showme = true;
          //   this.showQrCode = false;
          // } else {
          //   this.showme = false;
          // this.desactivate = false;
          //  this.showQrCode = true;
          // }
          this.translate
            .get('update_profile')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((message: any) => {
              msg = message;
            });
          this.toastr.success(msg);
          //this.formCode.get('valid')?.setValue(false);
          //  this.ngOnInit();
        }
      });
  }
  ngOnDestroy() {
    this.onDestroy$.next('');
    this.onDestroy$.complete();

    this.modalService.dismissAll();
  }
}
