/* eslint-disable prettier/prettier */
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  OnDestroy,
  Inject,
  HostListener
} from '@angular/core';
('@angular/core');
import { ChartDataSets, ChartType } from 'chart.js';
// @ts-ignore
import { Big } from 'big.js';
import { WalletStoreService } from '@core/services/wallet-store.service';

import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  pattContact,
  pattEmail,
  id_campaign_to_participate,
  pattPassword
} from '@config/atn.config';
import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
import { Color, Label } from 'ng2-charts';
import { User } from '@app/models/User';
import { AuthService } from '@core/services/Auth/auth.service';
import introJs from 'intro.js';
import { DomSanitizer } from '@angular/platform-browser';

import { MediaMatcher } from '@angular/cdk/layout';

import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import {
  filter,
  takeUntil,
  mergeMap,
  tap,
  map,
  catchError,
  take,
  shareReplay,
  first
} from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { forkJoin, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '@app/core/services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { MatchPasswordValidator } from '@app/helpers/form-validators';
import { environment as env } from './../../environments/environment';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, OnDestroy {
  hideRedBloc: any;
  percentProfil: any;
  versionText: any = 'New Wallet';
  loadingPopUp: boolean = false;

  @ViewChild('myCanvas1') canvas1!: ElementRef;
  @ViewChild('myCanvas2') canvas2!: ElementRef;
  @ViewChild('myCanvas3') canvas3!: ElementRef;
  @ViewChild('welcomeModal', { static: false })
  public welcomeModal!: TemplateRef<any>;

  @ViewChild('createTronWalletModal', { static: false })
  private createTronWalletModal!: TemplateRef<any>;

  @ViewChild('createWalletV2Modal', { static: false })
  private createWalletV2Modal!: TemplateRef<any>;

  @ViewChild('modalMaintenance', { static: false })
  private modalMaintenance!: TemplateRef<any>;

  @ViewChild('setPwdTransactionModal', { static: true })
  private setPwdTransactionModal!: TemplateRef<any>;

  @ViewChild('tronWalletCreatedSuccessModal', { static: false })
  private tronWalletCreatedSuccessModal!: TemplateRef<any>;

  @ViewChild('migration', { static: false })
  private migration!: TemplateRef<any>;
  showSpinnerTransactionPassword: boolean = false;
  showModal: Boolean = false;
  showPass: boolean = false;
  subscription: any;
  tronWalletPassword = '';
  walletPassword = '';
  WalletPasswordTransaction = '';
  errorMsg = '';
  passwordWrong: string = '';
  transactionPasswordWrong: string = '';
  transactionPasswordSuccess: string = '';
  tronWalletAddress = '';
  onDestroy$ = new Subject();
  myModal: any;
  buttonClick: Boolean = false;
  urlImgCondition = '';
  color: any;
  show = false;
  successUpper = false;
  successLower = false;
  successNumber = false;
  successSpecial = false;
  successWhitespaces = false;
  successLength = false;
  isV1: Boolean = localStorage.getItem('wallet_version') === 'v1';
  lineChartDataMonth: ChartDataSets[] = [
    {
      data: [
        { x: '01/02/2021', y: 0 },
        { x: '05/02/2021', y: 0 },
        { x: '10/02/2021', y: 0 },
        { x: '20/02/2021', y: 0 },
        { x: '25/02/2021', y: 0 },
        { x: '28/02/2021', y: 0 },
        { x: '28/02/2021', y: 0 }
      ]
    }
  ];
  lineChartDataDaily: ChartDataSets[] = [
    {
      // borderColor: "#80b6f4",
      // pointBorderColor: "#80b6f4",
      // pointBackgroundColor: "#80b6f4",
      // pointHoverBackgroundColor: "#80b6f4",
      // pointHoverBorderColor: "#80b6f4",
      // pointBorderWidth: 10,
      // pointHoverRadius: 10,
      // pointHoverBorderWidth: 1,
      // pointRadius: 3,
      // fill: true,
      //       borderWidth: 4,
      // backgroundColor:background_1 ,
      //pointBackgroundColor: 'white',
      //	borderWidth: 1,
      //	borderColor: '#911215',

      data: [
        { x: '19/02/2021', y: 0 },
        { x: '20/02/2021', y: 0 },
        { x: '21/02/2021', y: 0 },
        { x: '22/02/2021', y: 0 },
        { x: '23/02/2021', y: 0 },
        { x: '24/02/2021', y: 0 },
        { x: '25/02/2021', y: 0 }
      ]
    }
  ];

  lineChartDataSemaine: ChartDataSets[] = [
    {
      data: [
        { x: '6/1/2021', y: 0 },
        { x: '05/27/2021', y: 0 },
        { x: '05/27/2021', y: 0 },
        { x: '05/20/2021', y: 0 },
        { x: '05/06/2021', y: 0 },
        { x: '04/30/2021', y: 0 },
        { x: '04/23/2021', y: 0 }
      ]
    }
  ];
  lineChartLabelsMonth: Label[] = [
    '30/12/2020',
    '05/27/2021',
    '05/28/2021',
    '05/29/2021',
    '05/30/2021',
    '05/31/2021',
    '6/1/2021'
  ];
  lineChartLabelsDaily: Label[] = [
    '05/26/2021',
    '05/27/2021',
    '05/28/2021',
    '05/29/2021',
    '05/30/2021',
    '05/31/2021',
    '6/1/2021'
  ];
  lineChartLabelsSemaine: Label[] = [
    '04/23/2021',
    '04/30/2021',
    '05/06/2021',
    '05/13/2021',
    '05/20/2021',
    '05/27/2021',
    '6/1/2021'
  ];

  lineChartOptionsDaily = {
    options: {
      layout: {
        padding: {
          left: 50
        }
      }
    },
    legend: {
      display: true,
      labels: {
        // fontColor: "#FFF",
      }
    },
    responsive: true,
    cornerRadius: 70,

    scales: {
      xAxes: [
        {
          display: false,

          scaleLabel: {
            display: false
          },

          gridLines: {
            display: false
          },
          ticks: {
            fontColor: 'white',
            padding: -30,
            display: true
            //labelOffset: -20,
            // fontSize: 10,
          }
        }
      ],
      yAxes: [
        {
          y: {
            type: 'linear',
            ticks: {
              suggestedMin: 0, // minimum will be 0, unless there is a lower value.
              // OR //
              beginAtZero: true // minimum value will be 0.
            }
          },
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 0,
            beginAtZero: true,
            steps: 10,
            stepValue: 50,
            max: 5000,
            display: false
          }
        }
      ]
    }
  };
  lineChartOptionsMonthly = {
    legend: {
      display: true,
      labels: {
        fontColor: '#FFF'
      }
    },
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      xAxes: [
        {
          display: false,
          autoSkip: false,
          offset: false,
          scaleLabel: {
            display: true
          },

          gridLines: {
            display: true
          },
          ticks: {
            fontColor: 'white',
            padding: -30,
            display: true,
            steps: 3
          }
        }
      ],
      yAxes: [
        {
          y: {
            type: 'linear',
            ticks: {
              suggestedMin: 0, // minimum will be 0, unless there is a lower value.
              // OR //
              beginAtZero: true // minimum value will be 0.
            }
          },
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 0,
            beginAtZero: true,
            steps: 10,
            stepValue: 50,
            max: 5000,
            display: false
          }
        }
      ]
    }
  };
  lineChartOptionsWeekly = {
    legend: {
      display: true,
      labels: {
        fontColor: '#FFF'
      }
    },
    responsive: true,

    scales: {
      xAxes: [
        {
          display: false,

          scaleLabel: {
            display: false
          },

          gridLines: {
            display: false
          },
          ticks: {
            fontColor: 'white',
            padding: -30
          }
        }
      ],
      yAxes: [
        {
          y: {
            type: 'linear',
            ticks: {
              suggestedMin: 0, // minimum will be 0, unless there is a lower value.
              // OR //
              beginAtZero: true // minimum value will be 0.
            }
          },
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 0,
            beginAtZero: true,
            steps: 10,
            stepValue: 50,
            max: 5000,
            display: false
          }
        }
      ]
    }
  };

  lineChartColors: Color[] = [
    {
      // backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderWidth: 0,
      // backgroundColor: 'rgba(255, 255, 255, 0.3)',
      // backgroundColor: ' rgba(0, 0, 0, 0.1)',
      backgroundColor: '#4048FF',
      // borderColor: 'rgba(255, 255, 255, 0.3)',
      // pointBackgroundColor: "#fff",
      pointBorderColor: '#0062ff',
      pointRadius: 0

      // pointBorderWidth:0,
    }
  ];

  lineChartType: ChartType = 'line';
  lineChartLegend = false;
  lineChartPlugins = [];
  showMonth: boolean = false;
  showDaily: boolean = false;
  showSemaine: boolean = false;
  user!: User;

  // @ts-ignore
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @Input() cryptoSatt: any;

  datechartsfirst: any;
  datechartssecond: any;
  datechartsthird: any;
  balancecharts!: any;
  balancechartsmonth!: any;
  balancechartsweekly!: any;
  balancechartsfirst!: any;
  balancechartssecond!: any;
  balancechartsthird!: any;
  dateconvertfirst: any;
  dateconvertsecond: any;
  dateconvertthird: any;
  balancechartsfourth: any;
  dateconvertfourth: any;
  datechartsfourth: any;
  balancechartsfive: any;
  dateconvertfive: any;
  datechartsfive: any;
  balancechartssix: any;
  dateconvertsix: any;
  datechartssix: any;
  balancechartsseven: any;
  dateconvertseven: any;
  datechartsseven: any;
  dateconverts: any;
  dateconvertsmonth: any;
  dateconvertsweekly: any;
  datecharts: any;
  datechartsmonth: any;
  datechartsweekly: any;
  variationamount: any;
  dataList: any;
  arrowup: boolean = false;
  arrowvar: any;
  toggle: boolean = true;
  isChecked: boolean = false;
  picUserUpdated: boolean = false;

  public getScreenWidth: any;
  public getScreenHeight: any;

  private totalBalance$ = this.walletFacade.totalBalance$;
  tronErrorMessage = '';
  height: any = '300px';
  walletV2ErrorMessage = '';
  existV1: any;
  existV2: any;
  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }
  @ViewChild('checkUserLegalKYCModal') checkUserLegalKYCModal!: ElementRef;
  form: UntypedFormGroup;
  sendform: UntypedFormGroup;
  formUpdateTransactionPassword: UntypedFormGroup;

  public hasAnimation: string = '';
  showSpinner!: boolean;
  dropDownSection: any = [];
  hidePortfolio: boolean = true;
  hasWalletV2: boolean = false;
  @Output() onMakeAnimation: EventEmitter<string> = new EventEmitter();
  arrow: string = '';
  arrowColor: string = '';
  currency: any;
  @Input() cryptoData: any;
  sattvAmount: any;
  etherInWei = new Big(1000000000000000000);
  btcInSatoshi = new Big(100000000);
  bnbGaz: any;
  $q = 0;
  res = 0;
  btc = 0;
  totalAmount: string = '';
  sattToEthPrice: string = '';
  sattToBtcPrice: string = '';
  etherBalance: string = '';
  sattBalance: string = '';
  accountAdress: string = '';
  currentUser: any;
  sattPrice = 0;
  eth = 0;
  validation = false;
  showButtonSend: boolean = true;
  showButtonReceive: boolean = true;
  loadingButtonReceive!: boolean;
  loadingButton!: boolean;
  selectedOptions: any = [];
  loading: boolean = false;
  public estimate: any;
  data: any;
  emailNotCorrect!: boolean;
  balanceNotEnough: boolean = false;
  wrongpassword: boolean = false;
  gazproblem: boolean = false;
  noCryptoSelected: boolean = false;
  noContact: boolean = false;
  selectedCryptoSend: any;
  isSubmitting!: boolean;
  isSubmittingReceive!: boolean;

  introJS = introJs();
  intro1: string = '';
  intro2: string = '';
  intro3: string = '';
  intro4: string = '';
  // intro5: string = "";
  button: string = '';
  migrate: any;
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getScreenHeight = event.target.innerHeight;
    this.getScreenWidth = event.target.innerWidth;
  }
  constructor(
    private accountFacadeService: AccountFacadeService,
    private tokenStorageService: TokenStorageService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private walletStoreService: WalletStoreService,
    private authStoreService: AuthStoreService,
    public sidebarService: SidebarService,
    public modalService: NgbModal,
    public translate: TranslateService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    public mediaMatcher: MediaMatcher,
    private walletFacade: WalletFacadeService,
    private profileService: ProfileService,
    private toasterService: ToastrService,
    @Inject(DOCUMENT) private document: any
  ) {
    matcher: MediaQueryList;
    this.form = new UntypedFormGroup({
      contact: new UntypedFormControl(null, {
        validators: [Validators.required, Validators.pattern(pattEmail)]
      }),
      Amount: new UntypedFormControl(
        null,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      currency: new UntypedFormControl(null, Validators.required),
      message: new UntypedFormControl(null)
    });
    this.formUpdateTransactionPassword = new UntypedFormGroup(
      {
        old_password: new UntypedFormControl(null, Validators.required),
        password: new UntypedFormControl(null, {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(pattPassword)
          ]
        }),
        confirmPassword: new UntypedFormControl(null, [Validators.required])
      },
      { validators: MatchPasswordValidator() }
    );
    this.sendform = new UntypedFormGroup({
      contact: new UntypedFormControl(null, {
        validators: [Validators.required, Validators.pattern(pattContact)]
      }),
      Amount: new UntypedFormControl(
        null,
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      currency: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl(null, Validators.required)
    });
  }

  findMaxBalances(arr: any): void {
    let weeklyBalances: any = [];
    let monthlyBalances: any = [];
    let dailyBalances: any = [];

    if (arr.monthly) {
      arr.monthly.forEach((elem: any) => {
        monthlyBalances.push(parseInt(elem.Balance));
      });
    }

    if (arr.weekly) {
      arr.weekly.forEach((elem?: any) => {
        weeklyBalances?.push(parseInt(elem?.Balance));
      });
    }

    arr.daily.forEach((elem: any) => {
      dailyBalances.push(parseInt(elem.Balance));
    });

    this.lineChartOptionsDaily.scales.yAxes[0].ticks.max =
      Math.max(...dailyBalances) * 2;
    this.lineChartOptionsMonthly.scales.yAxes[0].ticks.max =
      Math.max(...monthlyBalances) * 2;
    this.lineChartOptionsWeekly.scales.yAxes[0].ticks.max =
      Math?.max(...weeklyBalances) * 2;
  }

  fillChart(data: any) {
    let x: any = this.lineChartDataDaily[0]?.data;
    let y: any = this.lineChartDataDaily[0]?.data;
    let r: any = this.lineChartLabelsDaily;

    let xmonth: any = this.lineChartDataMonth[0]?.data;
    let ymonth: any = this.lineChartDataMonth[0]?.data;
    let rmonth: any = this.lineChartLabelsMonth;

    let xweekly: any = this.lineChartDataSemaine[0]?.data;
    let yweekly: any = this.lineChartDataSemaine[0]?.data;
    // let rweekly: any = this.lineChartLabelsSemaine;
    // let currentWeek;
    let j = 6;
    // let z = 6;

    for (let i = 0; i <= 6; i++) {
      this.balancecharts = parseInt(data?.daily[i]?.Balance);
      this.datecharts = data.daily[i]?.convertDate;
      this.dateconverts = this.datecharts;
      if (data.monthly && data.monthly[i]) {
        this.balancechartsmonth = parseInt(data?.monthly[i]?.Balance);
        this.datechartsmonth = data.monthly[i]?.convertDate;
        this.dateconvertsmonth = this.datechartsmonth;
      }
      if (data.weekly && data.weekly[i]) {
        this.balancechartsweekly = parseInt(data?.weekly[i]?.Balance);
        this.datechartsweekly = data.weekly[i]?.convertDate;
        this.dateconvertsweekly = this.datechartsweekly;
      }
      if (!this.balancechartsweekly) {
        this.balancechartsweekly = 0;
      }

      x[i]['x'] = this.dateconverts;
      y[i]['y'] = this.balancecharts;

      xweekly[i]['x'] = this.dateconvertsweekly;
      yweekly[i]['y'] = this.balancechartsweekly;

      xmonth[i]['x'] = this.dateconvertsmonth;
      ymonth[i]['y'] = this.balancechartsmonth;

      let aDate = new Date();
      let aDateMonth = new Date();
      let aDateWeek = new Date();

      aDate.setDate(aDate.getDate() - i);
      let datedefaut = aDate.toLocaleDateString('en-US');

      aDateMonth.setMonth(aDateMonth.getMonth() - i);
      // let datedefautmonth = aDateMonth.toLocaleDateString('en-US');

      aDateWeek.setDate(aDateWeek.getDate() - i * 7);
      // let datedefautweek = aDateWeek.toLocaleDateString('en-US');

      // if (!data.weekly[i]?.convertDate) {
      //   if (!this.dateconvertsweekly) {

      //   rweekly[j] = datedefautweek;
      // } else {
      //   rweekly[j] = this.dateconvertsweekly;
      // }

      if (!this.dateconvertsmonth) {
        rmonth[i] = 0;
      } else {
        rmonth[i] = this.dateconvertsmonth;
      }

      if (!this.dateconverts) {
        r[j] = datedefaut;
      } else {
        r[j] = this.dateconverts;
      }
      // z--;
      j--;
    }
    const monthDataSize = data?.monthly?.length;
    const weekDataSize = data?.weekly?.length;
    const dayDataSize = data?.daily?.length;
    if (monthDataSize < 7 && monthDataSize > 0) {
      this.lineChartDataMonth = [
        {
          data: []
        }
      ];
      for (let i = 0; i < monthDataSize; i++) {
        this.balancechartsmonth = !!data.monthly[i]
          ? parseInt(data?.monthly[i]?.Balance)
          : 0;
        this.datechartsmonth = !!data.monthly[i]
          ? data.monthly[i]?.convertDate
          : '01/02/2021';
        this.dateconvertsmonth = this.datechartsmonth;
        // @ts-ignore
        this.lineChartDataMonth[0]?.data?.push({
          x: this.datechartsmonth,
          y: this.balancechartsmonth
        });
      }
    }
    if (weekDataSize < 7 && weekDataSize > 0) {
      this.lineChartDataSemaine = [
        {
          data: []
        }
      ];
      for (let i = 0; i < weekDataSize; i++) {
        this.balancechartsweekly = parseInt(data?.weekly[i]?.Balance);
        this.datechartsweekly = data.weekly[i]?.convertDate;
        this.dateconvertsweekly = this.datechartsweekly;
        // @ts-ignore
        this.lineChartDataSemaine[0]?.data?.push({
          x: this.datechartsweekly,
          y: this.balancechartsweekly
        });
      }
    }
    if (dayDataSize < 7 && dayDataSize > 0) {
      this.lineChartDataDaily = [
        {
          data: []
        }
      ];
      for (let i = 0; i < dayDataSize; i++) {
        this.balancecharts = parseInt(data?.daily[i]?.Balance);
        this.datecharts = data.daily[i]?.convertDate;
        this.dateconverts = this.datecharts;
        // @ts-ignore
        this.lineChartDataDaily[0]?.data?.push({
          x: this.datecharts,
          y: this.balancecharts
        });
      }
    }
  }

  checkPasswordLength(length: number): string {
    return (
      (length >= 8 && '../../assets/Images/sucessCondition.svg') ||
      '../../assets/Images/alertCondition.svg'
    );
  }

  checkPasswordUpper(success: boolean): string {
    return (
      (success && '../../assets/Images/sucessCondition.svg') ||
      '../../assets/Images/alertCondition.svg'
    );
  }

  checkPasswordLower(success: boolean): string {
    return (
      (success && '../../assets/Images/sucessCondition.svg') ||
      '../../assets/Images/alertCondition.svg'
    );
  }

  checkPasswordNumber(success: boolean): string {
    return (
      (success && '../../assets/Images/sucessCondition.svg') ||
      '../../assets/Images/alertCondition.svg'
    );
  }

  checkPasswordSpecial(success: boolean): string {
    return (
      (success && '../../assets/Images/sucessCondition.svg') ||
      '../../assets/Images/alertCondition.svg'
    );
  }

  checkPasswordWhite(success: boolean): string {
    return (
      (success && '../../assets/Images/sucessCondition.svg') ||
      '../../assets/Images/alertCondition.svg'
    );
  }

  // checkPasswordCriteria(criteria: string, value: string): string {
  //   switch(criteria) {
  //     case 'length':
  //       return (value.length >= 8 && '../../assets/Images/sucessCondition.svg') || '../../assets/Images/alertCondition.svg';
  //     case 'upper':
  //       return (/[A-Z]/.test(value) && '../../assets/Images/sucessCondition.svg') || '../../assets/Images/alertCondition.svg';
  //     case 'lower':
  //       return (/[a-z]/.test(value) && '../../assets/Images/sucessCondition.svg') || '../../assets/Images/alertCondition.svg';
  //     case 'number':
  //       return (/\d/.test(value) && '../../assets/Images/sucessCondition.svg') || '../../assets/Images/alertCondition.svg';
  //     case 'special':
  //       return (/[^A-Za-z0-9]/.test(value) && '../../assets/Images/sucessCondition.svg') || '../../assets/Images/alertCondition.svg';
  //     case 'white':
  //       return (!/\s/.test(value) && '../../assets/Images/sucessCondition.svg') || '../../assets/Images/alertCondition.svg';
  //     default:
  //       return '../../assets/Images/alertCondition.svg';
  //   }
  // }

  // checkRule(success: boolean, image: string): string {
  //   if (success) {
  //     this.urlImgCondition = '../../assets/Images/successCondition.svg';
  //   } else {
  //     this.urlImgCondition = image;
  //   }
  //   return this.urlImgCondition;
  // }
  shouldShowWarning(): boolean {
    return this.versionText === 'New Wallet';
  }

  shouldMigrate(): boolean {
    return (
      this.versionText === 'New Wallet' &&
      this.existV1 &&
      this.show &&
      this.existV2
    );
  }
  ngOnInit(): void {
    // this.modalService.open(this.setPwdTransactionModal, {
    //   backdrop: 'static',
    //   keyboard: false
    // });
    
    if (this.isV1) {
      this.lineChartColors[0].backgroundColor = '#696DE4';
    } else {
      this.lineChartColors[0].backgroundColor = '#4048FF';
    }
    this.formUpdateTransactionPassword.controls['confirmPassword'].disable();
    
    this.formUpdateTransactionPassword
      .get('password')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((pass: string) => {
        const regexUpper = /[A-Z]/g;
        const regexLower = /[a-z]/g;
        const regexNumber = /[0-9]+/g;
        const regexSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const regexWhitespaces = /\s/;

        this.successUpper = pass.match(regexUpper) != null;
        this.successLower = pass.match(regexLower) != null;
        this.successNumber = pass.match(regexNumber) != null;
        this.successSpecial = pass.match(regexSpecial) != null;
        this.successWhitespaces = pass.match(regexWhitespaces) == null;

        if (
          pass === '' ||
          pass == null ||
          this.formUpdateTransactionPassword.get('password')?.invalid
        ) {
          this.formUpdateTransactionPassword.get('confirmPassword')?.reset();
          this.formUpdateTransactionPassword.controls[
            'confirmPassword'
          ].disable();
        } else {
          this.formUpdateTransactionPassword.controls[
            'confirmPassword'
          ].enable();
        }
      });
    //creation modal maintenance
    // this.modalService.open(this.modalMaintenance, {
    //   backdrop: 'static',
    //   keyboard: false
    // });
    // creation modal maintenance

    this.loadingPopUp = false;
    this.migrate = this.tokenStorageService.getModaleMigrate();
    //this.getScreenHeight = window.innerHeight;
    this.hasWalletV2 = false;
   
    this.verifyUserWalletV2();
    this.totalbalancewallet();

    this.getScreenWidth = window.innerWidth;
    if (this.tokenStorageService.getWalletVersion() === 'v2') {
      this.versionText = 'Old Wallet';
      this.height = '250px';
    } else {
      this.versionText = 'New Wallet';
      this.height = '300px';
    }

    //this.verifyUserWalletV2();
    this.walletFacade
      .getAllWallet()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.existV1 = data.data.address;
        if (this.existV1 === null) {
          this.height = '250px';
        }

        this.existV2 = data.data.addressV2;
      });

    // this.dontShowAgain();
    // let data_profile = {
    //   onBoarding: false
    // };

    // this.profileSettingsFacade.updateProfile(data_profile).subscribe(() => {
    //   this.accountFacadeService.dispatchUpdatedAccount();
    // });
    
    this.walletFacade.getTotalBalance();
    
    this.walletFacade.getTotalBalance();
    if (!this.walletFacade.totalBalance$) {
      this.walletFacade.getTotalBalance();
    }
    this.hidePortfolio = true;
    this.hideRedBloc = this.tokenStorageService.getHideRedBloc();
    this.walletFacade
      .getBalanceChart()
      .pipe(
        map((res: any) => res.data),
        takeUntil(this.onDestoy$)
      )
      .subscribe((data: any) => {
        this.showDaily = true;
        this.fillChart(data);
        this.findMaxBalances(data);
      });
    this.getSecure();

    var c = <HTMLCanvasElement>this.document.getElementById('myCanvas');
    var ctx = c?.getContext('2d');
    var my_gradient = ctx?.createLinearGradient(0, 0, 0, 170);
    my_gradient?.addColorStop(0, 'black');
    my_gradient?.addColorStop(1, 'white');
    //ctx.fillStyle = my_gradient;
    ctx?.fillRect(20, 20, 150, 100);
    //this.verifyOnBoarding();
    this.verifyOnBoarding();
    setTimeout(() => {
      if (
        this.hasWalletV2
        // && this.migrate === 'close'
      )
        this.getDetails();
    }, 5500);

    if (!this.loadingPopUp) {
      setTimeout(() => {
        if (this.hasWalletV2 && this.migrate === 'open' && this.show) {
          //     this.modalService.open(this.setPwdTransactionModal, {
          //   backdrop: 'static',
          //   keyboard: false
          // });
          this.modalService.open(this.migration, {
            backdrop: 'static',
            keyboard: false
          });
          this.loadingPopUp = true;
        } else {
          this.loadingPopUp = true;
        }
      }, 5500);
    }
  }
  migrateButton(): void {
    this.walletFacade.verifyUserToken().pipe(first()).subscribe((res:any) => {
      if(res.message === "success") {
        if (this.show && this.hasWalletV2) {
          this.migrate = 'open';
          this.modalService.open(this.migration, {
            backdrop: 'static',
            keyboard: false
          });
        }
      } else this.expiredSession();
    }); 
    
  }


  getWalletVersion() {
    return this.tokenStorageService.getWalletVersion();
  }

  getBlockStyle() {
    if (this.isV1) {
      return {
        background: 'linear-gradient(180deg, #4048FF 0%, #C4C4C4 76.04%)'
      };
    } else {
      return {
        background: 'linear-gradient(180deg, #4048ff 0%, #00cc9e 310.62%)'
      };
    }
  }

  getBalanceContainerClass() {
    return this.getWalletVersion() === 'v2' ? 'balance_container2' : 'balance_container';
  }

  closeModaleMaintenace() {
    this.closeModal(this.modalMaintenance);
  }
  //Create WALLET V2
  createWalletV2() {
    this.walletV2ErrorMessage = '';
    this.buttonClick = true;
    this.walletFacade
      .createNewWalletV2(this.WalletPasswordTransaction)
      .pipe(
        catchError((err) => {
          this.buttonClick = false;
          if (err.error.error === 'same transaction pass ') {
            this.walletV2ErrorMessage =
              this.translate.instant('sameOldPassword');
            this.wrongpassword = true;
            setTimeout(() => {
              this.WalletPasswordTransaction = '';
              this.walletV2ErrorMessage = '';
              this.wrongpassword = false;
            }, 3000);
          } else if (err.error.error === 'same password') {
            this.walletV2ErrorMessage = this.translate.instant('DontUseSameLogin');
            this.wrongpassword = true;
            setTimeout(() => {
              this.WalletPasswordTransaction = '';
              this.walletV2ErrorMessage = '';
              this.wrongpassword = false;
            }, 3000);
          } else if (err.error.error === 'Wallet already exist') {
            this.walletV2ErrorMessage = this.translate.instant('WalletAlreadyExist');

            setTimeout(() => {
              this.closeModal(this.createWalletV2Modal);
            }, 2000);
          } else {
            /*else if (err.error.error === 'Key derivation failed - possibly wrong password'){
            this.wrongpassword = true;
            this.walletV2ErrorMessage ='Wrong password, please try again';
            setTimeout(
              () => (
                (this.walletV2ErrorMessage = ''),
                (this.WalletPasswordTransaction = ''),
                ( this.wrongpassword = false)
              ),
              3000
            );
            
          }*/
            this.walletV2ErrorMessage =
              'Something went wrong please try again!';
          }

          return of(null);
        })
      )
      /*.pipe(
        catchError((err) => {
          if(err.err.err === 'Key derivation failed - possibly wrong password') {
            this.walletV2ErrorMessage = 'Wrong password';
          } else {
            this.walletV2ErrorMessage = err.err.err
          }
          return of(null);
    }), filter(res => res !== null))*/
      .subscribe((response: any) => {
        if(response?.name === "JsonWebTokenError") {
          this.expiredSession();
        } else {
          this.buttonClick = false;
        if (response?.data?.error) {
          this.wrongpassword = true;
          this.walletV2ErrorMessage =
            response?.data?.error ===
            'Key derivation failed - possibly wrong password'
              ? 'Wrong password, please try again'
              : response?.data?.error;
          setTimeout(
            () => (
              (this.walletV2ErrorMessage = ''),
              (this.WalletPasswordTransaction = ''),
              (this.wrongpassword = false)
            ),
            3000
          );
        } else {
          if (
            response?.data?.address &&
            response?.data?.btcAddress &&
            response?.data?.tronAddress
          ) {
            this.closeModal(this.setPwdTransactionModal);
            this.existV2 = true;
            this.existV1 = true;
            this.versionText = 'New Wallet';
            this.modalService.open(this.migration, {
              backdrop: 'static',
              keyboard: false
            });
          } else {
            //wrong
            // this.closeModal(this.createWalletV2Modal)
          }
        }
        }
        
      });
  }

  imageFun() {
    return (
      (!this.wrongpassword && '../../../assets/Images/Kep-password.svg') ||
      '../../../assets/Images/Kep-passwordFalse.svg'
    );
  }

  verifysign() {
    this.walletV2ErrorMessage = '';
    this.buttonClick = true;
    this.walletFacade
      .verifySign(this.walletPassword)
      .pipe(
        catchError((err) => {
          this.buttonClick = false;

          this.walletV2ErrorMessage = 'Wrong password, please try again';
          this.wrongpassword = true;
          setTimeout(
            () => (
              (this.walletV2ErrorMessage = ''), (this.wrongpassword = false)
            ),
            3000
          );
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if(response?.name === "JsonWebTokenError") {
          this.expiredSession();
        } else {
          this.buttonClick = false;
        if (response?.code === 200) {
          // this.ngOnInit();
          this.closeModal(this.createWalletV2Modal);
          this.modalService.open(this.setPwdTransactionModal, {
            backdrop: 'static',
            keyboard: false
          });
        }
        }
        
      }, (err:any) => {
        console.log({err})
      });
  }
  getMigrationStatus($event: any) {
    this.tokenStorageService.setModaleMigrate($event);
    this.migrate = $event;
    if ($event == 'close') {
      this.closeModal(this.migration);
    }
    this.versionText =
      this.tokenStorageService.getWalletVersion() === 'v2'
        ? 'Old Wallet'
        : 'New Wallet';
  }
  createTronWallet() {
    this.walletFacade
      .createTronWallet(this.tronWalletPassword)
      .pipe(
        catchError((error) => {
          if (
            error.error.error ===
            'Key derivation failed - possibly wrong password'
          ) {
            this.tronErrorMessage = 'Wrong password';
          } else {
            this.tronErrorMessage = error.error.error;
          }
          return of(null);
        }),
        filter((res) => res !== null)
      )
      .subscribe((response: any) => {
        this.closeModal(this.createTronWalletModal);
        if (response?.data?.tronAddress) {
          this.tronWalletAddress = response.data.tronAddress;
        }
        this.openModal(this.tronWalletCreatedSuccessModal);
      });
  }
  verifyOnBoarding() {
    let address = this.tokenStorageService.getIdWallet();
    if (address) {
      this.authStoreService
        .getAccount()
        .pipe(takeUntil(this.onDestoy$))
        .subscribe((response: any) => {
          // let getFillMyProfil = this.tokenStorageService.getFillMyProfil();
          if (
            (response.data.onBoarding === false ||
              response.data.onBoarding === '') &&
            this.router.url === '/wallet'
          ) {
            if (window.innerHeight < 1025) {
              this.updateOnBoarding();
              return;
            }
            this.startSteps();
          }
        });
    }
  }


  allWallet() {
    try {
      if (this.loadingPopUp) {
        this.tokenStorageService.setModaleMigrate('open');
        this.walletFacade
          .getAllWallet()
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data: any) => {
            if(data.message === "success") {
              if (this.tokenStorageService.getWalletVersion() === 'v2') {
                this.versionText = 'New Wallet';
                this.height = '300px';
  
                this.tokenStorageService.saveWalletVersion('v1');
                this.tokenStorageService.saveIdWallet(data.data.address);
                this.tokenStorageService.saveTronWallet(data.data.tronAddress);
                this.tokenStorageService.saveWalletBtc(data.data.btcAddress);
                this.isV1 = true;
                this.lineChartColors[0].backgroundColor = '#696DE4';
              } else {
                this.versionText = 'Old Wallet';
                this.height = '250px';
  
                this.tokenStorageService.saveWalletVersion('v2');
                this.tokenStorageService.saveIdWallet(data.data.addressV2);
                this.tokenStorageService.saveTronWallet(data.data.tronAddressV2);
                this.tokenStorageService.saveWalletBtc(data.data.btcAddressV2);
                this.isV1 = false;
                this.lineChartColors[0].backgroundColor = '#4048FF';
              }
  
              this.walletStoreService.getCryptoList();
              this.walletStoreService.getTotalBalance();
            } 
          }, (err:any) => {
            this.walletFacade.verifyUserToken().pipe(first()).subscribe((res:any) => {
              if(res.message != "success") this.expiredSession();
            }); 
          });
      }
    } catch (error) {}
  }

  expiredSession() {
    this.tokenStorageService.clear();
    window.open(env.domainName + '/auth/login', '_self');
  }

  public makeAnimation(key: string): void {
    this.onMakeAnimation.emit(key);
  }
  togglemonth() {
    this.showMonth = true;
    this.showDaily = false;
    this.showSemaine = false;
  }
  toggleDay() {
    this.showDaily = true;
    this.showMonth = false;
    this.showSemaine = false;
  }
  toggleWeek() {
    this.showSemaine = true;
    this.showDaily = false;
    this.showMonth = false;
  }
  getDynamicStyle(): object {
    return {
      'top': this.versionText === 'Old Wallet' ? '-4.4vh' : ''
    };
  }

  /*------------------------------------------------------------------------------------*/

  totalbalancewallet() {
    this.totalBalance$
      .pipe(
        filter((res) => Object.keys(res).length !== 0),

        takeUntil(this.onDestoy$)
        //takeUntil(this.onDestoy$)
      )
      .subscribe((data: any) => {
        this.totalAmount = data;
        this.show =
          Number(this.totalAmount) > 0 &&
          localStorage.getItem('wallet_version') === 'v1'
            ? true
            : false;

        /*if (this.show && this.hasWalletV2 && this.migrate === 'open') {
          
          this.openModal(this.migration);
        }*/

        if (Number(this.totalAmount) === 0) {
          this.height = '250px';
        } else {
          if (this.show === false) {
            this.height = '250px';
          }
        }
        this.variationamount = data?.variation?.toFixed(2);
        if (this.variationamount < 0) {
          this.arrowvar = '';
          this.arrowup = false;
          this.arrowColor = '#F52079';
        } else if (this.variationamount === 0) {
          this.arrowvar = '';
          this.arrowup = true;
          this.arrowColor = '#00CC9E';
        } else {
          this.arrowvar = '+';

          this.arrowup = true;

          this.arrowColor = '#00CC9E';
        }
      });
  }
  /*------------------------------------------------------------------------------------*/
  public triggerAnimation(key: string): void {
    this.hasAnimation = key;
    // Once you change #home to #key and #profile to #receive
    // You remove the line below and change (target="' + matchKey + ') with (target="' + key + ')
    const matchKey: string = key === 'send' ? '#home' : '#profile';
    const element: any = this.document.querySelector(
      'button[data-bs-target="' + matchKey + '"]'
    );
    element.click();
    setTimeout(() => {
      this.hasAnimation = '';
    }, 4000);
  }
  /*------------------------------------------------------------------------------------*/
  wrongTronPassword = false;
  goToProfile(modal: any) {
    this.closeModal(modal);
    this.router.navigate(['home/settings/edit']);
  }

  openModal(content: any) {
    this.modalService.open(content);
  }
  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/wlcm-moon-boy.png';
  }

  private startSteps() {
    let arrayOfObs = [];
    arrayOfObs.push(this.translate.get('onBoarding.introo'));
    arrayOfObs.push(this.translate.get('onBoarding.intro2'));
    arrayOfObs.push(this.translate.get('onBoarding.intro3'));
    arrayOfObs.push(this.translate.get('onBoarding.intro4'));
    arrayOfObs.push(this.translate.get('onBoarding.intro5'));
    arrayOfObs.push(this.translate.get('onBoarding.next'));
    forkJoin(arrayOfObs)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe((resArray: any[]) => {
        this.intro1 = resArray[0];
        this.intro2 = resArray[1];
        this.intro3 = resArray[2];
        this.intro4 = resArray[3];
        this.button = resArray[5];
        this.introJS
          .setOptions({
            tooltipClass: 'customTooltip',
            nextLabel: '',
            prevLabel: '',
            doneLabel: '',
            hidePrev: true,
            showBullets: false,
            exitOnOverlayClick: false,
            scrollToElement: true,

            steps: [
              {
                element: '#introo',
                intro: this.intro1,
                position: 'bottom'
              },
              {
                element: '#intro2',
                intro: this.intro2,
                position: 'bottom'
              },
              {
                element: '#intro3',
                intro: this.intro3,
                position: 'bottom'
              },
              {
                element: '#intro4',
                intro: this.intro4,
                position: 'bottom'
              }

              // {
              //   element: "#intro5",
              //   intro: this.intro5,
              //   position: "bottom",
              // },
            ]
          })
          .start()
          .onexit(() => {
            this.updateOnBoarding();
          });
      });
  }
  updateOnBoarding() {
    this.authService
      .onBoarding()
      .pipe(
        tap((res: any) => {
          if (!!res.success) {
            this.authStoreService.setAccount({
              ...this.authStoreService.account,
              onBoarding: true
            });
            this.accountFacadeService.dispatchUpdatedAccount();
          }
        }),
        takeUntil(this.onDestoy$)
      )
      .subscribe(() => {
        this.showModal = !this.showModal;
        this.getDetails();
      });
  }

  verifyUserWalletV2() {
    this.walletFacade
      .checkUserWalletV2()
      .pipe(takeUntil(this.onDestoy$))
      .subscribe(
        (res: any) => {
             if(res.data === false) {
              this.existV2 = res.data;
              this.hasWalletV2 = false;
              localStorage.setItem('existV2', 'false');
              this.height = '250px';
              setTimeout(() => {this.modalService.open(this.createWalletV2Modal, {
                backdrop: 'static',
                keyboard: false
              })},2000)
              
              return;
            } else if(res.data === true){
              this.existV2 = res.data;
              this.hasWalletV2 = true;
              localStorage.setItem('existV2', 'true');
            }

          
        }
      );
  }
  getDetails() {
    this.account$
      .pipe(
        take(1),
        takeUntil(this.onDestoy$),
        filter((res) => res !== null),
        mergeMap((response: any) => {
          let count = 0;
          if (response !== null && response !== undefined) {
            this.picUserUpdated = response.photoUpdated;
            this.user = new User(response);
            if (this.user.firstName && this.user.firstName !== '') {
              count++;
            }
            if (this.user.lastName && this.user.lastName !== '') {
              count++;
            }
            if (this.user.address && this.user.address !== '') {
              count++;
            }
            if (this.user.email && this.user.email !== '') {
              count++;
            }
            if (this.user.phone && this.user.phone !== '') {
              count++;
            }
            if (this.user.gender && this.user.gender !== '') {
              count++;
            }
            if (this.user.city && this.user.city !== '') {
              count++;
            }
            if (this.user.zipCode && this.user.zipCode !== '') {
              count++;
            }
            if (this.user.country && this.user.country !== '') {
              count++;
            }
            if (this.user.birthday && this.user.birthday !== '') {
              count++;
            }
            let calcul = (count * 100) / 10;
            this.percentProfil = calcul.toFixed(0);

            //  let getFillMyProfil = this.tokenStorageService.getFillMyProfil();
            let showAgain = this.tokenStorageService.getShowPopUp();

            /*if (
              this.percentProfil < 60 &&
              showAgain === 'true' &&
              this.user.onBoarding === true
            ) {
              setTimeout(() => {
                if (
                  this.tokenStorageService.getFillMyProfil() !== 'false' &&
                  this.tokenStorageService.getToken() &&
                  this.hasWalletV2
                ) {
                  this.openModal(this.welcomeModal);
                }
                this.tokenStorageService.setFillMyProfil('false');
              }, 3000);
            }*/
          }
          return this.profileSettingsFacade.profilePic$;
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((profile: any) => {
        if (!!profile) {
          let objectURL = URL.createObjectURL(profile);
          if (this.user.idSn === 0) {
            this.user.userPicture =
              this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
          if (this.picUserUpdated && this.user.idSn !== 0) {
            this.user.userPicture =
              this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        }

        if (this.user.picLink && !this.user.userPicture) {
          this.user.userPicture = this.user?.picLink;
        }
      });
  }

  togglePortfolio(e: any) {
    this.hidePortfolio = e;
  }
  dontShowAgain() {
    this.isChecked = !this.isChecked;

    let data_profile = {
      toggle: this.isChecked
    };
    this.profileSettingsFacade
      .updateProfile(data_profile)
      .pipe(takeUntil(this.onDestoy$))
      .subscribe(() => {
        this.accountFacadeService.dispatchUpdatedAccount();
        this.tokenStorageService.setItem(
          'mute-create-tron-wallet-popup',
          this.isChecked.toString()
        );
      });
  }
  goToCampaign() {
    this.closeRedBloc();
    this.router.navigate(['home/campaign', id_campaign_to_participate]);
    this.sidebarService.toggleSidebarMobile.next(false);
  }
  closeRedBloc() {
    this.tokenStorageService.setItem('hideRedBloc', 'true');
    this.hideRedBloc = this.tokenStorageService.getHideRedBloc();
  }

  //   updateTransactionPassword() {

  //     this.showSpinnerTransactionPassword = true;
  //     this.transactionPasswordWrong = '';
  //     this.transactionPasswordSuccess = '';
  //  let local = localStorage.getItem('oldPasss')
  //     let oldpass = local || ''
  //     let newpass = this.formUpdateTransactionPassword.get('password')?.value;

  //     if (this.formUpdateTransactionPassword.valid) {
  //       if (oldpass === newpass) {
  //         this.transactionPasswordWrong = 'profile.newPass';
  //         this.showSpinnerTransactionPassword = false;
  //         setTimeout(() => {
  //           this.transactionPasswordWrong = '';
  //         }, 3000);
  //       } else {
  //         this.walletFacade.resetTransactionPassword(oldpass, newpass)
  //         .subscribe(
  //           (res: any) => {
  //             this.showSpinnerTransactionPassword = false;
  //             if(res.code == 200 && res.message === "success") {
  //               this.transactionPasswordSuccess = "you have successfully changed your password";
  //               this.closeModal(this.setPwdTransactionModal);
  //       //         this.modalService.open(this.migration, {
  //       //    backdrop: 'static',
  //       //    keyboard: false
  //       //  });
  //               setTimeout(() => {
  //                 this.transactionPasswordSuccess = "";

  //               }, 2000)
  //             }

  //           },
  //           (err: any) => {
  //             this.showSpinnerTransactionPassword = false;
  //             if(err.error.error === "Key derivation failed - possibly wrong password") {
  //               this.transactionPasswordWrong = "Wrong password"
  //               setTimeout(() => {
  //                 this.transactionPasswordWrong = ''
  //               }, 2000)
  //             } else {
  //               this.transactionPasswordWrong = "Something went wrong please try again!"
  //               setTimeout(() => {
  //                 this.transactionPasswordWrong = ''
  //               }, 2000)
  //             }

  //           }
  //         )
  //         /*this.AuthService.updatePassword(oldpass, newpass)
  //           .pipe(
  //             catchError((HttpError: HttpErrorResponse) => {
  //               return of(HttpError.error);
  //             }),
  //             takeUntil(this.onDestroy$)
  //           )
  //           .subscribe((res: IApiResponse<any>) => {
  //             if (res.code === 200) {
  //               this.showSpinner = false;
  //               let msg: string = '';
  //               this.translate
  //                 .get('profile.password_change')
  //                 .pipe(takeUntil(this.onDestroy$))
  //                 .subscribe((data1: any) => {
  //                   msg = data1;
  //                 });
  //               this.toastr.success(msg);
  //               this.formUpdatePassword.reset();
  //             } else if (res.code === 401) {
  //               this.passwordWrong = 'profile.old_pass_wrong';
  //               this.formUpdatePassword.get('old_password')?.reset();
  //             }
  //           });*/
  //       }
  //     }
  //   }
  removeMessage() {
    this.passwordWrong = '';
    this.errorMsg = '';
  }

  getSecure() {
    if (this.tokenStorageService.getSecure() === 'true') {
      this.tokenStorageService.removeItem('secure');
    }
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }

  switchNewWallet(event: any) {
    if (event === 'new-wallet') {
      this.allWallet();
    }
  }
}
