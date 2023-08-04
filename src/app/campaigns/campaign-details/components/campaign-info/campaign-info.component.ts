import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
  Renderer2,
  AfterViewInit,
  TemplateRef
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { arrayCountries, ListTokens } from '@config/atn.config';
import { Editor } from 'ngx-editor';
import { WalletStoreService } from '@core/services/wallet-store.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { catchError, filter, map, mergeMap, takeUntil,tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import { Campaign } from '@app/models/campaign.model';
import { DomSanitizer } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { environment } from '@environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';
import { WindowRefService } from '@app/core/windowRefService';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { Big } from 'big.js';
import FileSaver from 'file-saver';
import { IGetSocialNetworksResponse } from '@user-settings/components/social-networks/social-networks.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignInfoComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() showSpinner: boolean = false;
  @Input() campaign = new Campaign();
  @Input() isOwnedByUser = false;
  @Input() kits: any[] = [];
  @Input() allProms: any;
  @Output() onRecoverEarningClick = new EventEmitter();
  @Output() showPasswordModal: EventEmitter<any> = new EventEmitter();
  @Input() id = '';
  @ViewChild('divUploadedFiles') divUploadedFiles: ElementRef | any;
  @ViewChildren('checkOracles') checkOracles?: ElementRef;
  @ViewChild('passwordModal', { static: true }) passwordModal?: ElementRef;
  @ViewChild('descWrapper', { static: false }) descWrapper!: ElementRef;
  @ViewChild('image', { static: false }) image!: ElementRef;
  @ViewChild('size', { static: false }) size!: ElementRef;
  @Input() listeningToDownloadFiles: boolean = false;

  @ViewChild('calculRoi', { static: false })
  private calculRoi!: TemplateRef<any>;
  kitsImages: any = [];
  titleTab: string = '';
  countriesListObj: any = arrayCountries;
  dropdownList: any;
  dropdownSettings: any;
  selectedAttributes: any;
  countriesValue: any;
  selectedfile: any;
  showMore: boolean = false;
  gainsEarnedInUsD: any;
  inputDescription = false;
  inputTime = false;
  inputBudget = false;
  inputTag = false;
  inputCountrie = false;
  inputOracle = false;
  inputKit = false;
  url: any;
  editor: any = new Editor();
  paramsSubscription: any;
  budgetModal: boolean = false;
  budgetform: UntypedFormGroup;
  sendform: UntypedFormGroup;
  sattBalancef: any;
  passwordBudget: boolean = false;
  etherInWei: any;
  errorMessage = '';
  earnings: any;
  totalInvested: Big = new Big(0);
  totalInvestedInUsD = new Observable<string>();
  passwordFormBudget: UntypedFormGroup;
  funds: any = { ERC20token: '', idCampaign: '', amount: 0, pass: '' };

  showEditBudget: boolean = false;

  isUpdateLoading: boolean = false;
  isBudgetFormSubmitting: boolean = false;
  isDescAndResumeSubmitting: boolean = false;
  isRatiosFormSubmitting: boolean = false;
  isOraclesPricesFormSubmitting: boolean = false;
  isCampaignDurationFormSubmitting: boolean = false;
  isTagsFormSubmitting: boolean = false;
  isCountriesFormSubmitting: boolean = false;
  isCampaignKitsFormSubmitting: boolean = false;
  linksLen: boolean = true;
  validationAttempt = false;
  walletPassword = '';
  budgetInUSD = new Observable<string>();
  navigationTab = 'info';
  activeInfo: boolean = true;
  gainrecolte: any;
  gainsEarned: Big = new Big('0');
  gainsToEarn: any = '0';
  zoomIn: boolean = true;
  zoomOut: boolean = false;
  firstscrol: boolean = false;
  secondscrol: boolean = false;
  thirdscrol: boolean = false;
  fourthscrol: boolean = false;
  fithscrol: boolean = false;
  firstscroldisable: boolean = false;
  secondscroldisable: boolean = false;
  thirdscroldisable: boolean = false;
  fourthscroldisable: boolean = false;
  fithscroldisable: boolean = false;
  campaignLen: boolean = true;
  newApplicant: boolean =false;
  lastLogin: any;
  followers = '';
  displayShowMoreLessButton: boolean = false;
  urlImage: any;
  activeTab: string = 'info';
  currencyName = '';
  idkit: any;
  tailleKit: any;
  dateKit: any;
  typeKit: any;
  largeur: any;
  longeur: any;
  pdf: String = 'assets/Images/img_satt/pdf-xs.png';
  pdfZoom = false;
  cryptoList$ = this.walletFacade.cryptoList$;
  isConnected: boolean = false;
  urlSmartContrat!: string;
  noTransactionHash!: boolean;
  // albums: any;
  albums: any[] = [];
  imgLoadedWidth: any;
  imgLoadedHeight: any;
  private isDestroyed$ = new Subject();
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;
  channelGoogle: any;
  channelTwitter: any;
  channelFacebook: any;
  channelInstagram: any;
  channelLinkedin: any;
  channelTikTok: any;
  arrayMission: Array<{ mission: string }>;
  showmoonboy: boolean = false;
  constructor(
    private clipboard: Clipboard,
    public router: Router,
    public CampaignService: CampaignHttpApiService,
    public modalService: NgbModal,
    private walletStore: WalletStoreService,
    private Fetchservice: CryptofetchServiceService,
    private convertFromWeiTo: ConvertFromWei,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private campaignsStoreService: CampaignsStoreService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private walletFacade: WalletFacadeService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private documentRef: any,
    private windowRefService: WindowRefService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private socialAccountFacadeService: SocialAccountFacadeService
  ) {
    this.arrayMission = [
      { mission: 'Citer la marque au moins 1 fois ' },
      { mission: 'Citer la marque au moins 2 fois ' }
    ];
    this.sendform = new UntypedFormGroup({
      url: new UntypedFormControl(null, Validators.required)
    });

    this.budgetform = new UntypedFormGroup({
      cost: new UntypedFormControl('', [
        Validators.required,
        this.checkIfEnoughBalance()
      ])
    });
    this.passwordFormBudget = new UntypedFormGroup({
      password: new UntypedFormControl(null, Validators.required)
    });
  }

  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
  }

  onChangeTab(tab: 'info' | 'gains' | 'stat') {
    if (
      this.campaign.isOwnedByUser ||
      (!this.campaign.isOwnedByUser && this.earnings && this.earnings.length)
    ) {
      this.navigationTab = tab;
      if (tab === 'info') {
        this.activeInfo = true;
        this.activeTab = 'info';
        this.router.navigate([], {
          relativeTo: this.activatedRoute
        });
      } else if (tab === 'gains') {
        this.activeInfo = false;
        this.activeTab = 'gains';
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { type: 'earnings' }
        });
      } else {
        this.activeInfo = false;
        this.activeTab = 'stat';
      }
    }
  }

  recoverEarningClick(e: any) {
    this.onRecoverEarningClick.emit(e);
  }

  dataURLToBlob(dataURL: any) {
    var BASE64_MARKER = ';base64,';
    if (
      dataURL.indexOf(BASE64_MARKER) === -1 &&
      isPlatformBrowser(this.platformId)
    ) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
  openModalZoomIn(url: any, i: any , id:any) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
          element = document.getElementsByClassName('modal-backdrop')[0]
          if(!!element){
            element.parentElement.removeChild(element);
          }
      }, 100)
      this.urlImage = url;
      this.idkit = id;
      var size = null;
      var width = null;
      var height = null;

      var img = this.documentRef.createElement('img');
      var blob = this.urlImage.changingThisBreaksApplicationSecurity;
      img.src = blob;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', blob, true);
      xhr.responseType = 'blob';
      xhr.onload = (e: any) => {
        if (e.target.status === 200) {
          if (e.target.response.type === 'application/pdf') {
            var element = this.documentRef.getElementById('img-reader');
            element.style.display = 'none';
            var element = this.documentRef.getElementById('pdf-reader');
            element.style.display = 'block';
            element.data = url.changingThisBreaksApplicationSecurity;
          } else {
            var element = this.documentRef.getElementById('pdf-reader');
            element.style.display = 'none';
            var element = this.documentRef.getElementById('img-reader');
            element.style.display = 'block';

            var myBlob = e.srcElement.response;
            size = (myBlob.size / 1000).toFixed(2) + ' Ko';
            var element = this.documentRef.getElementById('size');
            element.innerHTML = size;
            // myBlob is now the blob that the object URL pointed to.
          }
        }
      };
      xhr.send();
      width = img.naturalWidth;
      height = img.naturalHeight;
      var element = this.documentRef.getElementById('largeur');
      element.innerHTML = width + 'x' + height;
      this.dateKit = this.kits[i].uploadDate;
      this.typeKit = this.kits[i].type;
    }
  }
  get sanitizedDescription() {
    return this.sanitizer.bypassSecurityTrustHtml(this.campaign.description);
  }

  ngAfterViewInit() {
    this.displayShowMoreLessButton =
      this.descWrapper?.nativeElement.offsetHeight > 250;
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
      
    this.CampaignService.stat.subscribe((res) => {
      if (res === true) {
        this.navigationTab = 'stat';

        this.activeInfo = false;
        this.activeTab = 'stat';
        this.cdRef.detectChanges();
      } else {
      }
    });

    setTimeout(() => {
      this.showmoonboy = true;
    }, 1000);

    this.getSocialNetwork();
    if (isPlatformBrowser(this.platformId)) {
      if (this.tokenStorageService.getToken()) {
        this.isConnected = true;
      } else {
        this.isConnected = false;
      }
    }
    //this.getUrlSmartContart();
    this.currencyName = this.campaign.currency.name;
    if (this.currencyName === 'SATTBEP20') {
      this.currencyName = 'SATT';
    }
    this.etherInWei = ListTokens[this.currencyName].decimals;
    this.titleTab = this.campaign.isOwnedByUser ? 'Links' : 'Gains';
    this.paramsSubscription = this.activatedRoute.queryParams
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((params) => {
        if (params.type === 'earnings') {
          this.activeInfo = false;
          this.activeTab = 'gains';
          this.navigationTab = 'gains';
          // this.showSpinner = true;
        }

        if (params['page'] === 'campaign') {
          this.navigationTab = 'gains';
          this.activeInfo = false;
        }
      });


    this.getStatEarnings();


    this.walletFacade.loadCryptoList();
    // .getCryptoPriceList()
    this.budgetInUSD = this.walletFacade
      // .getlistTokens()
      .getCryptoPriceList()
      .pipe(
        map(
          (res: any) =>
            res.data[
              ['SATTPOLYGON', 'SATTBEP20', 'SATTBTT'].includes(this.currencyName)
                ? 'SATT'
                : this.currencyName
            ]
        ),
        map((crypto: any) =>
          new Big(crypto.price + '')
            .times(
              this.convertFromWeiTo.transform(
                this.campaign.budget,
                this.currencyName,
                2
              )
            )
            .toFixed(2)
        )
      );

    this.countriesListObj = this.countriesListObj.sort(function (
      a: any,
      b: any
    ) {
      return a.name?.localeCompare(b.name);
    });

    this.dropdownList = this.countriesListObj?.map((elem: any, index: any) => {
      elem.item_text = elem.name;
      elem.item_id = index;
      return elem;
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: this.translate.instant('selectAll'),
      unSelectAllText: this.translate.instant('unSelectAll'),
      itemsShowLimit: 20,
      allowSearchFilter: true
    };

    let countriesValue: any = [];
    let allCOuntries = this.dropdownList;

    if (this.campaign.targetedCountries) {
      if (this.campaign.targetedCountries[0] === 'ALL') {
        countriesValue = this.dropdownList;
      }

      allCOuntries?.map((elem: any) => {
        for (let key in this.campaign.targetedCountries) {
          if (elem.name === this.campaign.targetedCountries[key]) {
            countriesValue.push(elem);
          }
        }
      });

      this.countriesValue = countriesValue;
    }

    this.budgetform
      .get('cost')
      ?.valueChanges.pipe(takeUntil(this.isDestroyed$))
      .subscribe((value) => {
        this.budgetform.patchValue(
          {
            cost: this.replaceNonAlphanumeric(value)
          },
          { emitEvent: false }
        );
      });
  }

  replaceNonAlphanumeric(value: string) {
    return value
      .replace(/[^0-9.]+/g, '')
      .replace(/^0+/, '')
      .replace(/^\.+/, '0.')
      .replace(/\./, 'x')
      .replace(/\./g, '')
      .replace(/x/, '.');
  }

  checkIfEnoughBalance(): ValidatorFn {
    return (control: AbstractControl) => {
      const currency = this.campaign.currency.name;
      const amount = !isNaN(control.value)
        ? new Big(control.value || 0)
        : new Big(0);
      const selectedCrypto = this.walletStore.walletBalance.find(
        (elem: any) => elem.symbol === currency
      );

      return amount.gt(selectedCrypto?.balance || 0)
        ? { notEnoughBalance: true }
        : null;
    };
  }

  openModal(content: any) {
    this.modalService.open(content);
    this.budgetModal = true;
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
    // $('#budgetform').trigger('reset');
    this.budgetform.reset();
  }

  caluculateRoi(id :any , event: any){
    event.stopPropagation();
    this.modalService.open(this.calculRoi);
    
  }

  ngOnChanges() {
    this.currencyName = this.campaign.currency.name;
    if (
      this.currencyName === 'SATTBEP20' ||
      this.currencyName === 'SATTPOLYGON'
    ) {
      this.currencyName = 'SATT';
    }
    this.etherInWei = ListTokens[this.currencyName].decimals;
    let countriesValue: any = [];
    let allCOuntries = this.dropdownList;
    this.getStatEarnings();
    if (this.campaign.targetedCountries) {
      if (this.campaign.targetedCountries[0] === 'ALL') {
        countriesValue = this.dropdownList;
      }

      allCOuntries?.map((elem: any) => {
        for (let key in this.campaign.targetedCountries) {
          if (elem.name === this.campaign.targetedCountries[key]) {
            countriesValue.push(elem);
          }
        }
      });

      this.countriesValue = countriesValue;
    }

    this.earnings = this.allProms;
    this.lastLogin=this.tokenStorageService.getLastLogin();
    this.newApplicant = this.allProms?.length >0 ? this.newbies(this.allProms): false;
   
    
    if (!this.campaign.isOwnedByUser && this.earnings?.length) {
      this.earnings.forEach((item: any) => {
        console.log(item)
        if (
          item.status &&
          ((item.payedAmount !== '0' || item.payedAmount !== '0.00') && item.payedAmount)
        ) {
          this.gainsEarned = new Big(this.gainsEarned).plus(
            new Big(item.payedAmount)
          );
          // this.gainsToEarn = new Big(this.gainsToEarn)
          // .plus(new Big(item.unPayed))
          // .toFixed();
        }
      });

      this.gainsEarned = new Big(this.gainsEarned).div(
        new Big(this.etherInWei)
      );

      this.gainsEarnedInUsD = this.walletFacade.getCryptoPriceList().pipe(
        map((response: any) => response.data),
        map((crypto: any) =>
          this.gainsEarned.times(crypto[this.currencyName].price).toFixed(2)
        )
      );
    }
    if (this.kits.length === 1) {
      this.firstscrol = true;
    }
    if (this.kits.length === 2) {
      this.firstscrol = true;

      this.secondscrol = true;
    }
    if (this.kits.length === 3) {
      this.firstscrol = true;
      this.secondscrol = true;
      this.thirdscrol = true;
    }
    if (this.kits.length === 4) {
      this.firstscrol = true;

      this.secondscrol = true;
      this.thirdscrol = true;
      this.fourthscrol = true;
    }
    if (this.kits.length === 5) {
      this.firstscrol = true;
    }
    if (this.countImages() > 3) {
      this.customOptions.loop = true;
    } else {
      this.customOptions.loop = false;
    }
    this.secondscrol = true;
    this.thirdscrol = true;
    this.fourthscrol = true;
    this.fithscrol = true;

    // if (this.listeningToDownloadFiles === true) {
    //   this.downloadFile();
    // }
    this.setImagesKits(this.kits);
  }

  setImagesKits(kits: any) {
    setTimeout(() => {
      this.kitsImages = kits.filter((kit: any) => !!kit.url);
      this.cdRef.markForCheck();
    }, 1000);
  }

  getStatEarnings(): void {
    this.totalInvested = new Big(this.campaign.initialBudget)
      .minus(this.campaign?.budget || '0')
      .div(this.etherInWei);

    this.totalInvestedInUsD = this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      map((crypto: any) =>
        this.totalInvested.times(crypto[this.currencyName].price).toFixed(2)
      )
    );
  }
  newbies(allProms :any){
   
    let newapp = false
    allProms.forEach((applicant: any)=>{
      let comparaison = this.lastLogin <= applicant.createdAt;
  
      newapp = comparaison? true: false
   
     
    
    })
 
    
    return newapp
    
    
  }

  /**
   * @name updateCampaignKits
   * @desc Update the campaign kits.
   */
  updateCampaignKits(): void {
    let kits = this.kits.slice();
    this.CampaignService.modifytKit(kits, this.campaign.id);

    this.inputKit = false;
  }

  /**
   * @name formatRatiosthis.earningsToObject
   * @desc Formats the ratios object to be ready for update in db.
   * @returns {[key: number]: string} the ratios object ready to be saved in the data base.
   */
  formatRatiosArrayToObject(): { [key: number]: {} | null } {
    let ratios: { [key: number]: {} | null } = {};
    this.campaign.ratios.forEach((ratio: any, index: number) => {
      ratios[index] = ratio
        ? {
            viewRatio: ratio?.viewRatio,
            likeRatio: ratio?.likeRatio,
            shareRatio: ratio?.shareRatio
          }
        : null;
    });
    return ratios;
  }

  /**
   * @name formatTagsArrayToObject
   * @desc Format the tags array to object to be saved in mongo db.
   * @returns {[key: number]: string} the formatted tags object.
   */
  formatTagsArrayToObject(): { [key: number]: string } {
    let tags: { [key: number]: string } = {};
    this.campaign.tags.forEach((tag: any, index: number) => {
      tags[index] = tag.value || tag;
    });
    return tags;
  }
  countImages() {
    let count = 0;
    let count2 = 0;
    let count3 = 0;
    for (let i = 0; i < this.kits.length; i++) {
      if (!this.kits[i].link) {
        count++;
      }
      if (this.kits[i].name != null) {
        count3++;
      }
      if (this.kits[i].url != null) {
        count2++;
      }
    }
    if (count2 > 0) {
      this.campaignLen = true;
    } else {
      this.campaignLen = false;
    }
    if (count3 > 0) {
      this.linksLen = true;
    } else {
      this.linksLen = false;
    }

    return count;
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.unsubscribe();
    //Add 'implements OnDestroy' to the class.
    // var a = this.documentRef.getElementById('ccloese');
    // a?.click();
    this.renderer.removeClass(this.documentRef.documentElement, 'modalZoom');

    this.countriesListObj = arrayCountries;

    this.dropdownList = this.countriesListObj?.map((elem: any, index: any) => {
      elem.name = elem.item_text;
      elem.item_id = index;
      elem.item_text = elem.item_text;
      return elem;
    });
  }

  closeBugdet() {
    this.budgetModal = false;
  }

  //TODO: method not used !!
  // fund(): void {
  // if (this.budgetform.valid) {
  // if (this.sattBalancef > this.budgetform.get('cost')?.value) {
  // this.passwordBudget = true

  // this.budgetModal = false
  // }
  // }
  // }
  onSubmit() {
    if (this.budgetform.valid) {
      this.modalService.open(this.passwordModal);
    }
  }

  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }

  checkPassword() {
    this.showPasswordModal.emit('');
  }
  goParticipate(id: any) {
    if ('isConnected') {
      this.router.navigate(['home/part', id]);
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoWidth: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 3,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: true
  };

  // zoomout(id: any) {
  // let kit = this.kits[id]._id;

  // var myImg = document.getElementById('imagekit' + id);
  // var width = myImg?.clientWidth;

  // //@ts-ignore
  // if (
  // myImg?.style.width === '450px' ||
  // myImg?.style.width === '360px' ||
  // myImg?.style.width === '293px' ||
  // myImg?.style.width === '276px'
  // ) {
  // //@ts-ignore
  // myImg.style.width = width - 200 + 'px';
  // //@ts-ignore

  // myImg.style.height = width - 200 + 'px';
  // //@ts-ignore
  // myImg.style.marginRight = '0px';
  // this.zoomIn = true;
  // this.zoomOut = false;
  // }
  // }
  downloadFile() {
    this.kits.forEach((kit: any) => {
      if (!kit.link) {
        let filetype = kit.type.split('/').pop();
        let fileName = `download.${filetype}`;

        let urlimg = kit?.url?.changingThisBreaksApplicationSecurity;
        FileSaver.saveAs(urlimg, fileName);
      }
    });
  }
  downloadOneFile(kitId: string) {


    let kit = this.kits.find((kit) => kit.id === kitId);

    if (!kit.link) {
      let filetype = kit.type.split('/').pop();
      let fileName = `download.${filetype}`;
      let urlimg = kit?.url?.changingThisBreaksApplicationSecurity;

      FileSaver.saveAs(urlimg, fileName);
    }
  }

  get localId(): string {
    return this.tokenStorageService.getLocale() || 'en';
  }
  /*getUrlSmartContart() {
    let bscan = environment.bscan;
    let etherscan = environment.etherscan;
    let polygonscan = environment.polygonscan;
    let bttscan = environment.bttscan;
    let tronscan = environment.tronScan;

    this.CampaignService.getOneById(this.campaign.id)
      .pipe(
        takeUntil(this.isDestroyed$),
        map((res: any) => res.data)
      )
      .subscribe((data: any) => {
        if (data['transactionHash'] === undefined) {
          this.noTransactionHash = true;
        } else {
          if (data['token']['type'] === 'ERC20') {
            this.urlSmartContrat = etherscan + data['transactionHash'];
          } else if (data['token']['type'] === 'BEP20') {
            this.urlSmartContrat = bscan + data['transactionHash'];
          } else if (data['token']['type'] === 'POLYGON') {
            this.urlSmartContrat = polygonscan + data['transactionHash'];
          }else if (data['token']['type'] === 'BTTC') {
            this.urlSmartContrat = bttscan + data['transactionHash'];
          }
          else if (data['token']['type'] === 'TRON') {
            this.urlSmartContrat = tronscan + data['transactionHash'];
          }

          if (isPlatformBrowser(this.platformId)) {
            this.windowRefService.nativeWindow.open(
              this.urlSmartContrat,
              '_blank'
            );
          }
        }
      });
  }*/


  closeRoi($event: any){
  
    
    if ($event){
      this.closeModal(this.calculRoi)
    }

  }
  getUrlSmartContart() {
    const scanUrls :any = {
      ERC20: environment.etherscan,
      BEP20: environment.bscan,
      POLYGON: environment.polygonscan,
      BTTC: environment.bttscan,
      TRON: environment.tronScan,
    };
  
    this.CampaignService.getOneById(this.campaign.id).pipe(
      takeUntil(this.isDestroyed$),
      map((res: any) => res.data),
      tap((data: any) => {
        const transactionHash = data?.transactionHash;
        const tokenType = data?.token?.type;
  
        if (!transactionHash) {
          this.noTransactionHash = true;
          return;
        }
  
        const urlSmartContrat  = scanUrls[tokenType] + transactionHash;
  
        if (isPlatformBrowser(this.platformId)) {
          this.windowRefService.nativeWindow.open(urlSmartContrat, '_blank');
        }
      })
    ).subscribe();
  }

  trackByBountie(index: any, bountie: any) {
    return bountie.oracle;
  }

  trackByCategories(index: any, categorie: any) {
    return categorie?.reward;
  }

  trackByCountrie(index: any, counrtrie: any) {
    return counrtrie;
  }

  trackByTag(index: any, tag: any) {
    return tag?.value;
  }
  trackByKitLink(index: any, kit: any) {
    return kit?.link;
  }
  getSocialNetwork(): void {

    this.socialAccount$
    .pipe(
      catchError(() => {
        return of(null);
      }),
      mergeMap((data) => {
        return this.route.queryParams.pipe(
          map((params) => {
            return { params, data };
          })
        );
      }),
    )
      .subscribe(

        ({
          data
        }: {
          params: Params;
          data: any;
        }) => {



          if (data !== null) {
            // let count = 0;
            this.channelGoogle = data.google;
            this.channelTwitter = data.twitter;
            this.channelFacebook = data.facebook;
            this.channelLinkedin = data.linkedin;
            this.channelTikTok = data.tikTok;


          }
          else {

            this.channelGoogle = [];
            this.channelTwitter = [];
            this.channelFacebook = [];
            this.channelLinkedin = [];
            this.channelTikTok = [];

          }
        }
      );
  }
  /*getSocialNetwork() {
    this.socialAccount$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data: any) => {
        if (data !== null) {
          this.channelGoogle = data.google;
          this.channelTwitter = data.twitter;
          this.channelLinkedin = data.linkedin;
          if (data.facebook.length !== 0) {
            data.facebook.forEach((ch: any) => {
              if (ch.facebook) this.channelFacebook = ch.facebook;
              if (ch.instagram) this.channelInstagram = ch.instagram;
            });
          } else {
            this.channelInstagram = [];
            this.channelFacebook = [];
          }
        } else {
          this.channelFacebook = [];
          this.channelLinkedin = [];
          this.channelGoogle = [];
          this.channelTwitter = [];
          this.channelInstagram = [];
        }
      });
  }*/
  linkAccount() {
    this.router.navigate(['/settings/social-networks']);
  }

  campaignMissions(oracle: any) {
    if (
      this.campaign.missions.filter((res: any) => res.oracle === oracle)
        .length >= 0
    ) {
      //@ts-ignore
      return this.campaign.missions.filter(
        (res: any) => res.oracle === oracle
        //@ts-ignore
      )[0]?.sub_missions;
    } else {
      return [];
    }
  }
}
