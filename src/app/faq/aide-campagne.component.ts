import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { pattEmail } from '@config/atn.config';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ContactService } from '@core/services/contact/contact.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-aide-campagne',
  templateUrl: './aide-campagne.component.html',
  styleUrls: ['./aide-campagne.component.css']
})
export class AideCampagneComponent implements OnInit, AfterViewInit {
  form: UntypedFormGroup;
  link: boolean = false;
  formSubmitAttempt: boolean = false;
  public show: boolean = false;
  public buttonName: any = 'Show';
  txtValue: string = '';
  term: any;
  event: any;
  confirmMail: any;
  active: string = '';
  taged: boolean = false;
  mySet = new Set();
  array: any = [];
  key!: any;
  currentLang!: string;
  searchText: any;
  isSubmited: boolean = false;
  showSpinner: boolean = false;
  glossaryShowen: boolean = false;
  toggled!: boolean;
  paramsSubscription: any;
  private isDestroyed = new Subject();

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    public modalService: NgbModal,
    private _changeDetectorRef: ChangeDetectorRef,
    private contact: ContactService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.form = new UntypedFormGroup({
      NameFAQ: new UntypedFormControl(null, Validators.required),
      emailFAQ: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern(pattEmail)
      ]),
      ObjetFAQ: new UntypedFormControl(
        null,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      MessageFAQ: new UntypedFormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.paramsSubscription = this.activatedRoute.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(
        (params) => {
          if (isPlatformBrowser(this.platformId)) {
            if (params['page'] === 'ad-pools') {
              this.show = !this.show;
              $('.item').hide();
              $('.compaignss').show();
              $('.ad_pools').hide();
            }
          }
        },
        () => {},
        () => {}
      );

    this.changeLang();

    this.route.fragment
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((fragment: string | null) => {
        if (isPlatformBrowser(this.platformId)) {
          if (fragment === 'faq16') {
            $('.item').hide();
            $('.ad_pools').show();
            $('.ad_poolsText').show();
            $('.ad_pools').on('click', () => {
              $('.ad_poolsText').toggle();
            });
          }
        }
      });
    this.route.fragment
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((fragment: string | null) => {
        if (isPlatformBrowser(this.platformId)) {
          if (fragment === 'support') {
            $('.item').hide();
            $('.HaveQ').show();
          }
        }
      });
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      let top = this.document.getElementById('top');
      if (top !== null) {
        top.scrollIntoView();
        top = null;
      }
    }
  }

  changeLang() {
    this.translate.onLangChange
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((event: LangChangeEvent) => {
        this.currentLang = event.lang;
        this._changeDetectorRef.detectChanges();
        this.translate.use(this.currentLang);
        // location.reload();
      });
  }

  checkTag() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.mySet.size > 0) {
        this.mySet.clear();
      }
    }
  }
  toggleSearchMobile() {
    this.show = !this.show;
  }
  scroll(el: HTMLElement) {
    if (isPlatformBrowser(this.platformId)) el.scrollIntoView();
  }
  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }
  sendMail() {
    if (this.form.valid) {
      this.showSpinner = true;
      let contentMail: any = {};
      contentMail.message = this.form.get('MessageFAQ')?.value;
      contentMail.name = this.form.get('NameFAQ')?.value;
      contentMail.email = this.form.get('emailFAQ')?.value;
      contentMail.subject = this.form.get('ObjetFAQ')?.value;
      this.contact
        .supportSaTT(contentMail)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe(() => {
          this.isSubmited = false;
          this.modalService.open(this.confirmMail);
          this.showSpinner = false;
        });
      this.showSpinner = true;
      this.form.reset();
    }
  }
  ///
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (isPlatformBrowser(this.platformId)) {
      this.key = event.key;
      if (this.key === 'Enter') {
        this.show = false;
      }
    }
  }

  closeAndShow0() {
    if (isPlatformBrowser(this.platformId)) {
      this.show = !this.show;
      $('.item').hide();
      $('.wallet').show();
    }
  }
  closeAndShow1() {
    if (isPlatformBrowser(this.platformId)) {
      this.show = !this.show;
      $('.item').hide();
      $('.account').show();
    }
  }
  closeAndShow2() {
    if (isPlatformBrowser(this.platformId)) {
      this.show = !this.show;
      $('.item').hide();
      $('.compaigns').show();
    }
  }
  closeAndShow3() {
    if (isPlatformBrowser(this.platformId)) {
      this.show = !this.show;
      $('.item').hide();
      $('.compaignss').show();
      $('.ad_pools').hide();
    }
  }
  closeAndShow4() {
    if (isPlatformBrowser(this.platformId)) {
      this.show = !this.show;
      $('.item').hide();
      $('.security').show();
    }
  }
  closeAndShow5() {
    if (isPlatformBrowser(this.platformId)) {
      this.glossaryShowen = true;
      this.show = !this.show;
      $('.item').hide();
      $('.opensource').show();
    }
  }

  search() {
    if (isPlatformBrowser(this.platformId)) {
      let value: any = $('#key').val()?.toString().toUpperCase();

      if (value !== '') {
        $('.item').each(function () {
          //@ts-ignore
          if ($(this).text().toUpperCase().search(value) > -1) {
            //@ts-ignore
            $(this).show();
          } else {
            //@ts-ignore
            $(this).hide();
          }
        });
      }
    }
  }

  // let result=$(".item:contains('"+ v +"')").show();
  // console.log(result)
  //if(valueM == ''){
  //location.reload();
  //}
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
