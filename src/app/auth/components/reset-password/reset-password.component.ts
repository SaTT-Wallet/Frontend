import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  HostListener,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatchPasswordValidator } from '@helpers/form-validators';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { ContactMessageService } from '@core/services/contactmessage/contact-message.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  // code:any
  // id:any
  // password:any
  // confirmPassword:any
  // PassError:any
  // isQueryParam:boolean=false
  // constructor(private ResetPassword_:AuthService ,private router:Router) { }
  // ngOnInit(): void {
  //   const url = window.location.href.split("?")[1];
  //   this.code=url?.split('&')[0].split("=")[1]
  //   this.id=url?.split('&')[1].split("=")[1]
  //   console.log('code',this.code)
  //  /* if(this.code !== undefined && this.id !== undefined){
  //   this.isQueryParam=true;
  //   }
  //   else{
  //     this.isQueryParam=false;
  //     this.router.navigate(['login'])
  //   }*/
  // }
  // PasswordChange(event:any){
  //     if(event.target.name=="password"){
  //        this.password=event.target.value
  //     }else{
  //       this.confirmPassword=event.target.value
  //    if(this.confirmPassword==this.password){
  //       this.PassError='correct'
  //    }else{
  //      this.PassError='false'
  //    }
  //    }
  // }

  // ResetPassword(){
  // if(this.PassError&&this.confirmPassword.length&&this.password.length){
  // this.ResetPassword_.confirmResetPassword({id:this.id,code:this.code,newpass:this.password}).subscribe((data:any)=>{
  //    console.log(data)
  // })
  // }
  // else if(!this.confirmPassword.length||!this.password.length){
  // this.PassError='empty'
  // }
  // }

  @ViewChild('sucessModal', { static: false })
  public sucessModal!: ElementRef;
  languageSelected: string = 'en';
  resetPasswordForm: FormGroup;
  showSpinner: boolean = false;
  mailFromUrl!: string;
  expireFromUrl!: number;
  isQueryParam: boolean = false;
  private onDestroy$ = new Subject();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public contactmessage: ContactMessageService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private tokenStorageService: TokenStorageService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
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
    this.resetPasswordForm = new FormGroup(
      {
        password: new FormControl(null, {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+./-])[A-Za-z\d@$!%*?&#+./-]{0,}/
            )
          ]
        }),
        confirmPassword: new FormControl(null, [Validators.required])
      },
      { validators: MatchPasswordValidator() }
    );
  }
  switchLang(lang: string) {
    this.tokenStorageService.removeLocalLang();
    this.tokenStorageService.setLocalLang(lang);
    this.languageSelected = lang;
    this.translate.use(lang);
  }

  ngOnInit() {}

  isOpen: boolean = false;
  openModal(content: TemplateRef<ElementRef>) {
    this.isOpen = true;
    this.modalService.open(content);
  }
  @HostListener('document:click', ['$event'])
  public documentOnClick() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isOpen === true) {
        this.router.navigate(['auth/login']);
      }
    }
  }
  closeModal(content: TemplateRef<ElementRef>) {
    this.modalService.dismissAll(content);
  }
  getParmsFromUrl() {
    if (isPlatformBrowser(this.platformId)) {
      const url = window.location.href.split('?')[1];

      this.mailFromUrl = url?.split('&')[0].split('=')[1];

      let expire = url?.split('&')[2].split('=')[1];
      this.expireFromUrl = parseInt(expire) * 1000;
      let dateNow = new Date().getTime();
      if (
        this.mailFromUrl !== undefined &&
        this.expireFromUrl !== undefined &&
        this.expireFromUrl > dateNow
      ) {
        this.isQueryParam = true;
      } else {
        this.isQueryParam = false;
        this.router.navigate(['auth/login']);
      }
    }
    /*this.route.queryParamMap.subscribe((params:any)=>{
      let location ={  ...params };
      console.log('params',location)
     this.codeFromUrl=location.params?.code;
     this.idFromUrl=location.params?.id;
     this.expireFromUrl=location.parms?.ex;
     console.log(this.expireFromUrl)
     let dateNow=Date.now();
     let calcule= this.expireFromUrl *100
     if(this.codeFromUrl !== undefined && this.idFromUrl!== undefined && this.expireFromUrl !== undefined)
      {
         this.isQueryParam=true;
     }
      else{
         this.isQueryParam=false;
      this.router.navigate(["login"]);

     }
  })*/
  }

  resetpwd() {
    return this.route.queryParams
      .pipe(
        mergeMap((email) => {
          email = email.email;
          this.showSpinner = true;
          if (this.resetPasswordForm.valid) {
            let data = {
              email: email,
              newpass: this.resetPasswordForm.get('password')?.value
            };
            return this.authService.confirmResetPassword(data);
          } else {
            return of(null);
          }
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestroy$)
      );
  }

  resetPasswordAndOpenSuccessModal(modalRef: TemplateRef<ElementRef>) {
    this.resetpwd().subscribe((response: any) => {
      if (response.message === 'successfully') this.openModal(modalRef);
    });
  }
  trackByLanguage(index: number, language: string) {
    return language;
  }

  redirectPassChanged() {
    this.router.navigate(['auth/login']);
  }
  ngOnDestroy() {
    this.onDestroy$.next('');
    this.onDestroy$.complete();
  }
}
