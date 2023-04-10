import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import moment from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { formatDate, isPlatformBrowser } from '@angular/common';
import { ListTokens, bscan, etherscan } from '@app/config/atn.config';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { environment } from '@environments/environment';
interface IDropdownFilterOptions {
  value: string;
  text: string;
}
@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.css']
})
export class TransactionsHistoryComponent implements OnInit {
  fakedate: any = [
    {
      Hash: '0x9bacF545B251695B251695786786',
      Date: '5 days 15h ago',
      From: '0x9bacF545B251695B2516957867866786',
      To: '0x9bacF545B251695B25169578678',
      Value: 867.5,
      reseau: 'BEP20',
      Token: 'SaTT'
    },
    {
      Hash: '0x9bacF545B251695B25169576786',
      Date: '4 days 15h ago',
      From: '0x9bacF545B251695B25169578687678',
      To: '0x9bacF545B251695B251695786786',
      Value: 500.5,
      reseau: 'ERC20',
      Token: 'ETH'
    },
    {
      Hash: '0x9bacF545B251695B251695786786',
      Date: '4 days 15h ago',
      From: '0x9bacF545B251695B251695786786786',
      To: '0x9bacF545B251695B25169576876',
      Value: 200.5,
      reseau: 'ERC20',
      Token: 'ETH'
    }
  ];
  startDateDefault: any = 'yy-mm-dd';
  endDateDefault: any = 'yy-mm-dd';
  totalP: any;
  testdropdown: any = [false, false, false];

  selectAll: boolean = true;
  selectconpaigns: boolean = false;
  selectP2P: boolean = false;
  transactions: any = [];
  currentpage: any = 1;
  selectedPage: any = 1;
  pageContent: any = [];
  transactions2: any = [];
  currentLang!: string;
  pa: number = 1;

  campaignBlockchainType: FormControl;
  campaignBlockchainTypeOptions: IDropdownFilterOptions[] = [];
  values!: Observable<any>;

  sendReceiveType: FormControl;
  sendReceiveTypeTypeOptions: IDropdownFilterOptions[] = [];

  tokenType: FormControl;
  tokenTypeOptions: IDropdownFilterOptions[] = [];
  tokenTypeOptionsERC20: IDropdownFilterOptions[] = [];
  tokenTypeOptionsBEP20: IDropdownFilterOptions[] = [];
  tokenTypeOptionsALL: IDropdownFilterOptions[] = [];
  startDateType: FormControl;
  endDateType: FormControl;

  checked = 'Send & Receive';
  checkedBlockchain = 'all';
  checkedToken = 'all';
  typeblockchain = 'all';
  arr: any;
  p: number = 1;
  private isDestroyed = new Subject();

  @ViewChild('number_1') el1: any;
  @ViewChild('number_2') el2: any;
  @ViewChild('number_3') el3: any;
  @ViewChild('filterDiv') filterDivRef: any;

  showSpinner!: boolean;
  screenHeight: any;
  screenWidth: any;
  displayFilter = true;
  filtertransaction: any[] = [];
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private tokenStorageService: TokenStorageService,
    private fb: FormBuilder,
    private walletfacade: WalletFacadeService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    translate.onLangChange
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((event: LangChangeEvent) => {
        this.currentLang = event.lang;
        this._changeDetectorRef.detectChanges();
        this.translate.use(this.currentLang);
        this.fetchTransactions();
      });
    this.onResize();

    this.campaignBlockchainType = this.fb.control({
      value: 'all',
      text: 'Transactions.all'
    });

    this.sendReceiveType = this.fb.control({
      value: 'all',
      text: 'Transactions.all'
    });
    this.tokenType = this.fb.control({
      value: 'all',
      text: 'Transactions.all'
    });
    this.startDateType = this.fb.control({
      value: 'all',
      text: 'Transactions.all'
    });
    this.endDateType = this.fb.control({
      value: 'all',
      text: 'Transactions.all'
    });

    this.values = merge(
      this.campaignBlockchainType.valueChanges,
      this.tokenType.valueChanges,
      this.sendReceiveType.valueChanges,
      this.startDateType.valueChanges,
      this.endDateType.valueChanges
    );

    this.campaignBlockchainTypeOptions = [
      { value: 'all', text: 'Transactions.all' },
      { value: 'bep20', text: 'Transactions.bep20' },
      { value: 'erc20', text: 'Transactions.erc20' }
    ];

