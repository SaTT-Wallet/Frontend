import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { forkJoin, Observable, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  first,
  map,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { GazConsumedByCampaign } from '@app/config/atn.config';
import { checkIfEnoughBalance } from '@helpers/form-validators';
import { Campaign } from '@app/models/campaign.model';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import {
  InitiaBudgetValidator,
  customValidateRequired,
  customValidateInsufficientBudget,
  customValidateBounties,
  customValidateRatios,
  customValidateMaxMin
} from '@helpers/form-validators';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { DOCUMENT } from '@angular/common';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignsService } from '@app/campaigns/facade/campaigns.facade';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { environment } from '@environments/environment';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

enum ERemunerationType {
  Publication = 'publication',
  Performance = 'performance'
}

interface IDropdownFilterOptions {
  value: string;
  text: string;
}
@Component({
  selector: 'app-remuneration',
  templateUrl: './remuneration.component.html',
  styleUrls: [
    './../../../styles/edit-campaign.styles.css',
    './remuneration.component.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemunerationComponent implements OnInit, OnDestroy {
  @ViewChild('inputAmountUsd') inputAmountUsd?: ElementRef;
  @Input() isSelectedYoutube = false;
  @Input() isSelectedTwitter = false;
  @Input() isSelectedFacebook = false;
  @Input() isSelectedInstagram = false;
  @Input() isSelectedThreads = false;
  @Input() isSelectedLinkedin = false;
  @Input() isSelectedTikTok = false;
  @Input() isSelectedGoogleAnalytics = false;
  @Input()
  id = '';
  @Input()
  draftData!: Campaign;
  @Input() notValidBudgetRemun: any;
  @Input() notValidMissionFromEdit: any;
  @Output() validFormBudgetRemun = new EventEmitter();
  @Output() validFormMissionFromRemuToEdit = new EventEmitter();
  @Input() cryptodata!: any;
 
  selectedToken: any;
  closedOracle: string = '';
  sendErrorToMission: any;
  totalBalanceExist: boolean = false;
  form = new UntypedFormGroup({
    ratios: new UntypedFormArray([], [Validators.required])
  });
  @ViewChild('initialBudgetElement')
  initialBudgetElement!: ElementRef<HTMLInputElement>;
  @ViewChild('initialBudgetInUSDElement')
  initialBudgetInUSDElement!: ElementRef<HTMLInputElement>;
  initialBudgetInputWidth$ = new Observable<string>();
  initialBudgetInUSDInputWidth$ = new Observable<string>();
  eRemunerationType = ERemunerationType; // A variable reference to access enum from template
  selectRemunerateValue = ERemunerationType.Performance;
  isReachLimitActivated = false;
  cryptoSymbol = 'SATT';
  selectedBlockchain = 'erc20';
  defaultAmount = 'SATT';
  validation = false;
  validationForm2 = false;
  balanceNotEnough: boolean = false;
  noCryptoSelected: boolean = false;
  isSubmitting!: boolean;
  showSelectedValue: any;
  selectedValue: any;
  selectedCrypto = 'SATT';
  cryptoQuantity: any = '';
  campaignCryptoList: any = [];
  cryptoList: any = [];
  dataList: any[] = [];
  selectedNetworkValue: string = 'ERC20';
  bnb: any;
  eth: any;
  checkType = 'erc20';
  showRetrySaveButtonOnError = new Observable();
  isDestroyed$ = new Subject<any>();
  gazsend: any;
  currency: any;
  bnbGaz: any;
  selectedCryptoDetails: any = '';
  openModalToken: boolean = false;
  network: string = '';
  token: any;
  amountUsd: any;
  amount: any;
  amountdefault: any;
  selectedCryptoSend: any;
  networks: any;
  decimals: any;
  symbol: any;
  coinType: boolean = false;
  gazcurrency: any;
  eRC20Gaz: any;
  gazsendether: any;
  bEPGaz: any;
  cryptoToDropdown: string = '';
  maxNumber: number = 999999999;
  gazproblem: boolean = false;
  newquantity: any;
  campaign$!: Observable<Campaign>;
  campaign: any;
  insufficientBalance: boolean = false;
  fieldRequired: boolean = false;

  remunerationOptions: IDropdownFilterOptions[] = [
    {
      text: this.eRemunerationType.Performance,
      value: this.eRemunerationType.Performance
    },
    {
      text: this.eRemunerationType.Publication,
      value: this.eRemunerationType.Publication
    }
  ];
  difference: any;
  matic: any;
  polygonGaz: any;
  btt: any;
  bttGaz: any;
  trx: any;
  trxGaz: any;
  res: any;

  selectedTokensNew: any[] = [];
  constructor(
    public modalService: NgbModal,
    private service: DraftCampaignService,
    private convertFromWeiTo: ConvertFromWei,
    private cdref: ChangeDetectorRef,
    private walletFacade: WalletFacadeService,
    private showNumbersRule: ShowNumbersRule,
    private renderer: Renderer2,
    private campaignService: CampaignHttpApiService,
    private tokenStorageService: TokenStorageService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
   
  
    this.form = new UntypedFormGroup(
      {
        initialBudget: new UntypedFormControl('', {
          validators: Validators.compose([
            Validators.required,
            Validators.pattern(/^([1-9]\d*|([1-9]\d*|0).\d+|[1-9]\d*(.\d+)?)$/)
          ])
        }),
        initialBudgetInUSD: new UntypedFormControl('', {
          validators: Validators.compose([Validators.required])
        }),
        currency: new UntypedFormControl(null, {
          validators: Validators.required
        }),
        remuneration: new UntypedFormControl(
          this.eRemunerationType.Performance
        ),
        ratios: new UntypedFormArray([]),
        bounties: new UntypedFormArray([])
      },
      {
        validators: [
          Validators.required,
          InitiaBudgetValidator,
          customValidateRequired(),
          customValidateInsufficientBudget()
        ],
        asyncValidators: [checkIfEnoughBalance(this.walletFacade)]
      }
    );
    this.showRetrySaveButtonOnError = this.service.saveStatus.pipe(
      filter((status) => status === 'error')
    );
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.unsubscribe();
  }

  closeTokenModal(content: any) {
    this.modalService.dismissAll(content);
  }

 
  

  ngOnInit(): void {
    this.cdref.markForCheck();
    this.parentFunction().subscribe();
    this.getUserCrypto();
    this.saveForm();
    


    this.campaignService.getOneById(this.draftData.id).subscribe((res: any) => {
      this.selectedNetworkValue = res.data.token.type;
     
        this.res = this.cryptodata;
        const campaignCryptoSet = new Set();
        for(const key of Object.keys(this.res)) {
          const cryptoData = this.res[key];
          if(typeof cryptoData.networkSupported !== 'string') {
            for(const value of cryptoData.networkSupported) {
              if (
                this.selectedNetworkValue === 'ERC20' &&
                value.platform.name === 'Ethereum'
                ) {
                  campaignCryptoSet.add({
                    key,
                    value: this.res[key],
                    contract: value.contract_address
                  });
                } else if(key === 'BNB' && this.selectedNetworkValue === 'BEP20') {
                  campaignCryptoSet.add({
                    key,
                    value: this.res[key],
                    contract: null
                })
                } else if(key === 'BTT' && this.selectedNetworkValue === 'BTTC') {
                  campaignCryptoSet.add({
                    key,
                    value: this.res[key],
                    contract: null
                    }) 
                } else {
                value.platform.name
                  .toString()
                  .toLowerCase()
                  .includes(this.selectedNetworkValue.toString().toLowerCase()) &&
                  campaignCryptoSet.add({
                    key,
                    value: this.res[key],
                    contract: value.contract_address
                    });
                  }
                }
              }
            }      
            this.campaignCryptoList = Array.from(campaignCryptoSet);
        
        this.campaignCryptoList.forEach((value: any) => {
          if (value.key === (this.form.get('currency')?.value === 'SATTBEP20' ?  'SATT': this.form.get('currency')?.value) ) {
            this.walletFacade
              .getBalanceByToken({
                network: this.selectedNetworkValue.toLowerCase(),
                walletAddress: this.selectedNetworkValue === 'TRON' ? window.localStorage.getItem('tron-wallet') : window.localStorage.getItem('wallet_id'),
                isNative:
         ((value.key === 'ETH' && this.selectedNetworkValue === 'ERC20') || (value.key === 'BNB' && this.selectedNetworkValue === 'BEP20') || (value.key === 'BTT' && this.selectedNetworkValue === 'BTTC') || (value.key === 'TRX' && this.selectedNetworkValue === 'TRON') || (value.key === 'MATIC' && this.selectedNetworkValue === 'POLYGON'))
            ? true
            : false,
                smartContract: (this.selectedNetworkValue === 'ERC20' && value.key === 'SATT') ? environment.addresses.smartContracts.SATT_TOKENERC20 :  ( (this.selectedNetworkValue === 'BEP20' && value.key === 'SATT') ? environment.addresses.smartContracts.SATT_TOKENBEP20 :value.contract) //value.contract
              })
              .subscribe(
                (res: any) => {
                  this.selectedCryptoDetails = {
                    AddedToken: !!value.AddedToken ? value.AddedToken : true,
                    balance: 0,
                    contract: value.contract,
                    contrat: value.contract,
                    decimal: 18,
                    key: this.form.get('currency')?.value,
                    network: this.selectedNetworkValue,
                    picUrl: true,
                    price: value.value.price,
                    quantity: res.data,
                    symbol: this.form.get('currency')?.value,
                    total_balance: res.data * value.value.price,
                    type: this.selectedNetworkValue,
                    typetab: this.selectedNetworkValue,
                    undername: value.value.name,
                    undername2: value.value.name,
                    variation: 0
                  };
                  this.totalBalanceExist = true;
                  
                  this.form.get('initialBudgetInUSD')?.setValue((this.selectedCryptoDetails.price * this.form.get('initialBudget')?.value).toFixed(2))
                  

                },
                (error: any) => {
                  this.selectedCryptoDetails = {
                    AddedToken: !!value.AddedToken ? value.AddedToken : true,
                    balance: 0,
                    contract: value.contract,
                    contrat: value.contract,
                    decimal: 18,
                    key: this.form.get('currency')?.value,
                    network: this.selectedNetworkValue,
                    picUrl: true,
                    price: value.value.price,
                    quantity: 0,
                    symbol: this.form.get('currency')?.value,
                    total_balance: 0,
                    type: this.selectedNetworkValue,
                    typetab: this.selectedNetworkValue,
                    undername: value.value.name,
                    undername2: value.value.name,
                    variation: 0
                  };
                  this.totalBalanceExist = true;
                  
                  this.form.get('initialBudgetInUSD')?.setValue((this.selectedCryptoDetails.price * this.form.get('initialBudget')?.value).toFixed(2))
                 
                }
              );
          }
        });
      
    });

    this.validFormBudgetRemuneration();
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.draftData && changes.draftData.currentValue) {
      this.form?.patchValue(
        {
          initialBudget: this.convertFromWeiTo.transform(
            this.draftData.initialBudget,
            this.draftData.currency.name,
            10
          ),
          initialBudgetInUSD: this.draftData.initialBudgetInUSD,
          currency: this.draftData.currency.name,
          remuneration: this.draftData.remuneration as ERemunerationType
        },
        { emitEvent: false }
      );
      this.amountUsd = this.form.get('initialBudgetInUSD')?.value;
      this.amount = this.form.get('initialBudget')?.value;
      this.cdref.detectChanges();
      this.cdref.markForCheck();
      this.selectRemunerateValue = this.form.get('remuneration')?.value;
      this.cryptoSymbol = this.draftData.currency.name;
      this.selectedBlockchain = this.draftData.currency.type;
      this.cryptoToDropdown = this.draftData.currency.name;
      if (this.f.currency) {
        this.defaultAmount = this.f.currency.value;
      } else {
        this.defaultAmount = 'SATT';
      }
      this.selectedCrypto = this.draftData.currency.name;
      if (this.draftData.remuneration === this.eRemunerationType.Performance) {
        this.form.setControl(
          'ratios',
          this.populateRatiosFormArray(this.draftData.ratios)
        );
      }
      if (this.draftData.remuneration === this.eRemunerationType.Publication) {
        this.form.setControl(
          'bounties',
          this.populateBountiesFormArray(this.draftData.bounties)
        );
      }
      if (this.notValidMissionFromEdit === true) {
        this.sendErrorToMission = true;
      } else {
        this.sendErrorToMission = false;
      }
      this.setPreSelectedOracles();
      this.cdref.detectChanges();
      this.validFormBudgetRemuneration();
      this.validBudgetMissions();
    }
  }

  listenForOracleMissionChange(event: any) {
    if (event.oracle === 'youtube') {
      this.isSelectedYoutube = !this.isSelectedYoutube;
      this.toggleOracle('youtube', event.event);
    }
    if (event.oracle === 'facebook') {
      this.isSelectedFacebook = !this.isSelectedFacebook;
      this.toggleOracle('facebook', event.event);
    }

    if (event.oracle === 'instagram') {
      this.isSelectedInstagram = !this.isSelectedInstagram;
      this.toggleOracle('instagram', event.event);
    }

    if (event.oracle === 'threads') {
      this.isSelectedThreads = !this.isSelectedThreads;
      this.toggleOracle('threads', event.event);
    }
    if (event.oracle === 'twitter') {
      this.isSelectedTwitter = !this.isSelectedTwitter;
      this.toggleOracle('twitter', event.event);
    }
    if (event.oracle === 'linkedin') {
      this.isSelectedLinkedin = !this.isSelectedLinkedin;
      this.toggleOracle('linkedin', event.event);
    }
    if (event.oracle === 'tiktok') {
      this.isSelectedTikTok = !this.isSelectedTikTok;
      this.toggleOracle('tiktok', event.event);
    }
    if (event.oracle === 'googleAnalytics') {
      this.isSelectedGoogleAnalytics = !this.isSelectedGoogleAnalytics;
      this.toggleOracle('googleAnalytics', event.event);
    }
  }
  toggleOracle(oracle: string, checked?: boolean) {
    let group = new UntypedFormGroup({});
    if (this.f.remuneration.value === this.eRemunerationType.Performance) {
      if (
        !this.ratios.value.map((res: any) => res.oracle).includes(oracle) &&
        checked
      ) {
        group = new UntypedFormGroup(
          {
            oracle: new UntypedFormControl(oracle),
            view: new UntypedFormControl(null, [Validators.required]),
            like: new UntypedFormControl(null, [Validators.required]),
            share: new UntypedFormControl(null, [Validators.required])
          },
          customValidateRatios()
        );
        this.ratios.push(group);
        this.ratios.updateValueAndValidity();
        if (this.isReachLimitActivated) {
          group.setControl(
            'reachLimit',
            new UntypedFormControl(null, [Validators.required])
          );
          group.get('reachLimit')?.setValidators([
            Validators.required,
            Validators.min(1)
            //  Validators.max(100),
          ]);
        }
      } else {
        if (
          this.ratios.value.findIndex(
            (ratio: any) => ratio.oracle === oracle
          ) >= 0
        ) {
          this.ratios.removeAt(
            this.ratios.value.findIndex((ratio: any) => ratio.oracle === oracle)
          );
          this.ratios.updateValueAndValidity();
        }
      }
    } else if (
      this.f.remuneration.value === this.eRemunerationType.Publication
    ) {
      if (
        !this.bounties.value.map((res: any) => res.oracle).includes(oracle) &&
        checked
      ) {
        this.bounties.push(this.addNewBounty(oracle));
      } else {
        if (
          this.bounties.value.findIndex(
            (bounty: any) => bounty.oracle === oracle
          ) >= 0
        ) {
          this.bounties.removeAt(
            this.bounties.value.findIndex(
              (bounty: any) => bounty.oracle === oracle
            )
          );
        }
      }
    }
  }

  listenForMissionValidation(value: boolean) {
    this.sendErrorToMission = value;
    //this.validFormMissionFromRemuToEdit.emit(value);
  }

  saveForm() {
    
    this.form.valueChanges
      .pipe(
        tap(() => {
          // this.notValidBudgetRemun = false;
          if (!this.service.isSavingStarted) {
            this.service.setSaveFormStatus('saving');
            this.service.isSavingStarted = true;
          }
        }),
        debounceTime(500),
        tap((values: any) => {
          var arrayControl = this.form.get('ratios') as UntypedFormArray;
          const lengthRatios = arrayControl.length;
          var arrayControlBounties = this.form.get(
            'bounties'
          ) as UntypedFormArray;
          const lengthBounties = arrayControlBounties.length;
          if (
            this.form.get('remuneration')?.value ===
            this.eRemunerationType.Performance
          ) {
            if (
              (lengthRatios > 0 && this.form.controls.ratios.invalid) ||
              (lengthRatios > 0 && this.form.invalid)
            ) {
              this.sendErrorToMission = true;
            } else {
              this.sendErrorToMission = false;
            }
          }
          if (
            this.form.get('remuneration')?.value ===
            this.eRemunerationType.Publication
          ) {
            if (
              (lengthBounties > 0 && this.form.controls.bounties.invalid) ||
              (lengthBounties > 0 && this.form.invalid)
            ) {
              this.sendErrorToMission = true;
            } else {
              this.sendErrorToMission = false;
            }
          }
          if (this.draftData.id) {
            this.sendErrorToMission = false;
            const currencyObject = {
              name: (this.selectedCryptoDetails.key === 'SATT' && this.selectedCryptoDetails.network === 'BEP20') ? 'SATTBEP20' : this.selectedCryptoDetails.key,
              type: this.selectedCryptoDetails.network,
              addr: 
              (this.selectedCryptoDetails.key === 'SATT' && this.selectedCryptoDetails.network === 'BEP20') 
              ? environment.addresses.smartContracts.SATT_TOKENBEP20 :
              (
                (this.selectedCryptoDetails.key === 'SATT' && this.selectedCryptoDetails.network === 'ERC20') ? environment.addresses.smartContracts.SATT_TOKENERC20 
                : ((this.selectedCryptoDetails.key === 'BTT' && this.selectedCryptoDetails.network === 'BTTC') ? '0x0000000000000000000000000000000000001010' 
                : ((this.selectedCryptoDetails.key === 'TRX' && this.selectedCryptoDetails.network === 'TRON') ? 'TRpHXiD9PRoorNh9Lx4NeJUAP7NcG5zFwi' : 
                ( (this.selectedCryptoDetails.key === 'BNB' && this.selectedCryptoDetails.network === 'BEP20') ? null :  this.selectedCryptoDetails.contract)
                ) 
                )
                )
              
              
             
            }
            values.currency = currencyObject
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id,
            });
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(() => {
        this.validFormBudgetRemuneration();
        this.validBudgetMissions();
      });
  }

  validBudgetMissions() {
    let hasError = false;
    if (this.form.get('ratios')?.value.length) {
      if (this.form.errors?.InsufficientBudget) {
        this.validFormMissionFromRemuToEdit.emit(false);
      } else {
        for (let ratio of this.ratios.controls) {
          if (ratio.errors?.invalidRatioSomme) {
            hasError = true;
            break;
          }
        }
        if (hasError) {
          this.validFormMissionFromRemuToEdit.emit(false);
        } else this.validFormMissionFromRemuToEdit.emit(true);
      }
    } else if (this.form.get('bounties')?.value.length) {
      for (let [index, bountie] of this.bounties.controls.entries()) {
        let found = this.getCategories(index).controls.find((category) => {
          return category.errors !== null;
        });

        if (found) this.validFormMissionFromRemuToEdit.emit(false);
        else this.validFormMissionFromRemuToEdit.emit(true);
      }
    } else this.validFormMissionFromRemuToEdit.emit(false);
  }

  selectRemunerateType(type: ERemunerationType) {
    if (
      this.isSelectedLinkedin ||
      this.isSelectedYoutube ||
      this.isSelectedTwitter ||
      this.isSelectedFacebook ||
      this.isSelectedInstagram ||
      this.isSelectedThreads ||
      this.isSelectedTikTok ||
      this.isSelectedGoogleAnalytics
    ) {
      this.selectRemunerateValue = type;
      this.f.remuneration.setValue(type);
      this.ratios.clear();
      this.bounties.clear();
      if (this.isSelectedYoutube) {
        this.toggleOracle('youtube', true);
      }
      if (this.isSelectedFacebook) {
        this.toggleOracle('facebook', true);
      }

      if (this.isSelectedInstagram) {
        this.toggleOracle('instagram', true);
      }
      if (this.isSelectedThreads) {
        this.toggleOracle('threads', true);
      }
      if (this.isSelectedTwitter) {
        this.toggleOracle('twitter', true);
      }
      if (this.isSelectedLinkedin) {
        this.toggleOracle('linkedin', true);
      }
      if (this.isSelectedTikTok) {
        this.toggleOracle('tiktok', true);
      }
      if (this.isSelectedGoogleAnalytics) {
        this.toggleOracle('googleAnalytics', true);
      }
    } else {
      this.selectRemunerateValue = type;
      this.f.remuneration.setValue(type);
      // this.ratios.clear();
      // this.bounties.clear();
    }
  }

  get f() {
    return this.form.controls;
  }

  get ratios() {
    return this.form.get('ratios') as UntypedFormArray;
  }

  get bounties() {
    return this.form.get('bounties') as UntypedFormArray;
  }

  getCategories(index: number) {
    return this.bounties.at(index).get('categories') as UntypedFormArray;
  }

  isFieldValid(form: AbstractControl, field: string) {
    return !form.get(field)?.valid && this.notValidBudgetRemun;
  }

  isValid(controlName: any) {
    return this.form?.get(controlName)?.invalid && this.validation;
  }

  populateRatiosFormArray(ratios: any[]): UntypedFormArray {
    ratios = ratios.filter(
      (ratio: any) =>
        this.draftData.missions
          .filter((res: any) => res.sub_missions.length > 0)
          .map((res: any) => res.oracle)
          .indexOf(ratio.oracle) >= 0
    );
    const controls = ratios.map((ratio) => {
      const group = new UntypedFormGroup(
        {
          oracle: new UntypedFormControl(ratio.oracle),
          view: new UntypedFormControl(
            this.convertFromWeiTo.transform(
              ratio.view,
              this.draftData.currency.name
            ),
            [Validators.required]
          ),
          like: new UntypedFormControl(
            this.convertFromWeiTo.transform(
              ratio.like,
              this.draftData.currency.name
            ),
            [Validators.required]
          ),
          share: new UntypedFormControl(
            this.convertFromWeiTo.transform(
              ratio.share,
              this.draftData.currency.name
            ),
            [Validators.required]
          )
        },
        customValidateRatios()
      );

      if (ratio.reachLimit) {
        this.isReachLimitActivated = true;
        group.addControl(
          'reachLimit',
          new UntypedFormControl(ratio.reachLimit, Validators.required)
        );
      }

      return group;
    });
    return new UntypedFormArray(controls);
  }

  populateBountiesFormArray(bounties: any[]) {
    bounties = bounties.filter((bounty: any) => {
      return (
        this.draftData.missions
          .filter((res: any) => res.sub_missions.length > 0)
          .map((res: any) => res.oracle)
          .indexOf(bounty.oracle) >= 0
      );
    });
    const controls = bounties.map((bounty) => {
      const group = new UntypedFormGroup({
        oracle: new UntypedFormControl(bounty.oracle),
        categories: new UntypedFormArray(
          bounty.categories.map((category: any) => {
            return new UntypedFormGroup(
              {
                minFollowers: new UntypedFormControl(
                  category.minFollowers,
                  Validators.required
                ),
                maxFollowers: new UntypedFormControl(
                  category.maxFollowers,
                  Validators.required
                ),
                reward: new UntypedFormControl(
                  this.convertFromWeiTo.transform(
                    category.reward,
                    this.draftData.currency.name
                  ),
                  Validators.required
                )
              },
              customValidateBounties()
            );
          }),
          customValidateMaxMin()
        )
      });

      return group;
    });
    return new UntypedFormArray(controls);
  }

  getUserCrypto() {
    this.walletFacade.cryptoList$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.dataList = data;
        Object.preventExtensions(this.dataList);
        this.cryptoQuantity = (
          this.dataList.find(
            (crypto: any) => crypto.symbol === this.draftData.currency.name
          ) as any
        )?.quantity;
        this.dataList = [
          ...this.dataList.filter((data: any) => data.symbol === 'SATT'),
          ...this.dataList.filter((data: any) => data.symbol === 'USDT'),
          ...this.dataList.filter((data: any) => data.symbol === 'DAI'),
          ...this.dataList.filter((data: any) => data.symbol === 'SATTBEP20'),
          ...this.dataList.filter((data: any) => data.symbol === 'BUSD'),
          ...this.dataList.filter((data: any) => data.symbol === 'SATTPOLYGON'),
          ...this.dataList.filter((data: any) => data.symbol === 'MATIC'),
          ...this.dataList.filter((data: any) => data.symbol === 'SATTBTT'),
          ...this.dataList.filter((data: any) => data.symbol === 'BTT'),
          ...this.dataList.filter((data: any) => data.symbol === 'SATTTRON'),
          ...this.dataList.filter((data: any) => data.symbol === 'TRX')
        ];
      });
  }

  parentFunction() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      take(1),
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        this.matic = data['MATIC'].price;
        this.btt = data['BTT'].price;
        this.trx = data['TRX'].price;

        return {
          bnb: this.bnb,
          Eth: this.eth,
          matic: this.matic,
          btt: this.btt,
          trx: this.trx
        };
      }),
      switchMap(({ bnb, Eth, matic, btt, trx }) => {
        return forkJoin([
          this.walletFacade.getGas('erc20').pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;
              this.gazsend = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                Eth
              ).toFixed(2);
              this.eRC20Gaz = this.gazsend;
            })
          ),
          this.walletFacade.getGas('bep20').pipe(
            take(1),
            tap((gaz: any) => {
              let price = gaz.data.gasPrice;
              this.bEPGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                bnb
              ).toFixed(2);

              if (this.gazsend === 'NaN') {
                this.gazsend = '';
                // this.showSpinner=true;
                let price = gaz.data.gasPrice;
                this.bEPGaz = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  this.bnb
                ).toFixed(2);
              }
            })
          ),
          this.walletFacade.getGas('polygon').pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.polygonGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                matic
              ).toFixed(8);
            })
          ),

          this.walletFacade.getGas('bttc').pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.bttGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                btt
              ).toFixed(8);
            })
          ),
          this.walletFacade.getGas('tron').pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.trxGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                trx
              ).toFixed(8);
            })
          )
        ]);
      })
    );
  }

  toggleReachLimitFormControl(e: any) {
    this.isReachLimitActivated = e;

    if (this.isReachLimitActivated) {
      this.ratios.controls.forEach((control: AbstractControl) => {
        (control as UntypedFormGroup).setControl(
          'reachLimit',
          new UntypedFormControl('')
        );
        (control as UntypedFormGroup).get('reachLimit')?.setValidators([
          Validators.required
          //  Validators.min(0),
          //alidators.max(100),
        ]);
      });
    } else {
      this.ratios.controls.forEach((control: AbstractControl) => {
        (control as UntypedFormGroup).removeControl('reachLimit');
      });
    }
  }

  setPreSelectedOracles() {
    let array = [];
    if (this.f.remuneration?.value === this.eRemunerationType.Performance) {
      array = this.draftData.ratios;
    } else {
      array = this.draftData.bounties;
    }
    this.isSelectedFacebook = array.find((elem) => elem.oracle === 'facebook')
      ? true
      : false;
    this.isSelectedYoutube = array.find((elem) => elem.oracle === 'youtube')
      ? true
      : false;
    this.isSelectedInstagram = array.find((elem) => elem.oracle === 'instagram')
      ? true
      : false;
      this.isSelectedThreads = array.find((elem) => elem.oracle === 'threads')
      ? true
      : false;
    this.isSelectedTwitter = array.find((elem) => elem.oracle === 'twitter')
      ? true
      : false;
    this.isSelectedLinkedin = array.find((elem) => elem.oracle === 'linkedin')
      ? true
      : false;
    this.isSelectedTikTok = array.find((elem) => elem.oracle === 'tiktok')
      ? true
      : false;
    this.isSelectedGoogleAnalytics = array.find(
      (elem) => elem.oracle === 'googleAnalytics'
    )
      ? true
      : false;
  }

  handleAmountEntries(form: AbstractControl, control: string) {
    form
      .get(control)
      ?.setValue(this.replaceNonAlphanumeric(form.get(control)?.value), {
        emitEvent: false
      });
  }

  checkTwitterOracle(form: AbstractControl) {
    if (form.value.oracle === 'twitter') return true;
    else return false;
  }

  allowOnlyNumbers(form: AbstractControl, control: string) {
    form
      .get(control)
      ?.setValue(form.get(control)?.value.replace(/[^0-9]+/g, ''), {
        emitEvent: false
      });
  }

  replaceNonAlphanumeric(value: string) {
    return (
      value
        .replace(/[^0-9.]+/g, '')
        // .replace(/^0+/, "")
        .replace(/^\.+/, '0.')
        .replace(/\./, 'x')
        .replace(/\./g, '')
        .replace(/x/, '.')
    );
  }
  getAbsoluteNumber(form: AbstractControl, control: string) {
    form
      .get(control)
      ?.setValue(Math.abs(Number(form.get(control)?.value)).toFixed(), {
        emitEvent: false
      });
  }

  addNewBounty(oracle?: string): UntypedFormGroup {
    return new UntypedFormGroup({
      oracle: new UntypedFormControl(oracle),
      categories: new UntypedFormArray(
        [this.newRewardCategory()],
        customValidateMaxMin()
      )
    });
  }

  newRewardCategory(): UntypedFormGroup {
    return new UntypedFormGroup(
      {
        minFollowers: new UntypedFormControl(null, [Validators.required]),
        maxFollowers: new UntypedFormControl(null, [Validators.required]),
        reward: new UntypedFormControl(null, [Validators.required])
      },
      customValidateBounties()
    );
  }

  addRemunerationCategory(bountyIndex: number): void {
    const categories = this.bounties.controls[bountyIndex].get(
      'categories'
    ) as UntypedFormArray;
    categories.push(this.newRewardCategory());
  }

  removeRemunerationCategory(
    bountyIndex: number,
    categoryIndex: number,
    oracle: string
  ) {
    const categories = this.bounties.controls[bountyIndex].get(
      'categories'
    ) as UntypedFormArray;
    if (categories.controls.length === 1) {
      this.closedOracle = oracle;
      this.bounties.removeAt(bountyIndex);
      this.isSelectedTwitter =
        oracle === 'twitter' ? false : this.isSelectedTwitter;
      this.isSelectedFacebook =
        oracle === 'facebook' ? false : this.isSelectedFacebook;
      this.isSelectedYoutube =
        oracle === 'youtube' ? false : this.isSelectedYoutube;
      this.isSelectedInstagram =
        oracle === 'instagram' ? false : this.isSelectedInstagram;
        this.isSelectedThreads =
        oracle === 'threads' ? false : this.isSelectedThreads;
      this.isSelectedLinkedin =
        oracle === 'linkedin' ? false : this.isSelectedLinkedin;
      this.isSelectedTikTok =
        oracle === 'tiktok' ? false : this.isSelectedTikTok;
      this.isSelectedGoogleAnalytics =
        oracle === 'googleAnalytics' ? false : this.isSelectedGoogleAnalytics;
      return;
    }
    categories.removeAt(categoryIndex);
  }

  // fixing crypto decimals to 9
  filterAmount(input: any, nbre: any = 10) {
    if (input) {
      var out = input;
      let size = input.length;
      let toAdd = parseInt(nbre) - parseInt(size);

      if (input === 0) {
        toAdd--;
      }
      if (toAdd > 0) {
        if (input.includes('.')) {
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        } else {
          out += '.';
          for (let i = 0; i < toAdd; i++) {
            out += '0';
          }
        }
      } else if (toAdd < 0) {
        if (input.includes('.')) {
          if (input.split('.')[0].length > nbre) {
            out = input.substring(0, nbre);
          } else {
            out = input.substring(0, nbre);
            if (out[nbre - 1] === '.') {
              out = input.substring(0, nbre - 1);
            }
          }
        }
      }
      return out;
    } else {
      return '-';
    }
  }


  trackByCrypto(index: number, crypto: any): string {
    return crypto.code;
  }


  trackByRatios(index: number, ratio: any): string {
    return ratio.code;
  }



  trackByBounty(index: number, bounty: any): string {
    return bounty.code;
  }



  trackByCategory(index: number, category: any): string {
    return category.code;
  }



  restrictZero(event: any) {
    event;
  }



  ngAfterViewChecked(): void {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    if (elementinputusd)
      this.renderer.setStyle(
        elementinputusd,
        'width',
        elementinputusd.value.length + 1.2 + 'ch'
      );
    //elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }

  // SWITCH TO ANOTHER CRYPTO

  linstingCrypto(event: any) {
    this.selectedNetworkValue = event.network;
    this.insufficientBalance = false;
    this.fieldRequired = false;
    if (event.symbol !== this.form.get('currency')?.value) {
      this.form.get('initialBudget')?.reset();
      this.form.get('initialBudgetInUSD')?.reset();
    }
    this.form.get('initialBudget')?.setValue('0');
    this.form.get('initialBudgetInUSD')?.setValue('0.00');
    this.selectedCryptoDetails = event;
    this.totalBalanceExist = true;
    this.form.get('currency')?.setValue(this.selectedCryptoDetails.symbol);
    this.amountdefault = this.form.get('currency')?.value;
    this.selectedCryptoSend = event.symbol;
    this.symbol = event.symbol;
    this.cryptoSymbol = event.symbol;
    this.networks = event.network;
    this.decimals = event.decimal;
    this.token = event.AddedToken;
  }

  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }
  // GET MAX AMOUNT FOR CAMPAIGN BUDGET

  onClickAmount(): void {
    this.insufficientBalance = false;
    this.fieldRequired = false;
    let currency = '';
    this.selectedCryptoSend = currency;
    if (
      !!this.selectedCryptoDetails &&
      this.selectedCryptoDetails.quantity > 0
    ) {
      if (
        this.selectedCryptoDetails.symbol === 'ETH' ||
        this.selectedCryptoDetails.symbol === 'BNB' ||
        this.selectedCryptoDetails.symbol === 'MATIC' ||
        this.selectedCryptoDetails.symbol === 'BTT' ||
        this.selectedCryptoDetails.symbol === 'TRX'
      ) {
        const fees =
          this.selectedCryptoDetails.symbol === 'BNB'
            ? this.bEPGaz
            : this.selectedCryptoDetails.symbol === 'ETH'
            ? this.eRC20Gaz
            : this.selectedCryptoDetails.symbol === 'MATIC'
            ? this.polygonGaz
            : this.selectedCryptoDetails.symbol === 'TRON'
            ? this.trxGaz
            : this.bttGaz;
        const balance =
          this.selectedCryptoDetails?.total_balance.toFixed(2) - fees;
        const quantity =
          this.selectedCryptoDetails?.quantity -
          fees / this.selectedCryptoDetails?.price;
        this.form.get('initialBudget')?.setValue(quantity);
        this.form.get('initialBudgetInUSD')?.setValue(balance);
        this.amount = this.showNumbersRule.transform(quantity.toString(), true);
        this.amountUsd = balance.toFixed(2);
        this.validFormBudgetRemun.emit(true);
      } else {
        this.form
          .get('initialBudget')
          ?.setValue(this.selectedCryptoDetails?.quantity);
        this.form
          .get('initialBudgetInUSD')
          ?.setValue(this.selectedCryptoDetails?.total_balance.toFixed(2));
        this.amount = this.selectedCryptoDetails?.quantity;
        this.amountUsd = this.selectedCryptoDetails?.total_balance.toFixed(2);
        this.validFormBudgetRemun.emit(true);
      }

      
    }
  }

  // HANDLE USER INPUT IN REMUNERATION BUDGET

  convertcurrency(event: any): void {
    this.fieldRequired = false;
    var getamount: any = this.form.get('initialBudget')?.value;
    let getusd: any = this.form.get('initialBudgetInUSD')?.value;
    let sendamount = getamount?.toString();
    let sendusd = getusd?.toString();
    if (event === 'usd') {
      this.form.get('initialBudgetInUSD')?.setValue(sendusd);
      this.form
        .get('initialBudget')
        ?.setValue(sendusd / this.selectedCryptoDetails.price);
      this.amount = this.showNumbersRule.transform(
        (sendusd / this.selectedCryptoDetails.price).toString(),
        true
      );
    } else {
      this.form.get('initialBudget')?.setValue(sendamount);
      this.form
        .get('initialBudgetInUSD')
        ?.setValue(sendusd * this.selectedCryptoDetails.price);
      this.amountUsd = this.showNumbersRule.transform(
        (this.selectedCryptoDetails.price * sendamount).toString()
      );
      this.editwidthInput();
    }
   
    this.validFormBudgetRemuneration();
  }


  editwidthInput() {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    if (elementinputusd)
      this.renderer.setStyle(
        elementinputusd,
        'width',
        elementinputusd.value.length + 1.2 + 'ch'
      );
  }

  // CONDITION FOR USER INPUTS TO ALLOW ONLY NUMBERS AND ONE POINTS ( DECIMAL NUMBER )

  keyPressNumbersWithDecimal(event: any, type: string) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (event.key === '.' && inputValue.includes('.')) {
      event.preventDefault();
    }
    if (type === 'crypto') {
      if (
        this.selectedCryptoDetails?.price * Number(inputValue) >
        this.maxNumber
      ) {
        event.preventDefault();
      }
    }
    if (type === 'usd' && Number(inputValue) > this.maxNumber) {
      event.preventDefault();
    }
    if ((event.which >= 48 && event.which <= 57) || event.which === 46) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // CHECK FOR VALIDATION REMUNERATION BUDGET

  validFormBudgetRemuneration() {
    const isValid = this.amount > 0 && this.amount !== '';
    if (isValid) {
      this.fieldRequired = false;
      let x: number = +(this.amountUsd.includes(',')
        ? this.amountUsd.replaceAll(',', '')
        : this.amountUsd);
      if (x <= this.selectedCryptoDetails?.total_balance?.toFixed(2)) {
        this.insufficientBalance = false;
      } else {
        this.insufficientBalance = true;
      }
      this.validFormBudgetRemun.emit(!this.insufficientBalance ? true : false);
    } else {
      this.fieldRequired = true;
      this.validFormBudgetRemun.emit(false);
    }
  }
}
