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
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { forkJoin, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { GazConsumedByCampaign} from '@app/config/atn.config';
import { checkIfEnoughBalance } from '@helpers/form-validators';
import { Campaign } from '@app/models/campaign.model';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import { WalletStoreService } from '@core/services/wallet-store.service';
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
import { Big } from 'big.js';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { CampaignsStoreService } from '@app/campaigns/services/campaigns-store.service';
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
  
  closedOracle: string = '';
  sendErrorToMission: any;
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
  cryptoList: any = [];
  dataList: any[] = [];
  bnb: any;
  eth: any;
  checkType = 'erc20';
  showRetrySaveButtonOnError = new Observable();
  isDestroyed$ = new Subject<any>();
  gazsend: any;
  currency: any;
  bnbGaz: any;
  selectedCryptoDetails: any = '';
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
  constructor(
    private service: DraftCampaignService,
    private convertFromWeiTo: ConvertFromWei,
    private walletStore: WalletStoreService,
    private cdref: ChangeDetectorRef,
    private walletFacade: WalletFacadeService,
    private campaignsStoreService: CampaignsStoreService,
    private showNumbersRule: ShowNumbersRule,
    private renderer: Renderer2,
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
        // remuneration: new FormControl({
        //   text: eRemunerationType.Performance,
        //   value: eRemunerationType.Performance,
        // }),
        remuneration: new UntypedFormControl(this.eRemunerationType.Performance),
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

  ngOnInit(): void {
    
    
    
    this.cdref.markForCheck();
    this.parentFunction().subscribe();
    this.getUserCrypto();
    //this.campaign = 
  //  this.campaignsStoreService.updateOneById({ cost: "5000" });
    //  this.campaign$.pipe().subscribe((campaign) => {
    //   this.campaign = campaign;
    //  });
    this.checkValidForm();
    this.saveForm();
    // this.cryptoSymbol = 'SATT';
    this.showSelectedValue = false;
    // this.selectedBlockchain = 'erc20';
    // this.f.currency?.setValue('SATT');
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes.draftData && changes.draftData.currentValue) {
      /*
      this.form?.patchValue(this.draftData, { emitEvent: false });
*/
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
        //this.form.get("ratios")?.setValidators(Validators.required);
        //this.ratios.updateValueAndValidity();
      }

      if (this.draftData.remuneration === this.eRemunerationType.Publication) {
        this.form.setControl(
          'bounties',
          this.populateBountiesFormArray(this.draftData.bounties)
        );
        //this.form.get("bounties")?.setValidators(Validators.required);
        //this.bounties.updateValueAndValidity();
      }
      if (this.notValidMissionFromEdit === true) {
        this.sendErrorToMission = true;
      } else {
        this.sendErrorToMission = false;
      }
      this.setPreSelectedOracles();
      this.cdref.detectChanges();
      // this.setPreSelectedMissions();
      //this.form.updateValueAndValidity();
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
  listenForBudgetValidation(value:boolean){
    console.log("**********////*******",this.form);
    this.validFormBudgetRemun.emit(value)
  }
  listenForMissionValidation(value: boolean) {
    this.sendErrorToMission = value;
    this.validFormMissionFromRemuToEdit.emit(value);
  }
  saveForm() {
    this.form.valueChanges.pipe(
        tap(() => {
          // this.notValidBudgetRemun = false;
          if (!this.service.isSavingStarted) {
            this.service.setSaveFormStatus('saving');
            this.service.isSavingStarted = true;            
          }
        }),
        debounceTime(500),
        tap((values: any) => {
          if (this.form.valid) {
            this.validFormBudgetRemun.emit(true);
          } else {
            this.validFormBudgetRemun.emit(false);
          }
          var arrayControl = this.form.get('ratios') as UntypedFormArray;
          const lengthRatios = arrayControl.length;
          var arrayControlBounties = this.form.get('bounties') as UntypedFormArray;
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
           
            
            this.validFormMissionFromRemuToEdit.emit(true);
            this.validFormBudgetRemun.emit(true);

            this.sendErrorToMission = false;
            
            
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(() => {
        const initialBudgetControl = this.form.get('initialBudget');
        const hasPatternError = initialBudgetControl?.hasError('pattern') || initialBudgetControl?.value !== "";
        const isValid = initialBudgetControl && !hasPatternError;
      
        this.validFormBudgetRemun.emit(isValid && !this.form.errors?.notEnoughBalance);
      });
  }
  selectRemunerateType(type: ERemunerationType) {
    if (
      this.isSelectedLinkedin ||
      this.isSelectedYoutube ||
      this.isSelectedTwitter ||
      this.isSelectedFacebook ||
      this.isSelectedInstagram ||
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
  // ngAfterViewInit() {
  //   let el = this.initialBudgetElement?.nativeElement;
  //   let el2 = this.initialBudgetInUSDElement?.nativeElement;
  //   // el.style.width = 25 + "px";
  //   // el2.style.width = 40 + "px";
  //   // let initialBudgetElementChanges$ = fromEvent(el, "keydown");
  //   // let initialBudgetInUSDElementChanges$ = fromEvent(el2, "keydown");
  //   // this.initialBudgetInputWidth$ = initialBudgetElementChanges$.pipe(
  //   //   map((event: any) => event.keyCode),
  //   //   filter((keyCode) => {
  //   //     return this.isValidKeyCode(keyCode);
  //   //   }),
  //   //   map((keyCode) => (el.value.length + 1) * 12 + "px")
  //   // );
  //   // this.initialBudgetInUSDInputWidth$ = initialBudgetInUSDElementChanges$.pipe(
  //   //   map((event: any) => event.keyCode),
  //   //   filter((keyCode) => {
  //   //     return this.isValidKeyCode(keyCode);
  //   //   }),
  //   //   map((keyCode) => (el2.value.length + 1) * 12 + "px")
  //   // );
  //   this.f.initialBudget.valueChanges
  //     .pipe(
  //       takeUntil(this.isDestroyed$),
  //       startWith('0'),
  //       filter((value) => value),
  //       distinctUntilChanged(),
  //       withLatestFrom(this.walletFacade.getCryptoList().pipe(startWith({}))),
  //       map(([value = 0, balances]) => {
  //         let selectedCurrency = (balances as any)?.listOfCrypto?.find(
  //           (crypto: any) => crypto.symbol === this.f.currency.value
  //         );
  //         return [this.replaceNonAlphanumeric(value), selectedCurrency];
  //       })
  //     )
  //     .subscribe(
  //       ([value, selectedCurrency]) => {
  //         this.form.patchValue(
  //           {
  //             initialBudgetInUSD: new Big(value || 0)
  //               .times(selectedCurrency?.price || 0)
  //               .toFixed(2)
  //               .toString()
  //           },
  //           { emitEvent: false }
  //         );
  //         // el.style.width = (el.value.length + 1) * 12 + "px";
  //         // el2.style.width = (el2.value.length + 1) * 12 + "px";
  //       },
  //       (err) => {}
  //     );
  //   this.f.initialBudgetInUSD.valueChanges
  //     .pipe(
  //       takeUntil(this.isDestroyed$),
  //       startWith('0'),
  //       filter((value) => value),
  //       distinctUntilChanged(),
  //       withLatestFrom(this.walletFacade.getCryptoList().pipe(startWith({}))),
  //       map(([value = 0, balances]) => {
  //         let selectedCurrency = (balances as any)?.listOfCrypto?.find(
  //           (crypto: any) => crypto.symbol === this.f.currency.value
  //         );
  //         return [this.replaceNonAlphanumeric(value), selectedCurrency];
  //       })
  //     )
  //     .subscribe(
  //       ([value, selectedCurrency]) => {
  //         if (selectedCurrency?.price) {
  //           this.form.patchValue(
  //             {
  //               initialBudget: new Big(value || 0)
  //                 .div(selectedCurrency?.price || 1)
  //                 .toFixed(2)
  //                 .toString()
  //             },
  //             { emitEvent: false }
  //           );
  //         }
  //         // el.style.width = (el.value.length + 1) * 12 + "px";
  //         // el2.style.width = (el2.value.length + 1) * 12 + "px";
  //       },
  //       (err) => {}
  //     );
  // }

  isValidKeyCode(code: number): boolean {
    return (
      (code >= 48 && code <= 57) ||
      (code >= 96 && code <= 105) ||
      code === 8 ||
      code === 46 ||
      code === 27 ||
      code === 110 ||
      code === 37 ||
      code === 39
    );
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
          trx :this.trx
        };
      }),
      switchMap(({ bnb, Eth, matic, btt,trx }) => {
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

  getCurrency(event: any) {
    this.selectedCrypto = event.target.value;
    this.f.initialBudget?.reset();
    this.f.initialBudgetInUSD.reset();
    let el = this.initialBudgetElement?.nativeElement;
    // var width = parseInt(el.style.width);
    this.renderer.setStyle(el,'width', (el.value.length + 1) * 12 + 'px');
     //el.style.width = (el.value.length + 1) * 12 + 'px';
    this.defaultAmount = this.f.currency.value;
  }

  toggleReachLimitFormControl(e: any) {
    this.isReachLimitActivated = e;

    if (this.isReachLimitActivated) {
      this.ratios.controls.forEach((control: AbstractControl) => {
        (control as UntypedFormGroup).setControl('reachLimit', new UntypedFormControl(''));
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
    /*if (event.target.value.length === 0 && event.key === '0') {
      event.preventDefault();
    }*/
    
  }
  keyPressNumbersWithDecimal(event :any) {
    
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  convertcurrency(event: any): void {
    let currency = '';
    var getamount: any = this.form.get('initialBudget')?.value;
    let getusd: any = this.form.get('initialBudgetInUSD')?.value;
    let sendamount = getamount?.toString();
    let sendusd = getusd?.toString();

    if (event === 'usd' && Number(sendusd) > this.maxNumber) {
      sendusd = sendusd.slice(0, 9);
      this.form.get('initialBudgetInUSD')?.setValue(sendusd);
    } else {
      this.selectedCryptoSend = currency;
      if (this.selectedCryptoSend) {
        currency = this.selectedCryptoSend;
      } else {
        currency = this.form.get('currency')?.value;
      }
      if (
        event === 'amount' &&
        sendamount !== undefined &&
        !isNaN(sendamount)
      ) {
        this.amountUsd = this.selectedCryptoDetails.price * sendamount;
        this.amountUsd = this.showNumbersRule.transform(this.amountUsd);
        if (this.amountUsd < 0.1) {
          this.amountUsd = new Big(this.amountUsd).toFixed(8).toString();
        }
        if (isNaN(this.amountUsd)) {
          this.amountUsd = '';
          this.amount = '';
        }
      } else if (
        event === 'amount' &&
        (sendamount === undefined || isNaN(sendamount))
      ) {
        this.amountUsd = '';
      }
      if (event === 'usd' && sendusd !== undefined && !isNaN(sendusd)) {
        this.amount = sendusd / this.selectedCryptoDetails.price;
        this.amount = this.showNumbersRule.transform(this.amount);
        if (
          sendamount === '0.00000000' ||
          sendusd === '' ||
          isNaN(this.amount)
        ) {
          this.amountUsd = '';
          this.amount = '';
        }
      } else if (event === 'usd' && (sendusd === undefined || isNaN(sendusd))) {
        this.amount = '';
      }
      this.editwidthInput();
    }
  }
  //convert currency to usd
  // convertcurrency(event: any): void {
  //   let currency = '';
  //   let currencyreceive = '';
  //   var getamountreceive: any = this.receiveform.get('Amount')?.value;
  //   let getusdreceive: any = this.receiveform.get('AmountUsd')?.value;
  //   let receiveamount = getamountreceive?.toString();
  //   let receiveusd = getusdreceive?.toString();
  //   if (event === 'usdreceive' && Number(receiveusd) > this.maxNumber) {
  //     receiveusd = receiveusd.slice(0, 9);
  //     this.receiveform.get('AmountUsd')?.setValue(receiveusd);
  //   } else {
  //     this.selectedCryptoSend = currency;
  //     if (this.selectedCryptoSend) {
  //       currencyreceive = this.selectedCryptoSend;
  //     } else {
  //       currencyreceive = this.amountdefault;
  //     }
  //     this.dataList?.forEach((crypto: any) => {
  //       if (
  //         event === 'amountreceive' &&
  //         receiveamount !== undefined &&
  //         !isNaN(receiveamount)
  //       ) {
  //         if (crypto.symbol === currencyreceive) {
  //           this.amountUsd = crypto.price * receiveamount;
  //           this.amountUsd = this.showNumbersRule.transform(this.amountUsd);
  //           if (isNaN(this.amountUsd)) {
  //             this.amountUsd = '';
  //             this.amount = '';
  //           }
  //         }
  //       } else if (
  //         event === 'amountreceive' &&
  //         (receiveamount === undefined || isNaN(receiveamount))
  //       ) {
  //         this.amountUsd = '';
  //       }
  //       if (event === 'usdreceive' && receiveusd !== '' && !isNaN(receiveusd)) {
  //         if (crypto.symbol === currencyreceive) {
  //           this.amount = receiveusd / crypto.price;
  //           this.amount = this.showNumbersRule.transform(this.amount);
  //           if (
  //             receiveamount === '0.00000000' ||
  //             receiveusd === '' ||
  //             isNaN(this.amount)
  //           ) {
  //             this.amountUsd = '';
  //             this.amount = '';
  //           }
  //         }
  //       } else if (
  //         event === 'usdreceive' &&
  //         (receiveusd === '' || isNaN(receiveusd))
  //       ) {
  //         this.amount = '';
  //       }
  //     });
  //     this.editwidthInput();
  //   }
  // }
  editwidthInput() {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    //  elementinputusd.style.width = 40 + 'px';
    if (elementinputusd)
    this.renderer.setStyle(elementinputusd,'width', elementinputusd.value.length + 1.2 + 'ch');
      //elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }
  ngAfterViewChecked(): void {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    if (elementinputusd)
    this.renderer.setStyle(elementinputusd,'width', elementinputusd.value.length + 1.2 + 'ch');
    //elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }
  resetForm() {
    this.form.reset();
    this.network = '';
    this.token = '';
    // this.amountUsd = null;
    this.amount = '';
  }
  linstingCrypto(event: any) {
    if (event.symbol !== this.form.get('currency')?.value) {
      this.form.get('initialBudget')?.reset();
      this.form.get('initialBudgetInUSD')?.reset();
    }
    this.selectedCryptoDetails = event;
    this.form.get('currency')?.setValue(this.selectedCryptoDetails.symbol);
    console.log({event})

    this.amountdefault = this.form.get('currency')?.value;
    this.selectedCryptoSend = event.symbol;
    this.symbol = event.symbol;
    this.cryptoSymbol = event.symbol;
    this.networks = event.network;
    this.decimals = event.decimal;
    this.token = event.AddedToken;
    if (this.networks === 'ERC20') {
      this.coinType = false;
      this.gazcurrency = 'ETH';
    } else if (this.networks === 'BEP20') {
      this.coinType = false;
      this.gazcurrency = 'BNB';
    } else if (this.networks === 'BTC') {
      this.coinType = true;
      this.gazcurrency = 'ETH';
    } else if (this.networks === 'POLYGON') {
      this.gazcurrency = 'MATIC';
      // this.gazcurrency = 'ETH';
    } else if (this.networks === 'BTT') {
      this.gazcurrency = 'BTT';
      // this.gazcurrency = 'ETH';
    } else if (this.networks === 'TRON') {
      this.gazcurrency = 'TRX';
      // this.gazcurrency = 'ETH';
    }
    setTimeout(() => {
      if (this.networks === 'ERC20' || this.networks === 'BTC') {
        this.gazsend = this.eRC20Gaz;
      }

      if (this.networks === 'BEP20') {
        this.gazsend = this.bEPGaz;
      }
      if (this.networks === 'POLYGON') {
        this.gazsend = this.polygonGaz;
      }
      if (this.networks === 'BTT') {
        this.gazsend = this.bttGaz;
      }

      if (this.networks === 'TRON') {
        this.gazsend = this.trxGaz;
      }
    }, 4000);

    this.dataList?.forEach((crypto: any) => {
      if (this.networks === 'ERC20' || this.networks === 'BTC') {
        this.gazsend = this.eRC20Gaz;
        if (crypto.symbol === 'ETH') {
          this.gazsendether = (this.gazsend / crypto.price).toFixed(8);
        }
      }
      if (this.networks === 'BEP20') {
        this.gazsend = this.bEPGaz;
        if (crypto.symbol === 'BNB') {
          this.gazsendether = (this.gazsend / crypto.price).toFixed(8);
        }
      }
      if (this.networks === 'POLYGON') {
        this.gazsend = this.polygonGaz;
        if (crypto.symbol === 'MATIC') {
          this.gazsendether = (this.gazsend / crypto.price).toFixed(8);
        }
      }
      if (this.networks === 'BTT') {
        this.gazsend = this.polygonGaz;
        if (crypto.symbol === 'BTT') {
          this.gazsendether = (this.gazsend / crypto.price).toFixed(8);
        }
      }
    });
  }
  setMaxAmount(): void {
    let selectedCurrency = this.f.currency.value;
    let balance: any = this.dataList.find(
      (crypto: any) => crypto.symbol === selectedCurrency
    );
    this.f.initialBudget.setValue(balance?.quantity);
  }

  onClickAmount(): void {
    let currency = '';
    this.selectedCryptoSend = currency;

    if (this.selectedCryptoSend) {
      currency = this.selectedCryptoSend;
    } else {
      currency = this.form.get('currency')?.value;
    }

    if (!currency || currency === '?') {
      this.noCryptoSelected = true;
      setTimeout(() => {
        this.noCryptoSelected = false;
      }, 3000);
    }
    if (currency) {
      this.dataList?.forEach((crypto: any) => {
        if (crypto.symbol === currency) {
          let quantity = this.showNumbersRule.transform(crypto.quantity);
          //  let totalBal = this.showNumbersRule.transform(crypto.total_balance);
          crypto.total_balance = parseFloat(crypto.total_balance + '');
          crypto.total_balance = crypto?.total_balance?.toFixed(2);
          this.form.get('initialBudget')?.setValue(quantity),
            this.form.get('initialBudgetInUSD')?.setValue(crypto.total_balance);

          this.gazproblem = false;
          if (
            currency === 'ETH' ||
            currency === 'BNB' ||
            currency === 'MATIC'
          ) {
            this.difference = crypto.total_balance - this.gazsend;
            this.newquantity = this.difference / crypto.price;
            let newqua = this.showNumbersRule.transform(this.newquantity);
            let quantit = this.showNumbersRule.transform(crypto.quantity);

            if (this.difference < 0) {
              this.form.get('initialBudget')?.setValue(quantit),
                this.form.get('initialBudgetInUSD')?.setValue('0');
              this.gazproblem = true;
              setTimeout(() => {
                this.gazproblem = false;
              }, 3000);
            } else {
              this.form.get('initialBudget')?.setValue(newqua),
                this.form
                  .get('initialBudgetInUSD')
                  ?.setValue(this.difference.toFixed(2));

              this.gazproblem = false;
            }
          }
        }
      });
    }
  }

  private checkValidForm() {
    if (this.form.valid) {
      this.validFormBudgetRemun.emit(true);
    } else {
      this.validFormBudgetRemun.emit(false);
    }
  }
}
