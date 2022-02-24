import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { sattUrl, pattEmail, pattPassword } from '@app/config/atn.config';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from '@core/services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/core/services/Auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from '@app/models/User';
import { DomSanitizer } from '@angular/platform-browser';
import { ContactMessageService } from '@core/services/contactmessage/contact-message.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { forkJoin, of, Subject } from 'rxjs';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})
export class CompleteProfileComponent implements OnInit, OnDestroy {
  completeProfileForm: FormGroup;
  show: boolean = false;
  languageSelected: string = 'en';
  duplicateEmail: boolean = false;
  user!: User;
  @ViewChild('confirmMailModal', { static: false })
  public confirmMailModal!: TemplateRef<any>;
  firstName: any;
  lastName: any;
  email: any;
  showBigSpinner: boolean = false;
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  constructor(
    private accountFacadeService: AccountFacadeService,
    public translate: TranslateService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    public contactmessage: ContactMessageService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.completeProfileForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(pattEmail)
      ]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    //  this.authStoreService.getAccount().subscribe();
    this.getProfilePic();
    //  this.validatedEmail()
  }

  get getControls() {
    return this.completeProfileForm.controls;
  }

  openModal(content: any) {
    this.modalService.open(content);
  }
  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

  getProfilePic() {
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: any) => {
        this.user = response;
        this.completeProfileForm.get('email')?.setValue(this.user.email);
        if (this.tokenStorageService.getTypeSN() !== '0') {
          this.firstName = response.firstName;
          this.lastName = response.lastName;
          this.email = response.email;
        }
      });
  }

  updateProfile() {
    // this.show = true;
    let data_profile = {
      firstName: this.completeProfileForm.get('firstName')?.value,
      lastName: this.completeProfileForm.get('lastName')?.value,
      email: this.completeProfileForm.get('email')?.value,
      completed: true
      //     password: this.completeProfileForm.get("password")?.value,
    };

    if (this.completeProfileForm.valid) {
      this.profileSettingsFacade
        .completeProfile(data_profile)
        .pipe(
          mergeMap((response: any) => {
            if (response.message === 'email already exists') {
              this.duplicateEmail = true;
            } else if (
              response.message === 'updated successfully with same email'
            ) {
              this.accountFacadeService.dispatchUpdatedAccount();
              let arrayOfObs = [];
              arrayOfObs.push(
                this.account$.pipe(
                  filter((res) => res !== null),
                  takeUntil(this.onDestoy$)
                )
              );
              arrayOfObs.push(
                this.authService.sendConfirmationMail(
                  this.completeProfileForm.get('email')?.value
                )
              );
              return forkJoin(arrayOfObs).pipe(
                map((res) => {
                  return { res, type: '1' };
                })
              );
            } else if (response.message === 'updated successfully') {
              this.accountFacadeService.dispatchUpdatedAccount();
              this.duplicateEmail = false;
              return this.authService
                .sendConfirmationMail(
                  this.completeProfileForm.get('email')?.value
                )
                .pipe(
                  map((res) => {
                    return { res, type: '2' };
                  })
                );
            }
            return of(null);
          })
        )
        .pipe(
          filter((res) => res !== null),
          takeUntil(this.onDestoy$)
        )
        .subscribe(({ res, type }: any) => {
          if (type === '1') {
            this.duplicateEmail = false;
            this.tokenStorageService.setSecureWallet(
              'visited-completeProfile',
              'true'
            );
            this.tokenStorageService.setEnabled('0');
            this.router.navigate(['social-registration/activation-mail'], {
              queryParams: {
                email: this.completeProfileForm.get('email')?.value
              }
            });
          } else if (type === '2') {
            if (res.message === 'Email sent') {
              this.tokenStorageService.setEnabled('0');
              this.tokenStorageService.setSecureWallet(
                'visited-completeProfile',
                'true'
              );
              this.router.navigate(['social-registration/activation-mail'], {
                queryParams: {
                  email: this.completeProfileForm.get('email')?.value
                }
              });
            }
          }
        });

      // .subscribe(
      //   (response: any) => {
      //     if (response.message === 'email already exists') {
      //       this.duplicateEmail = true;
      //     } else if (
      //       response.message === 'updated successfully with same email'
      //     ) {
      //       this.accountFacadeService.dispatchUpdatedAccount();
      //       this.account$
      //         .pipe(
      //           filter((res) => res !== null),
      //           takeUntil(this.onDestoy$)
      //         )
      //         .subscribe(() => {
      //           this.duplicateEmail = false;
      //           this.tokenStorageService.setSecureWallet(
      //             'visited-completeProfile',
      //             'true'
      //           );
      //         this.tokenStorageService.setEnabled('0');
      //           this.router.navigate(
      //             ['social-registration/activation-mail'],
      //             {
      //               queryParams: {
      //                 email: this.completeProfileForm.get('email')?.value
      //               }
      //             }
      //           );
      //         });
      //       this.authService
      //         .sendConfirmationMail(
      //           this.completeProfileForm.get('email')?.value
      //         )
      //         .subscribe();
      //     } else if (response.message === 'updated successfully') {
      //       this.accountFacadeService.dispatchUpdatedAccount();
      //       this.duplicateEmail = false;
      //       this.authService
      //         .sendConfirmationMail(
      //           this.completeProfileForm.get('email')?.value
      //         )
      //         .subscribe((resp: any) => {
      //           if (resp.message === 'Email sent') {
      //       this.tokenStorageService.setEnabled('0');
      //             this.tokenStorageService.setSecureWallet(
      //               'visited-completeProfile',
      //               'true'
      //             );
      //             this.router.navigate(
      //               ['social-registration/activation-mail'],
      //               {
      //                 queryParams: {
      //                   email: this.completeProfileForm.get('email')?.value
      //                 }
      //               }
      //             );
      //           }
      //           // this.openModal(this.confirmMailModal);
      //         });
      //     }
      //   },
      //   (err) => {}
      // );
    }
  }
  validatedEmail() {
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: any) => {
        if (response.enabled === true) {
          this.closeModal(this.confirmMailModal);
          this.router.navigate(['social-registration/password_wallet']);
        }
      });
  }
  goToLogin() {
    this.tokenStorageService.signOut();
    this.router.navigate(['auth/login']);
  }
  sendConfirmationMail() {
    let email = this.completeProfileForm.get('email')?.value;
    const link = `<span style="color:#4048FF" >${email}</span >`;
    this.authService
      .sendConfirmationMail(this.completeProfileForm.get('email')?.value)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((response) => {
        if (response) {
          if (this.languageSelected === 'fr') {
            Swal.fire({
              icon: 'success',
              html: `Un nouveau email de verification a été envoyé à l'adresse ${link}. Merci de verfier votre spam si vous puver pas le trouvez `
            }).then(() => {
              if (isPlatformBrowser(this.platformId))
                window.location.href = '/#/auth/login';
            });
          } else {
            Swal.fire({
              icon: 'success',
              html: `A new verification email has been sent to ${link}. please check your spam in case you can't find it.`
            }).then(() => {
              if (isPlatformBrowser(this.platformId))
                window.location.href = '/#/auth/login';
            });
          }
        }
      });
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
}
