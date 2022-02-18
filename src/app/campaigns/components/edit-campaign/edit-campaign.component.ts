import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  TemplateRef,
  HostListener,
  AfterContentChecked
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { arrayCountries } from '@config/atn.config';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import { DraftCampaignStoreService } from '@core/services/draft-campaign-store.service';
import { Campaign } from '@app/models/campaign.model';
import {
  concatMap,
  filter,
  map,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';
import { WalletStoreService } from '@core/services/wallet-store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilesService } from '@core/services/files/files.Service';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { ESocialMediaType } from '@app/core/enums';

enum FormStatus {
  Saving = 'saving',
  Saved = 'saved',
  Idle = '',
  Error = 'error'
}
@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: [
    './../../../styles/edit-campaign.styles.css',
    './edit-campaign.component.css'
  ],
  providers: [DraftCampaignService]
})
export class EditCampaignComponent implements OnInit, OnDestroy {
  @Input() cryptoSatt: any;
  @Input() validFormMission: any;
  @Input() validFormPresentation: any;
  @Input() validFormPicture: any;
  @Input() validFormParam: any;
  @Input() validFormBudgetRemun: any;
  @Output() notValidPresentation: EventEmitter<any> = new EventEmitter<any>();
  @Output() notValidParam: EventEmitter<any> = new EventEmitter<any>();
  @Output() notValidBudgetRemun: EventEmitter<any> = new EventEmitter<any>();
  @Output() notValidPicture: EventEmitter<any> = new EventEmitter<any>();

  sendErrorToParam: any;
  sendErrorToPresentation: any;
  sendErrorToBudgetRemun: any;
  sendErrorToPicture: any;

