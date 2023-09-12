/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ElementRef,
  ViewChild,
  TemplateRef,
  HostListener,
  Inject
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Editor } from 'ngx-editor';
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
  first,
  map,
  mergeMap,
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
import { DOCUMENT } from '@angular/common';
import { CampaignsStoreService } from '@app/campaigns/services/campaigns-store.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { IApiResponse } from '@app/core/types/rest-api-responses';
import { ICampaignResponse } from '@app/core/campaigns-list-response.interface';
import { environment } from '@environments/environment';
import { DraftMaximumParticipationComponent} from '../draft-maximum-participation/draft-maximum-participation.component';
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
  scrolling = false;
  inTop = true;
  @Input() cryptoSatt: any;
  @Input() validFormMissionFromRemuToEdit: any;
  @Input() validFormPresentation: any;
  @Input() validFormPicture: any;
  @Input() validFormParam: any;
  @Input() validFormBudgetRemun: any;
  @Input() selectedYoutube: any;
  @Input() draftData!: Campaign;
  sendErrorToParam: any;
  sendErrorToPresentation: any;
  sendErrorToBudgetRemun: any;
  sendErrorToPicture: any;
  sendErrorToMissionRemu: any;
  alertRequired: boolean = false;
  @ViewChild('checkUserLegalKYCModal') checkUserLegalKYCModal!: ElementRef;
  @ViewChild('useDesktopModal', { static: false })
  useDesktopModal!: TemplateRef<any>;
  socialMediaType = ESocialMediaType;
  editor: any = new Editor();
  step: any = 1;
  forthFormGroup: UntypedFormGroup;
  cryptodata: any;
  cryptoListLoading: boolean = true;
  passForm: UntypedFormGroup;
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
  checked: boolean = false;
  isLoading = true;
  constructor(
    
    private _formBuilder: UntypedFormBuilder,
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
    private walletFacade: WalletFacadeService,
    @Inject(DOCUMENT) private document: Document,
    private campaignsHttpService: CampaignHttpApiService,
    private campaignsStore: CampaignsStoreService,
    private localeStorageService: TokenStorageService
  ) {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        map((response: any) => response.data),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((data: any) => {
        this.cryptodata = data;
        this.cryptoListLoading = false;
        
      });
    this.passForm = new UntypedFormGroup(
      {
        password: new UntypedFormControl(null)
      },
      {}
    );
    this.forthFormGroup = this._formBuilder.group({
      accepted: [''],
      genre: [''],
      motivation: ['']
    });
  }
  expiredSession() {
    this.localeStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }
  getTronWallet() {
    this.walletFacade
          .getAllWallet()
          .subscribe((data: any) => {
            if(data.message === "success") {
             
                if (this.localeStorageService.getWalletVersion() === 'v2') {
                  this.localeStorageService.saveTronWallet(data.data.tronAddressV2);
                } else {
                  this.localeStorageService.saveTronWallet(data.data.tronAddress);
                }
            } 
          }, (err:any) => {
            this.walletFacade.verifyUserToken().pipe(first()).subscribe((res:any) => {
              if(res.message != "success") this.expiredSession();
            }); 
          });
  }


 

  ngOnInit() {
    this.getTronWallet();
    this.showModal = true;
    this.campaignsHttpService.scrolling.subscribe(() => {
      this.scrolling = true;
    });

    
    this.route.params.pipe(takeUntil(this.isDestroyed$)).subscribe((params) => {
      this.draftId = params['id'];
      this.draftStore.getDraft(this.draftId);
      this.getCampaignData();
    });
  }
  deleteCampaign(id: any) {
    this.campaignsStore
      .removeDraftCampaign(id)
      .pipe(
        mergeMap(() => {
          // this.deleted.emit(id);
          this.campaignListStoreService.getAllCampaigns(true, {});

          this.router
            .navigateByUrl('', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['home/ad-pools']);
            });
          return this.translate.get('campaign_details.deleted');
        })
      )
      .subscribe((data1: any) => {
        this.toastr.success(data1);
      });
  }

  checkValidation() {
    if (this.validFormParam === false) {
      this.sendErrorToParam = true;
    }

    if (this.validFormPresentation === false) {
      this.sendErrorToPresentation = true;
    }

    if (this.validFormBudgetRemun === false) {
      this.sendErrorToBudgetRemun = true;
    }

    if (this.validFormPicture === false) {
      this.sendErrorToPicture = true;
    }

    if (this.validFormMissionFromRemuToEdit === false) {
      this.sendErrorToMissionRemu = true;
    }
  }
  saveAndLaunchCampaign() {
      this.getCampaignData();
      this.checkValidation();
      if (
      this.validFormParam &&
      this.validFormPresentation &&
      this.validFormBudgetRemun &&
      this.validFormMissionFromRemuToEdit &&
      this.validFormPicture
    ) {
      
      this.alertRequired = false;
      this.router.navigate(['home/check-password'], {
        queryParams: { id: this.draftId, network: this.campaignData.currency.type }
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
    // this.router.navigate(['home/campaign/', this.draftId]);
    this.router.navigateByUrl('/home/campaign/'+this.draftId+'?mode=edit');

  }
  scrollToTop() {
    let span = this.document.getElementsByClassName('span-top');
    if (span.length > 0) {
      span[0].scrollIntoView({ behavior: 'smooth' });
    }
  }
  ngOnDestroy(): void {
    /*this.deleteCampaignIfNotFilled().subscribe(() => {
      this.campaignListStoreService.getAllCampaigns(true, {});
    });*/
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
      /* this._snackBar.open(
        'Not Saved!: Error sending request please try again!',
        'OK'
      );*/
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
  listenForMissionChange(event: any) {
    this.validFormMissionFromRemuToEdit = event;
  }
  listenForPictureChange(event: any) {
    this.validFormPicture = event;
  }
  // listenForMissionChange(event: any, type: string) {
  //   if (type === 'youtube') {
  //     this.sendToRemuSelectedYoutube = event;
  //   } else if (type === 'facebook') {
  //     this.sendToRemuSelectedFacebook = event;
  //   } else if (type === 'instagram') {
  //     this.sendToRemuSelectedInstagram = event;
  //   } else if (type === 'twitter') {
  //     this.sendToRemuSelectedTwitter = event;
  //   } else if (type === 'linkedin') {
  //     this.sendToRemuSelectedLinkedin = event;
  //   }
  // }

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
        map((c: IApiResponse<ICampaignResponse>) => {
          const campaign = new Campaign(c.data);
          campaign.ownedByUser =
            Number(campaign.ownerId) ===
            Number(this.localeStorageService.getIdUser());
          
          
          return campaign;
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((c: Campaign) => {
        if (!c.isOwnedByUser) {
          this.router.navigateByUrl('/ad-pools');
        }
        if (c.isOwnedByUser) {
          this.isLoading = false;
        }
        this.campaignData = c;
      });
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
    // rgrtrtg
  }
  ngAfterViewInit() {
    if (!this.showModal && window.innerWidth < 768) {
      this.isLoading = false;
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
    if (event.target.innerWidth < 768) {
      if (!this.showModal) {
        this.showModal = true;
        this.openModal(this.useDesktopModal);
      }
    } else {
      this.showModal = false;
      this.modalService.dismissAll(this.useDesktopModal);
    }
  }

  handleInputValueChange(value:any){
    console.log({value},this.campaignData)
    this.campaignData.limitParticipation = value;
  }
}
