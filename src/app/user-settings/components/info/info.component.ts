import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';

import { arrayCountries, pattEmail } from '@config/atn.config';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { User } from '@app/models/User';

import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';

import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@app/core/services/Auth/auth.service';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';

import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat
} from 'ngx-intl-tel-input';
import { Platform } from '@angular/cdk/platform';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
declare var $: any;
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  providers: [
    MatFormFieldModule,
    MatInputModule,
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: { month: '2-digit', day: '2-digit', year: 'numeric' }
        },
        display: {
          dateInput: { month: '2-digit', day: '2-digit', year: 'numeric' },
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'll',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class InfoComponent implements OnInit, OnDestroy {
  // @ViewChild('btn', { static: true }) button: ElementRef;

  div1: boolean = false;
  div2: boolean = false;
  white = '#C4C4C4';
  urlpic: any;
  years: string = 'years';
  imageChangedEvent: any = '';
  croppedDataUrl: any = '';
  srcFile: any;
  errorMessage = '';
  picName: string = '';
  formProfile: UntypedFormGroup;
  formUploadPic: UntypedFormGroup;
  formL: UntypedFormGroup;
  isSub = false;
  errorMessagePwd = '';
  isCollapsed: any = true;

  profile: any;
  user!: User;
  closeResult: string = '';
  urlPic: any;
  showSpinner!: boolean;
  birthday: any;
  selectedGenderValue: string = '';
  selectedLangValue: string = 'english';
  languageList: any;
  genderList: Array<{ name: string; value: string }>;
  languageSelected: string = 'en';
  newdate: any;
  countriesListObj: Array<{ code: string; name: string }>;
  selectedCountryValue: string = '';
  selectedCountryCode: string = '';
  duplicateEmail: boolean = false;
  percentProfil: any;
  maxBirth: any;
  isDirty: boolean = false;
  isSubmited: boolean = false;
  langSwiched: boolean = false;
  langchoosen: any;
  pic: any;
  picUserUpdated: boolean = false;
  formEmail: UntypedFormGroup;
  errorMsg!: string;
  emailInputShow: boolean = false;
  confirmEmailShow: boolean = false;
  conifrmed: boolean = false;
  confirmCodeShow: boolean = false;
  successmail: boolean = false;
  public code: any;

  message!: String;
  formCode: UntypedFormGroup;
  codesms: any;
  matcher = new MyErrorStateMatcher();
  valideDate: boolean = true;
  separateDialCode = false;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SearchCountryField = SearchCountryField;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CountryISO = CountryISO;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [];
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  constructor(
    private accountFacadeService: AccountFacadeService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    public platform: Platform,
    @Inject(DOCUMENT) private document: any,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    //  this.dateAdapter.setLocale('en-GB');//make f
    const countryList = arrayCountries;
    this.countriesListObj = countryList.sort(function (a: any, b: any) {
      return a.name?.localeCompare(b.name);
    });

    // pat="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
    this.newdate = new Date();
    translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocale()) {
      // @ts-ignore
      this.languageSelected = this.tokenStorageService.getLocalLang();
      translate.setDefaultLang(this.languageSelected);
    } else {
      this.tokenStorageService.setLocalLang('en');
      this.languageSelected = 'en';
      translate.setDefaultLang('en');
    }
    this.formL = new UntypedFormGroup({
      email: new UntypedFormControl(null, [Validators.required, Validators.email])
    });

    this.formProfile = new UntypedFormGroup({
      firstName: new UntypedFormControl(null, Validators.required),
      lastName: new UntypedFormControl(null, Validators.required),
      email: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern(pattEmail)
      ]),
      gender: new UntypedFormControl(),
      country: new UntypedFormControl(),
      phone: new UntypedFormControl(null, Validators.pattern('[- +()0-9]+')),
      address: new UntypedFormControl(),
      birthday: new UntypedFormControl(),
      zipCode: new UntypedFormControl(),
      city: new UntypedFormControl()
    }); //underEighteen()

    this.formEmail = new UntypedFormGroup({
      email: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern(pattEmail)
      ]),
      password: new UntypedFormControl(null, [Validators.required])
    });
    this.formCode = new UntypedFormGroup({
      code: new UntypedFormControl(null, [Validators.required])
    });

    this.formUploadPic = new UntypedFormGroup({
      file: new UntypedFormControl(null, Validators.required)
    });
    this.genderList = [
      { name: 'Profil.campaign_list.genre_masculin', value: 'male' },
      { name: 'Profil.campaign_list.genre_feminin', value: 'female' },
      { name: 'Profil.non-binaire', value: 'non-binaire' }
    ];
    this.languageList = [
      { name: 'frensh', value: 'english' },
      { name: 'english', value: 'english' }
    ];
  }
  switchLang(lang: string) {
    this.document.getElementById('content');
    this.tokenStorageService.removeLocalLang();
    this.tokenStorageService.setLocalLang(lang);
    this.languageSelected = lang;
    this.translate.use(lang);
    this.langSwiched = true;
    this.langchoosen = lang;
    if (isPlatformBrowser(this.platformId))
    window.open( environment.domainName + '/settings/edit', '_self');

  
   
  }
  selectedGender(gender: any) {
    this.isDirty = true;
    this.selectedGenderValue = gender;
    this.formProfile.get('gender')?.setValue(gender);
  }
  selectedLang(lang: any) {
    this.selectedLangValue = lang;
  }
  selectedCountry(name: string, codeCountry: string) {
    this.isDirty = true;
    this.formProfile.get('country')?.setValue(codeCountry);
    this.selectedCountryValue = name;
    this.selectedCountryCode = codeCountry;
  }
  removeError() {
    this.duplicateEmail = false;
  }
  ngOnInit(): void {
    this.getDetails();
    this.checkDateBirthday();
    this.listenToPressKeyOnCountrySelect();
  }
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  //get the date of 18 years ago from today
  checkDateBirthday() {
    let today: any = new Date();
    let thisYear = today.getFullYear();
    let maxYear = thisYear - 18;
    this.maxBirth = new Date(maxYear, 11, 31);
  }

  checkDate() {
    let dateSelected = this.formProfile.get('birthday')?.value;
    if (dateSelected.getTime() > this.maxBirth.getTime()) {
      this.valideDate = false;
    } else {
      this.valideDate = true;
    }
  }
  get formF() {
    return this.formL.controls;
  }
  submitEmail() {
    // this.isSubmited = true;
    if (this.formEmail.dirty) {
      // this.isDirty = false
      // this.showSpinner = false;
      let data_Email = {
        pass: this.formEmail.get('password')?.value,
        email: this.formEmail.get('email')?.value
      };
      this.profileSettingsFacade
        .updateEmail(data_Email)
        .pipe(takeUntil(this.onDestoy$))
        .subscribe(
          (response: any) => {
            if (response.code === 200) {
              this.accountFacadeService.dispatchUpdatedAccount();
              this.confirmCodeShow = true;
              this.emailInputShow = false;
              this.duplicateEmail = false;
            }
          },
          (err: any) => {
            if (
              err.error.error === 'wrong password' &&
              err.error.code === 406
            ) {
              this.errorMsg = 'Wrong Password';
              setTimeout(() => {
                this.errorMsg = '';
              }, 3000);
            } else if (
              err.error.error === 'duplicated email' &&
              err.error.code === 406
            ) {
              this.duplicateEmail = true;
              setTimeout(() => {
                this.duplicateEmail = false;
              }, 3000);
            }
          }
        );
    }
  }
  resetPassword() {
    this.isSub = true;
    let email = this.formL.get('email')?.value;
    const link = `<span style="color:#4048FF" >${email}</span >`;
    this.authService
      .resetPassword(email)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((data) => {
        if (data && data.message) {
          if (this.languageSelected === 'fr') {
            Swal.fire({
              icon: 'success',
              html: `Un nouveau mot de passe a été envoyé à l'adresse ${link}. Le lien va expiré après 48 heures`
            }).then(() => {
              if (isPlatformBrowser(this.platformId)) window.location.reload();
            });
          } else {
            Swal.fire({
              icon: 'success',
              html: `A new password has been sent to ${link}. the link will expire in 48 hours.`
            }).then(() => {
              if (isPlatformBrowser(this.platformId)) window.location.reload();
            });
          }
        }
      });
  }

  onCodeCompleted(code: string) {
    this.codesms = code;
    this.formCode.get('code')?.setValue(code);
  }
  confirmcode() {
    let msg: string = '';
    let codeNumber = Number(this.formCode.get('code')?.value);
    this.profileSettingsFacade
      .confirmChangeEmail(codeNumber)
      .pipe(
        takeUntil(this.onDestoy$)
        // catchError((error: HttpErrorResponse) => {
        //   if (
        //     error.error.error === 'code incorrect' &&
        //     error.error.code === '406'
        //   ) {
        //     this.formCode.get('code')?.setValue('');
        //     this.errorMsg = 'code incorrect';
        //     setTimeout(() => {
        //       this.errorMsg = '';
        //     }, 3000);
        //   }
        //   return of(null);
        // })
      )
      .subscribe(
        (res: any) => {
          if (res.message === 'email changed' && res.code === 200) {
            this.translate
              .get('update_profile')
              .pipe(takeUntil(this.onDestoy$))
              .subscribe((message: any) => {
                msg = message;
              });
            this.toastr.success(msg);
            this.confirmCodeShow = false;
            this.successmail = true;
            this.formProfile.patchValue({
              email: this.formEmail.get('email')?.value
            });
          }
        },
        (error: HttpErrorResponse) => {
          if (
            error.error.error === 'code incorrect' &&
            error.error.code === 406
          ) {
            this.formCode.get('code')?.setValue('');
            this.errorMsg = 'code incorrect';
            setTimeout(() => {
              this.errorMsg = '';
            }, 3000);
          }
          if (
            error.error.error === 'code expired' &&
            error.error.code === 401
          ) {
            this.formCode.get('code')?.setValue('');
            this.errorMsg = 'code expired';
            setTimeout(() => {
              this.errorMsg = '';
            }, 3000);
          }
        }
      );
  }
  get getControls() {
    return this.formEmail.controls;
  }
  showEmailInput() {
    this.emailInputShow = true;
    if (this.confirmCodeShow) {
      this.emailInputShow = false;
    }
  }
  verifyEmail() {
    this.conifrmed = true;
  }
  cancelFunction() {
    this.emailInputShow = false;
    this.formEmail.reset();
    if (this.confirmCodeShow === true) {
      this.confirmCodeShow = false;
    }
  }
  closeFunction() {
    this.formEmail.reset();

    if (this.successmail === true) {
      this.successmail = false;
    }
  }
  getDetails() {
    this.showSpinner = true;
    // this.account$
    //   .pipe(
    //     filter((res) => res !== null),
    //     takeUntil(this.onDestoy$)
    //   )
    //   .pipe(
    //     mergeMap((response: any) => {
    //       let countProfil = 0;
    //       if (response !== null && response !== undefined) {
    //         this.picUserUpdated = response.photoUpdated;
    //         this.pic = response.picLink;
    //         this.showSpinner = false;
    //         this.user = new User(response);

    //         this.urlpic = this.user.idUser;
    //         this.selectedGenderValue = this.user.gender;
    //         this.langchoosen = this.tokenStorageService.getLocalLang();
    //         this.formProfile.get('gender')?.setValue(this.user?.gender);
    //         this.formProfile.get('country')?.setValue(this.user?.country);
    //         arrayCountries.forEach((item) => {
    //           if (item.code === this.user.country) {
    //             this.selectedCountryValue = item.name;
    //           }
    //         });
    //         if (this.user.firstName && this.user.firstName !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.lastName && this.user.lastName !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.address && this.user.address !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.email && this.user.email !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.phone && this.user.phone !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.gender && this.user.gender !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.city && this.user.city !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.zipCode && this.user.zipCode !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.country && this.user.country !== '') {
    //           countProfil++;
    //         }
    //         if (this.user.birthday && this.user.birthday !== '') {
    //           countProfil++;
    //         }
    //         let stat = (countProfil * 100) / 10;
    //         this.percentProfil = stat.toFixed(0);
    //         // this.birthday = moment(this.user.birthday).format('DD-MM-YYYY')
    //         return this.profileSettingsFacade.profilePic$;
    //       }
    //       return of(null);
    //     })
    //   )
    //   .pipe(
    //     filter((res) => res !== null),
    //     takeUntil(this.onDestoy$)
    //   )
    //   .subscribe((profile: any) => {
    //     if (!!profile) {
    //       let objectURL = URL.createObjectURL(profile);
    //       if (this.user.idSn === 0) {
    //         this.user.userPicture =
    //           this.sanitizer.bypassSecurityTrustUrl(objectURL);
    //       }
    //       if (this.picUserUpdated && this.user.idSn !== 0) {
    //         this.user.userPicture =
    //           this.sanitizer.bypassSecurityTrustUrl(objectURL);
    //       }
    //     }

    //     if (this.user.picLink && !this.user.userPicture) {
    //       this.user.userPicture = this.user?.picLink;
    //     }
    //   });
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: any) => {
        let countProfil = 0;
        if (response !== null && response !== undefined) {
          this.picUserUpdated = response.photoUpdated;
          this.pic = response.picLink;
          this.showSpinner = false;
          this.user = new User(response);

          this.urlpic = this.user.idUser;
          this.selectedGenderValue = this.user.gender;
          this.langchoosen = this.tokenStorageService.getLocalLang();
          this.formProfile.get('gender')?.setValue(this.user?.gender);
          this.formProfile.get('country')?.setValue(this.user?.country);
          arrayCountries.forEach((item) => {
            if (item.code === this.user.country) {
              this.selectedCountryValue = item.name;
            }
          });
          if (this.user.firstName && this.user.firstName !== '') {
            countProfil++;
          }
          if (this.user.lastName && this.user.lastName !== '') {
            countProfil++;
          }
          if (this.user.address && this.user.address !== '') {
            countProfil++;
          }
          if (this.user.email && this.user.email !== '') {
            countProfil++;
          }
          if (this.user.phone && this.user.phone !== '') {
            countProfil++;
          }
          if (this.user.gender && this.user.gender !== '') {
            countProfil++;
          }
          if (this.user.city && this.user.city !== '') {
            countProfil++;
          }
          if (this.user.zipCode && this.user.zipCode !== '') {
            countProfil++;
          }
          if (this.user.country && this.user.country !== '') {
            countProfil++;
          }
          if (this.user.birthday && this.user.birthday !== '') {
            countProfil++;
          }
          let stat = (countProfil * 100) / 10;
          this.percentProfil = stat.toFixed(0);
          this.percentProfil = stat.toFixed(0);

          this.profileSettingsFacade.profilePic$.subscribe((blob: any) => {
            if (blob?.type === 'image/png') {
              let objectURL = URL.createObjectURL(blob);
              this.user.userPicture =
                this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);

              if (this.user.idSn === 0) {
                this.user.userPicture =
                  this.sanitizer.bypassSecurityTrustUrl(objectURL);
              }
              if (this.picUserUpdated && this.user.idSn !== 0) {
                this.user.userPicture =
                  this.sanitizer.bypassSecurityTrustUrl(objectURL);
              }
            } else if (this.user?.picLink && !this.user.userPicture) {
              this.user.userPicture = this.user?.picLink;
            } else if (blob?.type === 'application/json') {
              this.user.userPicture =
                'assets/Images/moonboy/Default_avatar_MoonBoy.png';
            }
          });
        }
      });
  }

  isValidFile(controlName: any) {
    return (
      this.formUploadPic.get(controlName)?.invalid &&
      this.formUploadPic.get(controlName)?.touched
    );
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.picName = this.imageChangedEvent.target.files[0].name;
  }

  uploadPic() {
    this.showSpinner = true;
    let msg: string = '';
    this.translate
      .get('pic_profile_success')
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((message: any) => {
        msg = message;
      });
    this.toastr.success(msg);
    this.formUploadPic.get('file')?.updateValueAndValidity();
    let image = this.srcFile;
    this.profileSettingsFacade
      .uploadPic(image)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((data: any) => {
        if (data) {
          this.showSpinner = false;
          // this.formUploadPic.reset();
          this.picName = '';
          this.modalService.dismissAll();
          this.user.userPicture = this.croppedDataUrl;
          this.profileSettingsFacade.loadUserProfilePic();
        }
      });
    if (this.user.photoUpdated === false) {
      let update = {
        photoUpdated: true
      };
      this.profileSettingsFacade
        .updateProfile(update)
        .pipe(takeUntil(this.onDestoy$))
        .subscribe(() => {
          this.user.photoUpdated = true;
          // this.accountFacadeService.dispatchUpdatedAccount();
          //   this.profileSettingsFacade.loadUserProfilePic();
        });
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedDataUrl = event.base64;
    this.srcFile = this.base64ToFile(event.base64, this.picName);
    return this.srcFile;
  }
  base64ToFile(file: any, filename: any) {
    const arr = file.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr?.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.dismissAll(content);
      $('#formUploadPic').trigger('reset');
      this.picName = '';
    }
  }

  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
  }

  updateProfile() {
    if (this.formProfile.dirty || this.isDirty || this.langSwiched) {
      this.showSpinner = true;

      setTimeout(() => {
        this.showSpinner = false;
      }, 1000);

      this.isSubmited = true;

      let data_profile = {
        firstName: this.formProfile.get('firstName')?.value,
        lastName: this.formProfile.get('lastName')?.value,
        email: this.formProfile.get('email')?.value,
        birthday: this.formProfile.get('birthday')?.value,
        phone: this.formProfile.get('phone')?.value,
        address: this.formProfile.get('address')?.value,
        zipCode: this.formProfile.get('zipCode')?.value,
        city: this.formProfile.get('city')?.value,
        country: this.formProfile.get('country')?.value,
        gender: this.formProfile.get('gender')?.value,
        locale: this.languageSelected
      };

      if (this.formProfile.valid) {
        this.tokenStorageService.setPhoneNumber(this.user.phone);
        // this.showSpinner = true;
        this.profileSettingsFacade
          .updateProfile(data_profile)
          .pipe(
            mergeMap((response: any) => {
              this.isDirty = false;
              // let msg: string = '';
              this.showSpinner = false;
              if (response.message === 'email already exists') {
                this.duplicateEmail = true;
                this.isSubmited = false;
                setTimeout(() => {
                  this.duplicateEmail = false;
                }, 3000);
                return of(null);
              } else {
                this.accountFacadeService.dispatchUpdatedAccount();
                this.duplicateEmail = false;
                this.isSubmited = false;
                if (this.user.onBoarding === false) {
                  this.router.navigate(['/home']);
                } else {
                  this.router.navigateByUrl('home/settings/profile');
                  this.isSubmited = false;
                  // this.ngOnInit();
                }

                return this.translate.get('update_profile');
              }
            })
          )
          .pipe(
            filter((res) => res !== null),
            takeUntil(this.onDestoy$)
          )
          .subscribe((message: any) => {
            this.toastr.success(message);
          });
      }
    }
  }

  private listenToPressKeyOnCountrySelect() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.document
          .getElementById('dropdown-ul')
          .addEventListener('keypress', (e: KeyboardEvent) => {
            //You have yout key code here
            let countriesList = this.countriesListObj.filter((country) => {
              if (country?.name[0] === e.key.toUpperCase()) {
                return true;
              } else {
                return false;
              }
            });
            if (countriesList.length > 0) {
              var element = this.document.getElementById(countriesList[0].code);

              var parent = element.parentElement;

              var topPos = element.offsetTop;

              parent.scrollTop = topPos;

              this.isDirty = true;
              this.formProfile.get('country')?.setValue(countriesList[0].code);
              this.selectedCountryValue = countriesList[0].name;
              this.selectedCountryCode = countriesList[0].code;
            }
          });
      }, 2000);
    }
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }

  trackByGenderName(index: any, gender: any) {
    return gender.name;
  }

  trackByLanguage(index: any, language: any) {
    return language;
  }

  trackByCountrie(index: any, c: any) {
    return c.code;
  }
}