  alertRequired: boolean = false;
  @ViewChild('checkUserLegalKYCModal') checkUserLegalKYCModal!: ElementRef;
  @ViewChild('useDesktopModal', { static: false })
  useDesktopModal!: TemplateRef<any>;
  socialMediaType = ESocialMediaType;
  editor: any = new Editor();
  step: any = 1;
  forthFormGroup: FormGroup;
  cryptodata: any;
  passForm: FormGroup;
  kits: any = [];
  validpassword: boolean = false;
  selectedAttributes: any;
  checkDate: string = 'durée';
  isAcceptedImageFileType?: boolean;
  selectedCryptoSend: any;
  cryptoData: any;
  show: boolean = false;
  show2: boolean = true;
  draftId: string = '';
  campaignData = new Campaign();
  displayMode: string = ''; // = 'edit' if we access this component for edit mode.
  blockchainType: string = '';
  formSubmitAttempt: boolean = false;
  isDestroyed$: Subject<any> = new Subject<any>();
  campaignData$ = new Observable<Campaign>();
  showModal: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private CampaignService: CampaignHttpApiService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private fileService: FilesService,
    public modalService: NgbModal,
    private fetchservice: CryptofetchServiceService,
    private route: ActivatedRoute,
    private draftStore: DraftCampaignStoreService,
    private walletStore: WalletStoreService,
    private _snackBar: MatSnackBar,
    private campaignService: CampaignHttpApiService,
    private campaignListStoreService: CampaignsListStoreService,
    private walletFacade: WalletFacadeService
  ) {
    this.passForm = new FormGroup(
      {
        password: new FormControl(null)
      },
      {}
    );
    this.forthFormGroup = this._formBuilder.group({
      accepted: [''],
      genre: [''],
      motivation: ['']
    });
  }

  ngOnInit() {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data: any) => {
        this.cryptodata = data;
      });
    this.route.params.pipe(takeUntil(this.isDestroyed$)).subscribe((params) => {
      this.draftId = params['id'];
      this.draftStore.getDraft(this.draftId);
      this.getCampaignData();
    });
  }
  checkValidation() {
    if (this.validFormParam === false) {
      //this.notValidParam.emit(true);
      this.sendErrorToParam = true;
    }
    if (this.validFormPresentation === false) {
      //this.notValidPresentation.emit(true);
      this.sendErrorToPresentation = true;
    }
    if (this.validFormBudgetRemun === false) {
      //this.notValidBudgetRemun.emit(true);
      this.sendErrorToBudgetRemun = true;
    }
    if (this.validFormPicture === false) {
      //this.notValidPicture.emit(true);
      this.sendErrorToPicture = true;
    }
  }

  saveAndLaunchCampaign() {
    this.checkValidation();

    if (
      this.validFormParam &&
      this.validFormPresentation &&
      this.validFormBudgetRemun &&
      this.validFormMission &&
      this.sendErrorToPicture
    ) {
      this.alertRequired = false;
      this.router.navigate(['home/check-password'], {
        queryParams: { id: this.draftId }
      });
    } else {
      this.alertRequired = true;
    }
    /*================================================
     to activate legal KYC uncomment below api call
    =================================================*/
    // this.fileService
    //   .getListUserLegal()
    //   .pipe(
    //     map((data: any) =>
    //       Object.keys(data.legal).map((key) => ({
    //         value: data.legal[key],
    //       }))
    //     )
    //   )
    //   .subscribe((items) => {
    //     if (
    //       items.length > 1 &&
    //       items.reduce((acc: any, item: any) => {
    //         return acc && item.value["validate"] === true;
    //       }, true)
    //     ) {
    //       if (
    //         this.validFormParam &&
    //         this.validFormPresentation &&
    //         this.validFormBudgetRemun
    //       ) {
    //         this.alertRequired = false;
    //         this.router.navigate(["home/check-password"], {
    //           queryParams: { id: this.draftId },
    //         });
    //       } else {
    //         this.alertRequired = true;
    //       }
    //     } else {
    //       this.modalService.open(this.checkUserLegalKYCModal);
    //     }
    //   });
    /* ==================================================== */
  }
  goToView() {
    this.router.navigate(['home/campaign/', this.draftId]);
  }

  ngOnDestroy(): void {
    this.deleteCampaignIfNotFilled().subscribe(() => {
      this.campaignListStoreService.getAllCampaigns(true, {});
    });
    this.isDestroyed$.next('');
    this.isDestroyed$.unsubscribe();
  }

  onSaveDraftStatusChange(event: any) {
    // if (event === FormStatus.Saving) {
    //   this._snackBar.open(
    //     "The draft will be saved while you are typing...",
    //     "OK",
    //     {
    //       horizontalPosition: "center",
    //       verticalPosition: "top",
    //       panelClass: "my-custom-snackbar",
    //     }
    //   );
    // }

    // if (event === FormStatus.Saved) {
    //   this._snackBar.open("Your draft has been saved!", "OK", {
    //     horizontalPosition: "center",
    //     verticalPosition: "top",
    //     panelClass: "my-custom-snackbar",
    //     duration: 3000,
    //   });
    // }

    if (event === FormStatus.Error) {
      this._snackBar.open(
        'Not Saved!: Error sending request please try again!',
        'OK'
      );
    }
  }

  listenForParamChange(event: any) {
    this.validFormParam = event;
  }

  listenForPresenationChange(event: any) {
    this.validFormPresentation = event;
  }

  listenForBudgetRemunChange(event: any) {
    this.validFormBudgetRemun = event;
  }
  listenForBudgetMissionChange(event: any) {
    this.validFormMission = event;
  }
  listenForPictureChange(event: any) {
    this.validFormPicture = event;
  }

  /**
   * Get campaign data.
   * @param id campaign identifier.
   */
  getCampaignData() {
    // this.campaignData$ = this.draftStore.draft$.pipe(
    //   filter((draft: Campaign) => draft._id !== ''),
    //   take(1)
    // );

    // this.draftStore.draft$
    // .pipe(
    //   filter((draft: Campaign) => draft._id !== ''),
    //   take(1)
    // )
    // .subscribe((draft) => {
    //   this.campaignData = { ...draft } as DraftCampaign;
    //   console.log('get campaign => ', draft)
    // });

    this.campaignService
      .getOneById(this.draftId)
      .pipe(
        map((c) => new Campaign(c)),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((c: Campaign) => (this.campaignData = c));
  }

  private deleteCampaignIfNotFilled() {
    return this.draftStore.draft$.pipe(
      switchMap((res) => {
        let campaign: Campaign = res;
        if (
          campaign.brand === '' &&
          campaign.walletId === '' &&
          campaign.description === '' &&
          campaign.title === '' &&
          campaign.status === '' &&
          campaign.urlPicUser === '' &&
          campaign.hash === null &&
          campaign.targetedCountries.length === 0 &&
          campaign.ratios.length === 0 &&
          campaign.bounties.length === 0 &&
          campaign.summary === '' &&
          campaign.shortLink === '' &&
          campaign.tags.length === 0 &&
          campaign.cover === '' &&
          campaign.logo === ''
        ) {
          return this.campaignService.deleteDraft(this.draftId);
        } else {
          return of(null);
        }
      })
    );
  }
  ngAfterViewInit() {
    if (window.innerWidth < 768) {
      this.showModal = true;
      this.openModal(this.useDesktopModal);
    }
  }
  openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
    //this.router.navigate(['/ad-pools']);
  }
  @HostListener('window:resize', ['$event'])
  onResizeWindow(event: any) {
    if (window.innerWidth < 768) {
      if (!this.showModal) {
        this.showModal = true;
        this.openModal(this.useDesktopModal);
      }
    } else {
      this.showModal = false;
      this.modalService.dismissAll(this.useDesktopModal);
    }
  }

  saveCampaign() {
    this.checkValidation();
    if (
      this.validFormParam &&
      this.validFormPresentation &&
      this.validFormMission
    ) {
      this.alertRequired = false;
      this.router.navigate(['/ad-pools']);
    } else {
      this.alertRequired = true;
    }
  }
}