    this.sendReceiveTypeTypeOptions = [
      { value: 'all', text: 'Transactions.all' },
      { value: 'Send', text: 'Transactions.Send' },
      { value: 'Receive', text: 'Transactions.Receive' }
    ];

    this.tokenTypeOptions = [];
    for (const key in ListTokens) {
      if (ListTokens.hasOwnProperty(key)) {
        Object.values(ListTokens).forEach((val) => {
          //   console.log(val)
        });

        // console.log(key);
      }

      const keys = Object.keys(ListTokens);

      this.tokenTypeOptionsALL = [
        { value: 'all', text: 'Transactions.all' },
        //  { value: key, text: key },
        { value: keys[1], text: keys[1] },
        { value: keys[2], text: keys[2] },
        { value: keys[3], text: keys[3] },
        { value: keys[4], text: keys[4] },
        { value: keys[5], text: keys[5] },
        { value: keys[6], text: keys[6] },
        { value: keys[7], text: keys[7] },
        { value: keys[8], text: keys[8] },
        { value: keys[9], text: keys[9] },
        { value: keys[10], text: keys[10] },
        { value: keys[11], text: keys[11] },
        { value: keys[12], text: keys[12] }
      ];

      this.tokenTypeOptionsERC20 = [
        { value: 'all', text: 'Transactions.all' },
        { value: keys[0], text: keys[0] },
        { value: keys[2], text: keys[2] },
        { value: keys[3], text: keys[3] },
        { value: keys[4], text: keys[4] },
        { value: keys[6], text: keys[6] },
        { value: keys[7], text: keys[7] },
        { value: keys[8], text: keys[8] },
        { value: keys[11], text: keys[11] },
        { value: keys[12], text: keys[12] },
        { value: keys[10], text: keys[10] }
      ];

      this.tokenTypeOptionsBEP20 = [
        { value: 'all', text: 'Transactions.all' },
        { value: keys[1], text: keys[1] },
        { value: keys[5], text: keys[5] },
        { value: keys[12], text: keys[12] }
      ];
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      if (this.screenWidth < 538) {
        this.displayFilter = false;
      } else {
        this.displayFilter = true;
      }
    }
  }
  transactionDetails(transactionHash: any, Network: any) {
    if (Network === 'ERC20') {
      return 'https://etherscan.io/tx/' + transactionHash;
    } else {
      return 'https://bscscan.com/tx/' + transactionHash;
    }
  }
  transactionDetailsFrom(transactionfrom: any, Network: any) {
    if (Network === 'ERC20') {
      return environment.etherscanaddr + transactionfrom;
      // return 'https://etherscan.io/address/' + transactionfrom;
    } else {
      return environment.bscanaddr + transactionfrom;
      // return 'https://bscscan.com/address/' + transactionfrom;
    }
  }
  transactionDetailsTo(transactionto: any, Network: any) {
    if (Network === 'ERC20') {
      return environment.etherscanaddr + transactionto;
      // return 'https://etherscan.io/address/' + transactionto;
    } else {
      return environment.bscanaddr + transactionto;
      //   return 'https://bscscan.com/address/' + transactionto;
    }
  }
  ngOnInit(): void {
    this.fetchTransactions();
    this.filterTransaction();
    this.setDateFilterValue();
  }

  setDateFilterValue(): void {
    var dateObj = new Date();

    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var Time = year + '-' + month + '-' + day;

    this.endDateType.setValue(formatDate(Time, 'yyyy-MM-dd', 'en'));
    dateObj.setDate(dateObj.getDate() - 30);

    month = dateObj.getUTCMonth() + 1;
    day = dateObj.getUTCDate();
    year = dateObj.getUTCFullYear();

    Time = year + '-' + month + '-' + day;

    this.startDateType.setValue(formatDate(Time, 'yyyy-MM-dd', 'en'));
  }

  filterTransaction() {
    let wallet_id = this.tokenStorageService.getIdWallet();

    this.values
      .pipe(startWith(this.transactions2), takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        let array = [
          this.campaignBlockchainType.value,
          this.sendReceiveType.value,
          this.tokenType.value
        ];
        let bep20 = true;
        let erc20 = true;
        let Send = true;
        let Receive = true;
        let start_date_value: any;
        let end_date_value: any;
        let start = true;
        let end = true;
        let tokenF = true;

        this.tokenTypeOptions = this.tokenTypeOptionsALL;
        this.filtertransaction = this.transactions.filter(
          (transaction: any) => {
            if (this.campaignBlockchainType.value.all) {
              this.tokenTypeOptions = this.tokenTypeOptionsALL;
            }

            if (this.campaignBlockchainType.value.bep20) {
              this.tokenTypeOptions = this.tokenTypeOptionsBEP20;
              bep20 = transaction.network === 'BEP20';
            }

            if (this.campaignBlockchainType.value.erc20) {
              this.tokenTypeOptions = this.tokenTypeOptionsERC20;
              erc20 = transaction.network === 'ERC20';
            }

            if (this.sendReceiveType.value.Send) {
              Send = transaction.from === wallet_id;
            }
            if (this.sendReceiveType.value.Receive) {
              Receive = transaction.from !== wallet_id;
            }

            let token =
              this.tokenType.value.value?.toUpperCase() ||
              Object.keys(this.tokenType.value)[0].toUpperCase();

            if (token !== 'ALL') {
              tokenF = transaction.tokenSymbol.toUpperCase() === token;
            }

            if (token === 'SATTBEP20') {
              tokenF =
                transaction.tokenSymbol.toUpperCase() === 'SATT' &&
                transaction.network === 'BEP20';
            }

            if (token === 'SATT') {
              tokenF =
                transaction.tokenSymbol.toUpperCase() === 'SATT' &&
                transaction.network === 'ERC20';
            }

            if (this.startDateType.value.value !== 'all') {
              start_date_value =
                new Date(this.startDateType.value).getTime() / 1000;
              start = transaction.timeStamp * 1 >= start_date_value * 1;
            }

            if (this.endDateType.value.value !== 'all') {
              let endDate = new Date(this.endDateType.value);
              endDate.setDate(endDate.getDate() + 1);
              end_date_value = endDate.getTime() / 1000;

              end = transaction.timeStamp * 1 <= end_date_value * 1;
            }

            return bep20 && erc20 && Send && Receive && tokenF && start && end;
          }
        );
      });
  }

  fetchTransactions() {
    var tableau: any = [];
    this.showSpinner = true;
    this.walletfacade
      .getTransactionsHistory()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        data.forEach((element: any) => {
          // let token= ListTokens[element.contractAddress].contract
          element.direction =
            element.network === 'BEP20'
              ? bscan + element.hash
              : etherscan + element.hash;
          if (!element.tokenDecimal) element.decimal = '18';
          else element.decimal = element.tokenDecimal;
          element.result = (
            Number(element.value) / Math.pow(10, Number(element.decimal))
          ).toFixed(3);
          tableau.push(element);

          //  element.decimal=ListTokens[currency].contract;
          //   let tokenDecimal=Number(element.tokenDecimal);
          //   if(element.tokenDecimal)
          //   {
          //     console.log("hzre")
          //     let value =parseFloat(new Big(element.value).div(new Big(10).pow(tokenDecimal)).toFixed(0))
          //   element.result=value;

          // }else{
          //   element.result=element.value;

          // }
        });
        this.showSpinner = false;
        this.sortTransactions(tableau);
      });
  }

  // handelpage_content(pageN: any, start: any, end: any) {
  //   var pageContent: any = []
  //   this.transactions.forEach((element: any, index: any) => {
  //     if (index >= start && index <= end) {
  //       pageContent.push(element)
  //     }
  //   });
  //   this.pageContent = pageContent
  // }

  // pageChanged(event: any, tab_1: any, tab_2: any, tab_3: any, prevORnext: any) {

  //   if (prevORnext) {
  //     if (prevORnext == "next") {
  //       if (this.selectedPage != this.totalP) {
  //         this.selectedPage = (this.selectedPage * 1) + 1
  //       }
  //     } else {
  //       if (this.selectedPage != 1) {
  //         this.selectedPage = (this.selectedPage * 1) - 1
  //       }
  //     }
  //   } else {
  //     if (this.selectedPage < this.totalP) {
  //       this.selectedPage = event.target.attributes.class.ownerElement.innerHTML
  //     }
  //   }

  //   var end = this.selectedPage * 10
  //   var start = end - 10

  //   this.handelpage_content(this.selectedPage, start, end)

  //   if (this.selectedPage < this.totalP) {
  //     if (this.selectedPage != 1) {
  //       tab_1.attributes.class.ownerElement.innerHTML = (this.selectedPage * 1) - 1
  //       tab_2.attributes.class.ownerElement.innerHTML = (this.selectedPage * 1)
  //       tab_3.attributes.class.ownerElement.innerHTML = (this.selectedPage * 1) + 1
  //     }
  //   }
  // }

  handelTransactionType(Sender: any) {
    let wallet_ID = this.tokenStorageService.getIdWallet();
    if (wallet_ID === Sender) {
      return 'send_transaction';
    } else {
      return 'recive_transaction';
    }
  }

  handelDate() {
    var end = moment(this.transactions[0]?.timeStamp * 1 * 1000, 'Unix').format(
      'MMMM Do YYYY'
    );
    var start = moment(
      this.transactions[this.transactions.length - 1]?.timeStamp * 1 * 1000,
      'Unix'
    ).format('MMMM Do YYYY');
    let start_month =
      new Date(Date.parse(start.split(' ')[0] + ' 1, 2012')).getMonth() + 1;
    let start_day = start.split(' ')[1].split('t')[0];
    let start_year = start.split(' ')[2];

    let end_month =
      new Date(Date.parse(end.split(' ')[0] + ' 1, 2012')).getMonth() + 1;
    let end_day = end.split(' ')[1].split('t')[0];
    let end_year = end.split(' ')[2];

    this.startDateDefault = start_year + '-' + start_month + '-' + start_day;
    this.endDateDefault = end_year + '-' + end_month + '-' + end_day;
  }

  cryptoIcons(transaction: any) {
    return transaction.tokenSymbol;
  }

  sortTransactions(Transactions: any) {
    var Transactions_ = [...Transactions];
    var sort = Transactions_.sort(this.checkTransactionData);
    this.transactions = sort.reverse();
    this.transactions2 = [...this.transactions];
    // this.calculate_page_number(this.transactions)
    this.handelDate();
    this.filterTransaction();
  }
  calculateValue(value: any, decimal: any) {
    let tt = value / decimal;
    return tt;
  }
  // calculate_page_number(transactions: any) {
  //   this.selectedPage = 1;
  //   this.el1.nativeElement.innerHTML = 1;
  //   this.el2.nativeElement.innerHTML = 2;
  //   this.el3.nativeElement.innerHTML = 3;

  //   var length = (transactions.length / 10) + ""
  //   if (length.includes(".")) {
  //     if (transactions.length <= 10) {
  //       this.totalP = 1
  //     } else {
  //       this.totalP = Math.floor((transactions.length / 10) + 1)
  //     }
  //   } else {
  //     if (transactions.length <= 10) {
  //       this.totalP = 1
  //     } else {
  //       this.totalP = transactions.length / 10
  //     }
  //   }
  //   let pageContent: any = []
  //   this.transactions.forEach((element: any, index: any) => {
  //     if (index < 10) {
  //       pageContent.push(element)
  //     }
  //   });
  //   this.pageContent = pageContent
  // }

  checkTransactionData(transaction_0: any, transaction_1: any) {
    if (!transaction_0.tokenSymbol) {
      if (transaction_0.network === 'BEP20') {
        transaction_0.tokenSymbol = 'BNB';
      } else {
        transaction_0.tokenSymbol = 'ETH';
      }
    }

    if (!transaction_1.tokenSymbol) {
      if (transaction_1.network === 'BEP20') {
        transaction_1.tokenSymbol = 'BNB';
      } else {
        transaction_1.tokenSymbol = 'ETH';
      }
    }

    transaction_0.time = moment(
      transaction_0.timeStamp * 1 * 1000,
      'Unix'
    ).fromNow();
    transaction_1.time = moment(
      transaction_1.timeStamp * 1 * 1000,
      'Unix'
    ).fromNow();
    if (this.tokenStorageService.getLocalLang() === 'fr') {
      transaction_0.time = moment(transaction_0.timeStamp * 1 * 1000, 'Unix')
        .locale('fr')
        .fromNow();
      transaction_1.time = moment(transaction_1.timeStamp * 1 * 1000, 'Unix')
        .locale('fr')
        .fromNow();
    }
    return transaction_0.timeStamp - transaction_1.timeStamp;
  }

  // clickEvent(row: any) {
  //   switch (row) {
  //     case "td1":
  //       this.selectAll = true
  //       this.selectconpaigns = false
  //       this.selectP2P = false
  //       break; 8
  //     case "td2":
  //       this.selectAll = false
  //       this.selectconpaigns = true
  //       this.selectP2P = false
  //       break;
  //     case "td3":
  //       this.selectAll = false
  //       this.selectconpaigns = false
  //       this.selectP2P = true
  //   }
  // }

  expand(e?: any) {
    this.testdropdown[e.target.attributes.id.nodeValue] =
      !this.testdropdown[e.target.attributes.id.nodeValue];
  }

  showFilter() {
    this.displayFilter = !this.displayFilter;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
