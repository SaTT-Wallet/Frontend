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
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { forkJoin, fromEvent, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { GazConsumedByCampaign, ListTokens } from '@app/config/atn.config';
import { checkIfEnoughBalance } from '@helpers/form-validators';
import { Campaign } from '@app/models/campaign.model';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
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

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ShowNumbersRule } from '@app/shared/pipes/showNumbersRule';
import { Big } from 'big.js';
import { CampaignsService } from '@app/campaigns/facade/campaigns.facade';
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

  @Input()
  id = '';

  @Input()
  draftData!: Campaign;
  @Input() notValidBudgetRemun: any;
  @Output() validFormBudgetRemun = new EventEmitter();

  form = new FormGroup({
    ratios: new FormArray([], [Validators.required])
  });

  @ViewChild('initialBudgetElement')
  initialBudgetElement!: ElementRef<HTMLInputElement>;

  @ViewChild('initialBudgetInUSDElement')
  initialBudgetInUSDElement!: ElementRef<HTMLInputElement>;

  initialBudgetInputWidth$ = new Observable<string>();
  initialBudgetInUSDInputWidth$ = new Observable<string>();
  eRemunerationType = ERemunerationType; // A variable reference to access enum from template
  selectRemunerateValue = ERemunerationType.Performance;
  // isFacebookSelected = false;
  // isYoutubeSelected = false;
  // isInstagramSelected = false;
  // isTwitterSelected = false;
  // isLinkedinSelected = false;
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
  cryptoToDropdown: any;
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

  constructor(
    private service: DraftCampaignService,
    private convertFromWeiTo: ConvertFromWei,
    private fetchservice: CryptofetchServiceService,
    private walletStore: WalletStoreService,
    private cdref: ChangeDetectorRef,
    private walletFacade: WalletFacadeService,
    private showNumbersRule: ShowNumbersRule,
    private CampaignsService: CampaignsService,
    private campaignsStoreService: CampaignsStoreService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
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
    this.parentFunction();
    this.getUserCrypto();
    // this.campaign$ = this.campaignsStoreService.updateOneById;
    // this.campaign$.pipe().subscribe((campaign) => {
    //   this.campaign = campaign;
    //   console.log(campaign, 'campaign from remi');
    // });

    this.form = new FormGroup(
      {
        initialBudget: new FormControl('0', {
          validators: Validators.compose([Validators.required])
        }),
        initialBudgetInUSD: new FormControl('0', {
          validators: Validators.compose([Validators.required])
        }),
        currency: new FormControl(null, {
          validators: Validators.required
        }),
        // remuneration: new FormControl({
        //   text: eRemunerationType.Performance,
        //   value: eRemunerationType.Performance,
        // }),
        remuneration: new FormControl(this.eRemunerationType.Performance),
        ratios: new FormArray([]),
        bounties: new FormArray([])
      },
      {
        validators: [
          checkIfEnoughBalance(this.walletStore),
          Validators.required,
          InitiaBudgetValidator,
          customValidateRequired(),
          customValidateInsufficientBudget()
        ]
      }
    );

    this.saveForm();
    this.cryptoSymbol = 'SATT';
    this.showSelectedValue = false;
    this.selectedBlockchain = 'erc20';
    this.f.currency?.setValue('SATT');
  }

  ngAfterContentChecked() {
    this.amountUsd = '0.00';
    this.cdref.detectChanges();
    this.cdref.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.isSelectedYoutube &&
      changes.isSelectedYoutube.currentValue === true
    )
      this.toggleOracle('youtube');
    else if (
      this.isSelectedTwitter &&
      changes.isSelectedTwitter.currentValue === true
    )
      this.toggleOracle('twitter');
    else if (
      this.isSelectedFacebook &&
      changes.isSelectedFacebook.currentValue === true
    )
      this.toggleOracle('facebook');
    else if (
      this.isSelectedInstagram &&
      changes.isSelectedInstagram.currentValue === true
    )
      this.toggleOracle('instagram');
    else if (
      this.isSelectedLinkedin &&
      changes.isSelectedLinkedin.currentValue === true
    )
      this.toggleOracle('linkedin');

    if (changes.draftData && changes.draftData.currentValue) {
      this.form?.patchValue(this.draftData, { emitEvent: false });
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

      this.selectRemunerateValue = this.draftData
        .remuneration as ERemunerationType;

      this.cryptoSymbol = this.draftData.currency.name;
      this.selectedBlockchain = this.draftData.currency.type;
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

      this.setPreSelectedOracles();
      // this.setPreSelectedMissions();
      //this.form.updateValueAndValidity();
    }
  }

  saveForm() {
    this.form.valueChanges
      .pipe(
        tap((_) => {
          // this.notValidBudgetRemun=false
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

          if (this.draftData.id && this.form.valid) {
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    let el = this.initialBudgetElement?.nativeElement;
    let el2 = this.initialBudgetInUSDElement?.nativeElement;
    // el.style.width = 25 + "px";
    // el2.style.width = 40 + "px";
    // let initialBudgetElementChanges$ = fromEvent(el, "keydown");
    // let initialBudgetInUSDElementChanges$ = fromEvent(el2, "keydown");
    // this.initialBudgetInputWidth$ = initialBudgetElementChanges$.pipe(
    //   map((event: any) => event.keyCode),
    //   filter((keyCode) => {
    //     return this.isValidKeyCode(keyCode);
    //   }),
    //   map((keyCode) => (el.value.length + 1) * 12 + "px")
    // );
    // this.initialBudgetInUSDInputWidth$ = initialBudgetInUSDElementChanges$.pipe(
    //   map((event: any) => event.keyCode),
    //   filter((keyCode) => {
    //     return this.isValidKeyCode(keyCode);
    //   }),
    //   map((keyCode) => (el2.value.length + 1) * 12 + "px")
    // );
    this.f.initialBudget.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        startWith('0'),
        filter((value) => value),
        distinctUntilChanged(),
        withLatestFrom(this.walletFacade.getCryptoList().pipe(startWith({}))),
        map(([value = 0, balances]) => {
          let selectedCurrency = (balances as any)?.listOfCrypto?.find(
            (crypto: any) => crypto.symbol === this.f.currency.value
          );
          return [this.replaceNonAlphanumeric(value), selectedCurrency];
        })
      )
      .subscribe(
        ([value, selectedCurrency]) => {
          this.form.patchValue(
            {
              initialBudgetInUSD: new Big(value || 0)
                .times(selectedCurrency?.price || 0)
                .toFixed(2)
                .toString()
            },
            { emitEvent: false }
          );
          // el.style.width = (el.value.length + 1) * 12 + "px";
          // el2.style.width = (el2.value.length + 1) * 12 + "px";
        },
        (err) => {}
      );
    this.f.initialBudgetInUSD.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        startWith('0'),
        filter((value) => value),
        distinctUntilChanged(),
        withLatestFrom(this.walletFacade.getCryptoList().pipe(startWith({}))),
        map(([value = 0, balances]) => {
          let selectedCurrency = (balances as any)?.listOfCrypto?.find(
            (crypto: any) => crypto.symbol === this.f.currency.value
          );
          return [this.replaceNonAlphanumeric(value), selectedCurrency];
        })
      )
      .subscribe(
        ([value, selectedCurrency]) => {
          if (selectedCurrency?.price) {
            this.form.patchValue(
              {
                initialBudget: new Big(value || 0)
                  .div(selectedCurrency?.price || 1)
                  .toFixed(2)
                  .toString()
              },
              { emitEvent: false }
            );
          }
          // el.style.width = (el.value.length + 1) * 12 + "px";
          // el2.style.width = (el2.value.length + 1) * 12 + "px";
        },
        (err) => {}
      );
  }

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
    return this.form.get('ratios') as FormArray;
  }

  get bounties() {
    return this.form.get('bounties') as FormArray;
  }

  getCategories(index: number) {
    return this.bounties.at(index).get('categories') as FormArray;
  }

  isFieldValid(form: AbstractControl, field: string) {
    return !form.get(field)?.valid && this.notValidBudgetRemun;
  }

  isValid(controlName: any) {
    return this.form?.get(controlName)?.invalid && this.validation;
  }

  populateRatiosFormArray(ratios: any[]): FormArray {
    const controls = ratios.map((ratio) => {
      const group = new FormGroup(
        {
          oracle: new FormControl(ratio.oracle),
          view: new FormControl(
            this.convertFromWeiTo.transform(
              ratio.view,
              this.draftData.currency.name
            ),
            [Validators.required]
          ),
          like: new FormControl(
            this.convertFromWeiTo.transform(
              ratio.like,
              this.draftData.currency.name
            ),
            [Validators.required]
          ),
          share: new FormControl(
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
          new FormControl(ratio.reachLimit, Validators.required)
        );
      }

      return group;
    });

    return new FormArray(controls);
  }

  populateBountiesFormArray(bounties: any[]) {
    const controls = bounties.map((bounty) => {
      const group = new FormGroup({
        oracle: new FormControl(bounty.oracle),
        categories: new FormArray(
          bounty.categories.map((category: any) => {
            return new FormGroup(
              {
                minFollowers: new FormControl(
                  category.minFollowers,
                  Validators.required
                ),
                maxFollowers: new FormControl(
                  category.maxFollowers,
                  Validators.required
                ),
                reward: new FormControl(
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

    return new FormArray(controls);
  }

  getUserCrypto() {
    this.walletFacade.cryptoList$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data: any) => {
        this.dataList = data;
        Object.preventExtensions(this.dataList);
        //  this.cryptoList = [...this.dataList.filter((data:any) => data.symbol.includes("SATT")).reverse(),...this.dataList.filter((data:any) => !data.symbol.includes("SATT")).reverse() ]

        // this.dataList?.sort(
        //   (a: any, b: any) =>
        //     parseFloat(b.total_balance) - parseFloat(a.total_balance)
        // );
        // for (const key in ListTokens) {
        //   this.dataList.forEach((data: any) => {
        //     if (key === data.symbol) {
        //       this.cryptoList.push(data);
        //     }
        //   });
        // }

        this.cryptoQuantity = (
          this.dataList.find(
            (crypto: any) => crypto.symbol === this.draftData.currency.name
          ) as any
        )?.quantity;

        //  this.dataList = data.listOfCrypto;
        // if (data.listOfCrypto.total_balance === "0") {
        //   this.dataList.total_balance = "0.00";
        // }
        this.dataList?.forEach((crypto: any) => {
          // crypto.type =
          //   crypto.network ?? ListTokens[crypto.symbol].type.toUpperCase();
          //  crypto.type = ListTokens[crypto.symbol]?.type;
          // crypto.undername2 = crypto.undername2 ?? crypto.symbol;
          // crypto.undername = crypto.undername ?? 'indispo';
          // crypto.typetab = crypto.type;
          // crypto.price = this.filterAmount(crypto.price + '');
          // crypto.variation = crypto.variation.toFixed(2) ?? "0";
          // crypto.quantity = this.filterAmount(crypto.quantity + "");
          // if (crypto.quantity.toString().startsWith('-')) {
          //   crypto.quantity = '0';
          // }
          // crypto.quantity = new Big(crypto.quantity)
          //   .round(10, Big.roundDown)
          //   .toFixed();
          //crypto.quantity = new Big(crypto.quantity)
          // crypto.total_balance = crypto.total_balance.toFixed(2);
        });
        this.dataList = [
          ...this.dataList.filter((data: any) => data.symbol === 'SATT'),
          ...this.dataList.filter((data: any) => data.symbol === 'USDT'),
          ...this.dataList.filter((data: any) => data.symbol === 'DAI'),
          ...this.dataList.filter((data: any) => data.symbol === 'SATTBEP20'),
          ...this.dataList.filter((data: any) => data.symbol === 'BUSD')
        ];
      });
  }

  parentFunction() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        return {
          bnb: this.bnb,
          Eth: this.eth
        };
      }),
      switchMap(({ bnb, Eth }) => {
        return forkJoin([
          this.walletFacade.getEtherGaz().pipe(
            tap((gaz: any) => {
              let price;
              price = gaz.gasPrice;
              this.gazsend = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                Eth
              ).toFixed(2);
              this.currency = this.gazsend;
            })
          ),
          this.walletFacade.getBnbGaz().pipe(
            tap((gaz: any) => {
              let price = gaz.gasPrice;
              this.bnbGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                bnb
              ).toFixed(2);

              if (this.gazsend === 'NaN') {
                this.gazsend = '';
                let price = gaz.gasPrice;
                this.bnbGaz = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  this.bnb
                ).toFixed(2);
              }
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
    var width = parseInt(el.style.width);
    el.style.width = (el.value.length + 1) * 12 + 'px';
    this.defaultAmount = this.f.currency.value;
  }

  toggleReachLimitFormControl(e: any) {
    this.isReachLimitActivated = e;

    if (this.isReachLimitActivated) {
      this.ratios.controls.forEach((control: AbstractControl) => {
        (control as FormGroup).setControl('reachLimit', new FormControl(''));
        (control as FormGroup).get('reachLimit')?.setValidators([
          Validators.required
          //  Validators.min(0),
          //alidators.max(100),
        ]);
      });
    } else {
      this.ratios.controls.forEach((control: AbstractControl) => {
        (control as FormGroup).removeControl('reachLimit');
      });
    }
  }

  onBlockchainChange(event: any) {
    this.selectedValue = '';
    if (event.target.value === 'erc20') {
      this.cryptoSymbol = 'SATT';
      this.showSelectedValue = false;
      this.selectedBlockchain = 'erc20';
      this.f.currency?.setValue('SATT');
      this.cryptoQuantity = this.dataList.find(
        (crypto: any) => crypto.symbol === 'SATT'
      ).quantity;
    } else {
      this.cryptoSymbol = 'SATTBEP20';
      this.showSelectedValue = false;
      this.selectedBlockchain = 'bep20';
      this.f.currency?.setValue('SATTBEP20');
      this.cryptoQuantity = this.dataList.find(
        (crypto: any) => crypto.symbol === 'SATTBEP20'
      ).quantity;
    }

    this.defaultAmount = this.f.currency.value;
    this.f.initialBudget?.setValue('0.00');
    this.f.initialBudgetInUSD?.setValue('0.00');
    //this.editwidthInput();
  }

  selectCurrency(name: string, quantity: string, symbol: string) {
    this.selectedValue = name;
    this.selectedCrypto = symbol;
    this.f.currency?.setValue(name);
    this.f.initialBudget.setValue('0.00');
    this.f.initialBudgetInUSD.setValue('0.00');
    this.f.currency.setValue(symbol);

    this.defaultAmount = this.f.currency.value;

    this.showSelectedValue = 'true';
    this.cryptoSymbol = symbol;
    this.cryptoQuantity = quantity;
  }
  setPreSelectedOracles() {
    let array = [];
    if (this.draftData.missions !== []) {
      array = this.draftData.missions;
      this.isSelectedFacebook = array.find(
        (elem: any) => elem.oracle === 'facebook'
      )
        ? true
        : false;
      this.isSelectedYoutube = array.find(
        (elem: any) => elem.oracle === 'youtube'
      )
        ? true
        : false;
      this.isSelectedInstagram = array.find(
        (elem: any) => elem.oracle === 'instagram'
      )
        ? true
        : false;
      this.isSelectedTwitter = array.find(
        (elem: any) => elem.oracle === 'twitter'
      )
        ? true
        : false;
      this.isSelectedLinkedin = array.find(
        (elem: any) => elem.oracle === 'linkedin'
      )
        ? true
        : false;
    }
  }

  selectRemunerateType(type: ERemunerationType) {
    this.selectRemunerateValue = type;
    this.f.remuneration.setValue(type);
    this.ratios.clear();
    this.bounties.clear();
    this.isSelectedFacebook = false;
    this.isSelectedInstagram = false;
    this.isSelectedTwitter = false;
    this.isSelectedYoutube = false;
    this.isSelectedLinkedin = false;
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

  toggleOracle(oracle: string) {
    if (
      this.isSelectedYoutube ||
      this.isSelectedFacebook ||
      this.isSelectedInstagram ||
      this.isSelectedTwitter ||
      this.isSelectedLinkedin
    ) {
      let group = new FormGroup({});
      if (this.f.remuneration.value === this.eRemunerationType.Performance) {
        group = new FormGroup(
          {
            oracle: new FormControl(oracle),
            view: new FormControl(null, [Validators.required]),
            like: new FormControl(null, [Validators.required]),
            share: new FormControl(null, [Validators.required])
          },
          customValidateRatios()
        );
        this.ratios.push(group);
        this.ratios.updateValueAndValidity();

        if (this.isReachLimitActivated) {
          group.setControl(
            'reachLimit',
            new FormControl(null, [Validators.required])
          );
          group.get('reachLimit')?.setValidators([
            Validators.required,
            Validators.min(1)
            //  Validators.max(100),
          ]);
        }
      } else {
        this.bounties.push(this.addNewBounty(oracle));
      }

      this.isSelectedTwitter =
        oracle === 'twitter' ? true : this.isSelectedTwitter;
      this.isSelectedFacebook =
        oracle === 'facebook' ? true : this.isSelectedFacebook;
      this.isSelectedYoutube =
        oracle === 'youtube' ? true : this.isSelectedYoutube;
      this.isSelectedInstagram =
        oracle === 'instagram' ? true : this.isSelectedInstagram;
      this.isSelectedLinkedin =
        oracle === 'linkedin' ? true : this.isSelectedLinkedin;
    } else {
      if (this.f.remuneration.value === this.eRemunerationType.Performance) {
        this.ratios.removeAt(
          this.ratios.value.findIndex((ratio: any) => ratio.oracle === oracle)
        );
      } else {
        this.bounties.removeAt(
          this.bounties.value.findIndex(
            (bounty: any) => bounty.oracle === oracle
          )
        );
      }
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
    }
  }

  addNewBounty(oracle?: string): FormGroup {
    return new FormGroup({
      oracle: new FormControl(oracle),
      categories: new FormArray(
        [this.newRewardCategory()],
        customValidateMaxMin()
      )
    });
  }

  newRewardCategory(): FormGroup {
    return new FormGroup(
      {
        minFollowers: new FormControl(null, [Validators.required]),
        maxFollowers: new FormControl(null, [Validators.required]),
        reward: new FormControl(null, [Validators.required])
      },
      customValidateBounties()
    );
  }

  addRemunerationCategory(bountyIndex: number): void {
    const categories = this.bounties.controls[bountyIndex].get(
      'categories'
    ) as FormArray;
    categories.push(this.newRewardCategory());
  }

  removeRemunerationCategory(
    bountyIndex: number,
    categoryIndex: number,
    oracle: string
  ) {
    const categories = this.bounties.controls[bountyIndex].get(
      'categories'
    ) as FormArray;
    if (categories.controls.length === 1) {
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
    if (event.target.value.length === 0 && event.key === '0') {
      event.preventDefault();
    }
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
  editwidthInput() {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    //  elementinputusd.style.width = 40 + 'px';
    if (elementinputusd)
      elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }
  ngAfterViewChecked(): void {
    let elementinputusd = this.inputAmountUsd?.nativeElement;
    if (elementinputusd)
      elementinputusd.style.width = elementinputusd.value.length + 1.2 + 'ch';
  }
  resetForm(network?: string) {
    this.form.reset();
    this.network = '';
    this.token = null;
    // this.amountUsd = null;
    this.amount = null;
  }
  linstingCrypto(event: any) {
    this.resetForm();
    this.selectedCryptoDetails = event;
    this.form.get('currency')?.setValue(this.selectedCryptoDetails.symbol);
    this.form.get('initialBudget')?.reset();
    this.form.get('initialBudgetInUSD')?.reset();
    this.amountdefault = this.form.get('currency')?.value;
    this.selectedCryptoSend = event.symbol;
    this.symbol = event.symbol;
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
    }
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
          let totalBal = this.showNumbersRule.transform(crypto.total_balance);
          this.form.get('initialBudget')?.setValue(quantity),
            this.form.get('initialBudgetInUSD')?.setValue(crypto.total_balance);

          this.gazproblem = false;
          if (currency === 'ETH' || currency === 'BNB') {
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

  // setPreSelectedMissions() {
  //   let array = [];
  //   if (this.draftData.missions !== []) {
  //     array = this.draftData.missions;
  //     console.log(array, 'array');
  //     this.isFacebookSelected = array.find(
  //       (elem: any) => elem.oracle === 'facebook'
  //     )
  //       ? true
  //       : false;
  //     this.selectedFacebook.emit(this.isFacebookSelected);
  //     // if (this.isFacebookSelected === true) {
  //     //   this.selectedFacebook.emit(true);
  //     //   console.log(this.isFacebookSelected, 'fb selected');
  //     // }

  //     this.isYoutubeSelected = array.find(
  //       (elem: any) =>
  //         elem.oracle === 'youtube' && elem.oracle.subMission.length > 0
  //     )
  //       ? true
  //       : false;

  //     if (this.isYoutubeSelected === true) {
  //       this.selectedYoutube.emit(true);
  //       console.log(this.isYoutubeSelected, 'youu selected');
  //     }
  //     this.isInstagramSelected = array.find(
  //       (elem: any) =>
  //         elem.oracle === 'instagram' && elem.oracle.subMission.length > 0
  //     )
  //       ? true
  //       : false;
  //     if (this.isInstagramSelected === true) {
  //       this.selectedInstagram.emit(true);
  //     }
  //     this.isTwitterSelected = array.find(
  //       (elem: any) =>
  //         elem.oracle === 'twitter' && elem.oracle.subMission.length > 0
  //     )
  //       ? true
  //       : false;
  //     if (this.isTwitterSelected === true) {
  //       this.selectedTwitter.emit(true);
  //     }
  //     this.isLinkedinSelected = array.find(
  //       (elem: any) =>
  //         elem.oracle === 'linkedin' && elem.oracle.subMission.length > 0
  //     )
  //       ? true
  //       : false;
  //     if (this.isLinkedinSelected === true) {
  //       this.selectedLinkedin.emit(true);
  //     }
  //   }
  // }
}
