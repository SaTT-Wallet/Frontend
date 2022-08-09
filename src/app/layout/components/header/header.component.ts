/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild
} from '@angular/core';
// import { bscan, etherscan } from '@app/config/atn.config';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NotificationService } from '@core/services/notification/notification.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { walletUrl, ListTokens } from '@config/atn.config';
import { User } from '@app/models/User';
import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { BehaviorSubject, of, Subject, Subscription, timer } from 'rxjs';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { ToastrService } from 'ngx-toastr';
import {
  concatMap,
  filter,
  map,
  mapTo,
  mergeMap,
  takeUntil,
  tap,
  startWith
} from 'rxjs/operators';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { WalletService } from '@app/core/services/wallet/wallet.service';
import { environment as env } from './../../../../environments/environment';
import { CampaignsService } from '@campaigns/facade/campaigns.facade';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Big } from 'big.js';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { IApiResponse } from '@app/core/types/rest-api-responses';
import { KycFacadeService } from '@app/core/facades/kyc-facade/kyc-facade.service';
import { ReturnStatement } from '@angular/compiler';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { REPL_MODE_STRICT } from 'repl';
const bscan = env.bscanaddr;
const etherscan = env.etherscanaddr;
const tronScanAddr = env.tronScanAddr;
const polygonscanAddr = 'https://mumbai.polygonscan.com/address/';
const btcScanAddr = 'https://www.blockchain.com/btc/address/';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  currentScreenSize: string | undefined;
  query = '(max-width: 991.98px)';
  mediaQueryList?: MediaQueryList;
  query2 = '(width =   767.9px)';
  mediaQueryList2?: MediaQueryList;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  clicked: boolean = true;
  @ViewChild('myprofile') myprofile?: ElementRef;
  bnbGaz: any;
  ethGaz: any;
  languageSelected: any;
  dataNotification: any[] = [];
  user!: User;
  isClickedOutside: boolean = true;
  showMore: boolean = false;
  showWallet: boolean = false;
  showMenuNotif: boolean = false;
  showMenuProfil: boolean = false;
  isTransactionHashCopiedtron = false;

  isDropdownOpen: boolean = true;
  tronAddress: string = '';

  copyMsg: boolean = false;
  copyMsg1: boolean = false;
  isBitcoinAdress: boolean = false;

  clickedElement: Subscription = new Subscription();
  bnb: any;
  eth: any;
  gazsend: any;
  erc20Gaz: any;
  bepGaz: any;
  showNotifications: boolean = false;
  newNotification: boolean = false;
  isSeen: number = 0;
  btcCode: string = '';
  erc20: string = '';
  portfeuilleList: Array<{ type: any; code: any }> = [];
  generateCode: boolean = false;
  isDisplay1: boolean = false;
  isDisplay2: boolean = false;
  isDisplay3: boolean = false;
  isDisplay4: boolean = false;
  notif: any;
  url1: any;
  url2: any;
  url3: any;
  urlM1: any;
  urlM2: any;
  picUserUpdated: boolean = false;
  oldHeight: any;
  newHeight: any;
  seen: boolean = false;
  menuAdpool: boolean = false;
  menuFarmPost: boolean = false;
  menuHistory: boolean = false;
  menuHelp: boolean = false;
  menuAbout: boolean = false;
  menuBlog: boolean = false;
  menuWallet: boolean = false;
  menuCampaign: boolean = false;
  menuTokenInfo: boolean = false;
  menuBuyToken: boolean = false;
  // successPart: boolean = false;
  // errorPart: boolean = false;
  sucess: any = false;

  @ViewChild('qrbtnERCM', { static: false }) qrbtnERCM?: ElementRef;
  @ViewChild('header', { static: false }) header?: ElementRef;
  @ViewChild('headerNav') headerNav?: ElementRef;

  allnotification: BehaviorSubject<Array<any>> = new BehaviorSubject([null]);
  message: any;

  // elementType = NgxQrcodeElementTypes.URL;
  // correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  // value = 'Techiediaries';

  issendfire: number = 0;
  private notifItemSize = 111;
  notifListSize = 0;
  isConnected: boolean = false;
  isWelcomePage = false;
  defaultHeaderBackground =
    'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%);';

  private account$ = this.accountFacadeService.account$;
  private resized = false;
  menuSendRecieve: boolean = false;
  private isDestroyed$ = new Subject();
  isTransactionHashCopied = false;
  isTransactionHashCopiedbtc = false;
  isLayoutDesktop = false;
  constructor(
    breakpointObserver: BreakpointObserver,
    private accountFacadeService: AccountFacadeService,
    private NotificationService: NotificationService,
    public router: Router,
    private tokenStorageService: TokenStorageService,
    public translate: TranslateService,
    public sidebarService: SidebarService,
    private eRef: ElementRef,
    public _changeDetectorRef: ChangeDetectorRef,
    private campaignDataStore: CampaignsStoreService,
    private clipboard: Clipboard,
    private ParticipationListStoreService: ParticipationListStoreService,
    private toastr: ToastrService,
    private walletFacade: WalletFacadeService,
    private walletService: WalletService,
    private campaignFacade: CampaignsService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private authStoreService: AuthStoreService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private kycFacadeService: KycFacadeService,
    private route: ActivatedRoute,
    private hostElement: ElementRef
  ) {
    breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((result) => {
        this.isLayoutDesktop = result.matches;
        console.log(result.matches,'-----------');

        // for (const query of Object.keys(result.breakpoints)) {
        //   if (result.breakpoints[query]) {
        //     result.matches;
        //     console.log(result.matches,'-----------');

        //   }

        // }
      });

    if (isPlatformBrowser(this.platformId)) {
      this.mediaQueryList = window.matchMedia(this.query);
      this.mediaQueryList2 = window.matchMedia(this.query2);

      window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        this.document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    }

    translate.addLangs(['en', 'fr']);
    if (this.tokenStorageService.getLocale()) {
      // @ts-ignore
      this.languageSelected = this.tokenStorageService.getLocale();
      translate.setDefaultLang(this.languageSelected);
    } else {
      this.tokenStorageService.setLocalLang('en');
      this.languageSelected = 'en';
      translate.setDefaultLang('en');
    }
    // translate.onLangChange
    //   .pipe(takeUntil(this.isDestroyed$))
    //   .subscribe((event: LangChangeEvent) => {
    //     this.languageSelected = event.lang;
    //     this._changeDetectorRef.detectChanges();
    //     this.translate.use(this.languageSelected);
    //     this.getNotifications();
    //   });
    // this.isWelcomePage = this.router.url.includes('welcome');

    //detect url changes to change the background of header
    this.router.events.pipe(takeUntil(this.isDestroyed$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('welcome')) {
          this.isWelcomePage = true;
        } else {
          this.isWelcomePage = false;
        }

        if (
          event.url.includes('campaign') ||
          event.url.includes('wallet') ||
          event.url.includes('wallet/receive') ||
          event.url === '/home' ||
          event.url.includes('wallet')
        ) {
          this.menuCampaign = true;
        } else {
          this.menuCampaign = false;
        }

        // if (event.url.includes('errorMessage')) {
        //   this.errorPart = true;
        // } else {
        //   this.errorPart = false;
        // }
        // if (event.url.includes('successMessage')) {
        //   this.successPart = true;
        // } else {
        //   this.successPart = false;
        // }
        if (this.router.url.includes('welcome')) {
          this.checkMenuAdpool();
        }
        if (
          this.router.url.includes('buy-token') ||
          this.router.url.includes('edit')
        ) {
          //@ts-ignore
          this.header?.nativeElement.style.background =
            'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%)';
          this.isWelcomePage = false;
          this.menuBuyToken = true;
        }
        if (!this.isWelcomePage) {
          //@ts-ignore
          this.header?.nativeElement.style.background =
            'linear-gradient(180deg, rgba(31, 35, 55, 0.7) 21.94%, rgba(31, 35, 55, 0) 93.77%)';
        }
      }
    });
  }
  ngAfterViewInit(): void {
   
    // if(this.route.url)
    this.route.url.subscribe((e) => {});
    this.router.events
      .pipe(
        tap((e) => {
          //  console.log(e)
        }),
        filter((e: any) => e instanceof NavigationEnd),
        startWith({ url: this.router.url })
      )
      .subscribe((e: any) => {
        if (
          ['/home', '/wallet'].includes(e.url) ||
          e.url.includes('/campaign')
        ) {
          (this.headerNav as ElementRef).nativeElement.style.position =
            'absolute';
          (this.headerNav as ElementRef).nativeElement.style.width = '100%';
          this.hostElement.nativeElement.style.height = 'inherit';
        } else {
          (this.headerNav as ElementRef).nativeElement.style.position =
            'inherit';
          (this.headerNav as ElementRef).nativeElement.style.width = 'inherit';
          this.hostElement.nativeElement.style.height = '64px;';
        }
      });
  }

  goToSocials() {
    if (this.isLayoutDesktop) {
      this.router.navigate(['socials']);
    }
  }

  closeBalanceSection() {
    this.sidebarService.BalanceDropDown('get'); //This Function to fix a bug in the side bar (Balance section Bug)
    if (this.isSeen !== 0) {
      this.seeNotification();
    }
  }
  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((isAuth: boolean) => {
        this.isConnected = isAuth;
      });
    this.fixMenuItemsWidth();
    if (this.router.url.includes('welcome')) {
      this.isWelcomePage = true;
      this.menuAdpool = true;
    }
    if (this.router.url.includes('wallet')) {
      this.menuWallet = true;
    }
    if (this.router.url.includes('notification')) {
      this.menuHistory = true;
    }
    if (this.router.url.includes('FAQ')) {
      this.menuHelp = true;
    }
    if (
      this.router.url.includes('campaign') ||
      this.router.url.includes('wallet') ||
      this.router.url.includes('ad-pools')
    ) {
      this.menuCampaign = true;
    } else {
      this.menuCampaign = false;
    }
    if (isPlatformBrowser(this.platformId)) {
      this.oldHeight = window.innerHeight;
      this.newHeight = this.oldHeight;
    }
    if (this.tokenStorageService.getToken()) {
      this.isConnected = true;

      this.getProfileDetails();
      this.getNotifications();
      // this.parentFunction();
      this.portfeuille();
      // this.showPopUp()

      this.receiveMessage();

      this.tokenStorageService.removeItem('visited-facebook');
      this.tokenStorageService.removeItem('hasTwitter');
      this.tokenStorageService.removeItem('visited-google');
      this.tokenStorageService.removeItem('visited-twitter');
      this.tokenStorageService.removeItem('visited-tiktok');
      this.tokenStorageService.removeItem('visited-socialConfig');
      this.tokenStorageService.removeItem('visited-transactionPwd');
      this.tokenStorageService.removeItem('visited-pwd');
      this.tokenStorageService.removeItem('visited-download');
      this.tokenStorageService.removeItem('visited-activePass');
      this.tokenStorageService.removeItem('visited-completeProfile');
      this.tokenStorageService.removeItem('visited-key');
      this.tokenStorageService.removeItem('enabled');
      this.tokenStorageService.removeItem('visited-pass-phrase');

      this.isClicked();
      let date = new Date();
      let expire = (date.getTime() * 1) / 1000;
      // @ts-ignore
      let compare = Math.floor(this.tokenStorageService.getExpire() * 1);
      if (compare < expire) {
        this.tokenStorageService.signOut();
        this.router.navigate(['/auth/login']);
      }
      this.tokenStorageService.setItem('wallet_btc', this.btcCode);
      this.tokenStorageService.setItem('tron-wallet', this.tronAddress)
      this.generateCodeDes();
      this.generateCodeERCDes();
      this.generateCodeFunction();
      this.generateCodeERC();
    } else {
      this.isConnected = false;
    }
  }

  getProfileDetails() {
    this.account$
      .pipe(filter((res) => res !== null))
      .pipe(
        takeUntil(this.isDestroyed$),
        mergeMap((data: any) => {
          if (data !== null && data !== undefined) {
            let lang: any = this.tokenStorageService.getLocalLang();
            this.translate.use(lang);
            this.picUserUpdated = data.photoUpdated;
            if (data.visited) {
              this.tokenStorageService.setStateVisited('true');
            } else {
              this.tokenStorageService.setStateVisited('false');
            }
            if (data.toggle === false) {
              this.tokenStorageService.setShowPopUp('false');
            } else {
              this.tokenStorageService.setShowPopUp('true');
            }
            this.user = new User(data);
            this.tokenStorageService.saveUserId(data.idUser);
            this.tokenStorageService.saveIdSn(data.idSn);
            return this.walletFacade.wallet$;
          }
          return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),

        takeUntil(this.isDestroyed$)
      )
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        if (!data.error) {
          if (!this.tokenStorageService.getFillMyProfil()) {
            this.tokenStorageService.setFillMyProfil('true');
          }
        }
      });
  }

  seeNotification() {
    this.NotificationService.notificationSeen()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((response: IApiResponse<{ [key: string]: string }>) => {
        if (response === null || response?.message === 'Notification clicked') {
          this.newNotification = false;
        }
      });
  }

  isClicked() {
    this.clicked = !this.clicked;
  }

  receiveMessage() {
    this.NotificationService.notifications$
      .pipe(
        concatMap((payload) =>
          timer(3000).pipe(
            takeUntil(this.isDestroyed$),
            tap((v) => {}),
            mapTo(payload)
          )
        ),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((payload: any) => {
        this.walletFacade.initWallet();
        const obj = JSON.parse(payload.data.obj);
        let ls = [];
        ls.push(obj);
        ls.forEach((item: any) => {
          this.siwtchFunction(item);
          let msg = '';
          if (item._label === 'transfer_event_currency') {
            item._label = 'transfer_event_currency_firebase';
          }
          if (item._label === 'receive_transfer_event_currency') {
            item._label = 'receive_transfer_event_currency_firebase';
          }
          this.translate
            .get(item._label, item._params)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((data: any) => {
              msg = data;
            });
          if (item.type === 'send_demande_satt_event') {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3 ">
              <img class='notify-icon' src='./assets/Images/notifIcons/Reception.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (item.type === 'receive_transfer_event') {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3">
              <img class='notify-icon' src='./assets/Images/notifIcons/Reception.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (item.type === 'validated_link') {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3">
              <img class='notify-icon' src='./assets/Images/notifIcons/lienAccepte.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (
            item.type === 'convert_event' ||
            item.type === 'apply_campaign'
          ) {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3">
              <img class='notify-icon' src='./assets/Images/notifIcons/CandidValid.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (
            item.type === 'rejected_link' ||
            item.type === 'cmp_candidate_reject_link'
          ) {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3">
              <img class='notify-icon' src='./assets/Images/notifIcons/lienRefuse.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (item.type === 'cmp_candidate_accept_link') {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3">
              <img class='notify-icon' src='./assets/Images/notifIcons/lienAccepte.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (item.type === 'cmp_candidate_insert_link') {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3">
              <img class='notify-icon' src='./assets/Images/notifIcons/ajoutLien.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (item.type === 'demande_satt_event') {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3" >
              <img class='notify-icon' src='./assets/Images/notifIcons/Reception.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          } else if (item.type === 'transfer_event') {
            this.toastr.success(
              `
            <div class="d-flex justify-content-center align-items-center p-3">
              <img class='notify-icon' src='./assets/Images/notifIcons/envoi.svg'/>
              <p class="w-100 ml-2 " style='overflow: hidden; max-width: 100%; text-overflow: ellipsis; padding: 1em'>${msg}</p>
            </div>`,
              '',
              { enableHtml: true, positionClass: 'toast-top-right' }
            );
          }
        });
        ls = ls.concat(this.dataNotification);
        this.issendfire = obj.isSeen;
        this.dataNotification = ls;
        if (this.issendfire !== 0) {
          this.newNotification = true;
        } else {
          this.newNotification = false;
        }
      });
  }
  getNotifications() {
    this.NotificationService.getAllNotifications()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((response: any) => {
        if (response?.code === 200 && response?.message === 'success') {
          this.isSeen = response.data.isSeen;

          // this.ngOnInit();
          if (this.isSeen !== 0) {
            this.newNotification = true;
            this.NotificationService.newNotification.next(true);
          } else {
            this.newNotification = false;
            this.NotificationService.newNotification.next(false);
          }
          // this.NotificationService.newNotification.subscribe((value) => {
          //   console.log(value);

          //   this.newNotification = value;
          // });
          this.dataNotification = response.data.notifications;
          this.notifListSize = Math.round(
            window.innerHeight / this.notifItemSize
          );
          if (this.notifListSize > 1) {
            this.dataNotification = this.dataNotification.slice(
              0,
              this.notifListSize - 1
            );
          } else {
            this.dataNotification = this.dataNotification.slice(
              0,
              this.notifListSize
            );
          }

          // if(this.dataNotification.length > 10) this.dataNotification.length = 10;

          this.dataNotification.forEach((item: any) => {
            this.siwtchFunction(item);
          });

          //this.showToaster();"https://etherscan.io/tx/"
        } else {
          this.dataNotification = [];
        }
      });
  }
  hashLink(network: any, link: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (network === 'ERC20') {
        window.open(etherscan + link, '_blank');
      } else if (network === 'BEP20') {
        window.open(bscan + link, '_blank');
      }
    }
  }

  redirect(notif: any): void {
    if (notif.isSeen === false) {
      this.NotificationService.oneNotificationSeen(notif._id)
        .pipe(takeUntil(this.isDestroyed$))
        .subscribe((response: any) => {
          if (response.message === 'notification_seen') {
            this.getNotifications();
            if (notif?.label?.cmp_hash) {
              this.router.navigate(['home/campaign', notif.label.cmp_hash], {
                queryParams: { type: 'earnings' }
              });
            } //if the notification has cmp_has it will redirect to campaign detail component

            if (notif?.label?.transactionHash) {
              let owner = notif.type === 'transfer_event' ? null : 'not owner';
              if (owner === 'not owner') {
                this.router.navigate(['home'], {
                  queryParams: {
                    page: 'send',
                    transactionHash: notif?.label?.transactionHash,
                    network: notif?.label?.network,
                    amount: notif?.label?.amount,
                    currency: notif?.label?.currency,
                    owner
                  }
                });
              } else {
                this.router.navigate(['home/TransactionsHistory']);
              }
            }
            if (notif?.type === 'send_demande_satt_event') {
              this.router.navigate(['home'], {
                queryParams: { showReceive: true }
              });
            }
            if (notif?.type === 'demande_satt_event') {
              this.router.navigate(['home'], {
                queryParams: { showSend: true }
              });
            }
            if (notif?.type === 'save_legal_file_event') {
              this.router.navigate(['home/settings/Legal_KYC']);
            }
            if (notif?.label?.promHash) {
              this.router.navigate(['home/farm-posts'], {
                queryParams: { promHash: notif?.label?.promHash }
              });
            }
            if (notif?.label?.cmp_hash && notif?.label?.linkHash) {
              // console.log(notif?.label?.promHash)
              this.router.navigate(['home/campaign', notif.label.cmp_hash], {
                queryParams: {
                  linkHash: notif?.label?.linkHash,
                  type: 'earnings'
                }
              });
            }
          }
        });
    }

    if (notif.isSeen === true) {
      this.getNotifications();
      if (notif?.label?.cmp_hash) {
        this.router.navigate(['home/campaign', notif.label.cmp_hash], {
          queryParams: { type: 'earnings' }
        });
      } //if the notification has cmp_has it will redirect to campaign detail component

      if (notif?.label?.transactionHash) {
        let owner = notif.type === 'transfer_event' ? null : 'not owner';
        if (owner === 'not owner') {
          this.router.navigate(['home'], {
            queryParams: {
              page: 'send',
              transactionHash: notif?.label?.transactionHash,
              network: notif?.label?.network,
              amount: notif?.label?.amount,
              currency: notif?.label?.currency,
              owner
            }
          });
        } else {
          this.router.navigate(['home/notification']);
        }
      }
      if (notif?.type === 'send_demande_satt_event') {
        this.router.navigate(['home'], {
          queryParams: { showReceive: true }
        });
      }
      if (notif?.type === 'demande_satt_event') {
        this.router.navigate(['home'], { queryParams: { showSend: true } });
      }
      if (notif?.type === 'save_legal_file_event') {
        this.router.navigate(['home/settings/Legal_KYC']);
      }
      if (notif?.label?.promHash) {
        this.router.navigate(['home/farm-posts'], {
          queryParams: { promHash: notif?.label?.promHash }
        });
      }
      if (notif?.label?.cmp_hash && notif?.label?.linkHash) {
        // console.log(notif?.label?.promHash)
        this.router.navigate(['home/campaign', notif.label.cmp_hash], {
          queryParams: { linkHash: notif?.label?.linkHash, type: 'earnings' }
        });
      }
    }
  }

  siwtchFunction(item: any) {
    const etherInWei = new Big(1000000000000000000);
    if (this.tokenStorageService.getLocale() === 'en') {
      item.createdFormated = moment
        .parseZone(item.created)
        .format(' MMMM Do YYYY, h:mm a');
      item.created = moment.parseZone(item.created).fromNow().slice();
    } else if (this.tokenStorageService.getLocale() === 'fr') {
      item.createdFormated = moment
        .parseZone(item.created)
        .locale('fr')
        .format(' Do MMMM  YYYY, HH:mm ');
      item.created = moment.parseZone(item.created).locale('fr').fromNow();
    }
    item._label = item.label;
    const receive_satt_pic = './assets/Images/notifIcons/Reception.svg';
    switch (item.type) {
      case 'buy_some_gas':
        item._label = 'buy_some_gas';
        item.img = receive_satt_pic;

        break;
      case 'invite_friends':
        item._label = 'invite_friends';
        item.img = receive_satt_pic;

        break;
      case 'join_on_social':
        item._label = 'join_on_social';
        item.img = receive_satt_pic;

        break;
      case 'send_demande_satt_event':
        item._params = {
          nbr: item._label['price'],
          crypto:
            item._label['cryptoCurrency'] &&
            (item._label['cryptoCurrency'] === 'SATTBEP20' ||
              item._label['cryptoCurrency'] === 'SATTPOLYGON')
              ? 'SATT'
              : item._label['cryptoCurrency'] ||
                (item._label['currency'] &&
                  (item._label['currency'] === 'SATTBEP20' ||
                    item._label['currency'] === 'SATTPOLYGON'))
              ? 'SATT'
              : item._label['currency'],
          // crypto: item._label['currency'],
          name: item._label['name']
        };
        item._label = 'asked_to_acquire';
        item.img = receive_satt_pic;
        break;
      //////////////////////////////////////////
      case 'demande_satt_event':
        item._params = {
          nbr: item._label['price'],
          crypto:
            item._label['cryptoCurrency'] &&
            (item._label['cryptoCurrency'] === 'SATTBEP20' ||
              item._label['cryptoCurrency'] === 'SATTPOLYGON')
              ? 'SATT'
              : item._label['cryptoCurrency'] ||
                (item._label['currency'] &&
                  (item._label['currency'] === 'SATTBEP20' ||
                    item._label['currency'] === 'SATTPOLYGON'))
              ? 'SATT'
              : item._label['currency'],
          name: item._label['name']
        };
        item._label = 'asked_cryptoCurrency';
        item.img = receive_satt_pic;
        break;
      //////////////////////////////////////////
      case 'save_legal_file_event':
        if (item._label['type'] === 'proofDomicile') {
          item._label = 'confirm_legal_kyc_proof';
        } else {
          item._label = 'confirm_legal_kyc_identity';
        }
        item.img = './assets/Images/notifIcons/CandidValid.svg';
        break;
      //////////////////////////////////////////
      case 'validated_link':
        item._params = {
          name: item._label['cmp_name'],
          link: item._label['cmp_link'],
          hash: item._label['cmp_hash']
        };
        item._label = 'campaign_notification.candidate_accept_link';
        item.img = './assets/Images/notifIcons/lienAccepte.svg';
        break;
      //////////////////////////////////////////

      case 'transfer_event':
        if (item._label['currency']) {
          let decimal = item._label['decimal']
            ? new Big('10').pow(item._label['decimal'])
            : ListTokens[item._label.currency].decimals;

          item._params = {
            currency:
              item._label['currency'] === 'SATTBEP20' ||
              item._label['currency'] === 'SATTPOLYGON'
                ? 'SATT'
                : item.label['currency'],
            nbr: Big(item._label['amount']).div(decimal),
            //  currency: item._label["currency"],
            to: item._label['to']
          };
          item._label = 'transfer_event_currency';
        } else if (item._label['network']) {
          item._params = {
            nbr: Big(item._label['amount']).div(etherInWei),
            network: item._label['network'],
            to: item._label['to']
          };
          item._label = 'transfer_event_network';
        }
        item.img = './assets/Images/notifIcons/envoi.svg';
        break;

      /*
            item._label['currency'] === 'SATTBEP20' ||
              item._label['currency'] === 'SATTPOLYGON'
              ? 'SATT': item.label['currency'],

        */
      //////////////////////////////////////////

      case 'receive_transfer_event':
        if (item._label['currency']) {
          let decimal = item._label['decimal']
            ? new Big('10').pow(item._label['decimal'])
            : ListTokens[item._label.currency].decimals;

          item._params = {
            nbr: Big(item._label['amount']).div(decimal),
            currency:
              item._label['currency'] === 'SATTBEP20' ||
              item._label['currency'] === 'SATTPOLYGON'
                ? 'SATT'
                : item.label['currency'],
            from: item._label['from']
          };
          item._label = 'receive_transfer_event_currency';
        } else if (item._label['network']) {
          item._params = {
            nbr: Big(item._label['amount']).div(etherInWei),
            network: item._label['network'],
            from: item._label['from']
          };
          item._label = 'receive_transfer_event_network';
        }
        item.img = './assets/Images/notifIcons/Reception.svg';
        break;
      //////////////////////////////////////////
      case 'convert_event':
        item._params = {
          amount: Big(item._label['amount']).div(etherInWei),
          Direction: item._label['Direction']
        };
        item._label =
          item._label['Direction'] === 'ETB'
            ? 'convert_event_ETB'
            : 'convert_event_BTE';
        item.img = './assets/Images/notifIcons/CandidValid.svg';
        break;

      //////////////////////////////////////////
      case 'apply_campaign': {
        item._params = {
          title: item._label['cmp_name'],
          owner: item._label['cmp_owner'],
          hash: item._label['hash']
        };
        item._label = 'apply_campaign';
        item.img = './assets/Images/notifIcons/CandidValid.svg';
        break;
      }

      case 'rejected_link':
        item._params = {
          name: item._label['cmp_name'],
          link: item._label['cmp_link'],
          hash: item._label['cmp_hash']
        };
        item._label = 'campaign_notification.candidate_reject_link';
        item.img = './assets/Images/notifIcons/lienRefuse.svg';
        break;
      //////////////////////////////////////////
      case 'cmp_candidate_accept_link':
        item._params = {
          name: item._label['cmp_name'],
          link: item._label['cmp_link'],
          hash: item._label['hash']
        };
        item._label = 'campaign_notification.candidate_accept_link';
        item.img = './assets/Images/notifIcons/lienAccepte.svg';
        break;
      //////////////////////////////////////////
      case 'cmp_candidate_reject_link':
        item._params = {
          name: item._label['cmp_name'],
          link: item._label['cmp_link'],
          hash: item._label['cmp_hash']
        };
        item._label = 'campaign_notification.candidate_reject_link';
        item.img = './assets/Images/notifIcons/lienRefuse.svg';
        break;

      //////////////////////////////////////////
      case 'cmp_candidate_insert_link':
        item._params = {
          name: item._label['cmp_name'],
          hash: item._label['cmp_hash']
        };
        item._label = 'campaign_notification.candidate_insert_link';
        item.img = './assets/Images/notifIcons/ajoutLien.svg';
        break;
      //////////////////////////////////////////
      case 'cmp_candidate_accepted':
        item._params = {
          name: item._label['cmp_name'],
          hash: item._label['cmp_hash']
        };
        item._label = 'campaign_notification.candidate_insert_link';
        item.img = './assets/Images/notifIcons/lienAccepte.svg';
        break;
      //////////////////////////////////////////
      case 'cmp_candidate_rejected':
        item._params = {
          name: item._label['cmp_name'],
          editorCmpUrl: walletUrl + 'campaigns'
        };
        item._label = 'campaign_notification.editor_cmp_rejected';
        item.img = './assets/Images/notifIcons/lienRefuse.svg';
        break;
      //////////////////////////////////////////
      case 'validate_kyc':
        if (item._label['action'] === 'validated kyc') {
          item._label = 'kyc_validation_cofirm';
        }
        item.img = './assets/Images/notifIcons/CandidValid.svg';
        break;

      case 'kyc_validation':
        let obj = item._label;
        let type = obj.split('"')[7];
        let status = obj.split('"')[3];

        if (status === 'done') {
          if (type === 'proofId') {
            item._label = 'kyc_confirm2';
            item._params = { type: 'Identity' };
          } else if (type === 'proofDomicile') {
            item._label = 'kyc_confirm2';
            item._params = { type: 'Proof of address' };
          }
        } else {
          if (type === 'proofId') {
            item._label = 'kyc_reject2';
            item._params = { type: 'Identity' };
          } else {
            item._label = 'kyc_reject2';
            item._params = { type: 'Proof of address' };
          }
        }
        item.img = './assets/Images/notifIcons/CandidValid.svg';
        break;

      ////////////////old ones//////////////////////////
      case 'save_buy_satt_event':
        item._params = {
          amount: item._label['amount'],
          quantity: item._label['quantity']
        };
        item._label = 'buy_satt_notify';
        item.img = receive_satt_pic;
        break;
      //////////////////////////////////////////
      case 'transfer_satt_event':
        item._params = {
          nbr: item._label['amount'],
          crypto:
            item._label['currency'] === 'SATTBEP20' ||
            item._label['currency'] === 'SATTPOLYGON'
              ? 'SATT'
              : item.label['currency'],
          email: item._label[2]
        };
        item._label = 'transfer_money';
        item.img = './assets/Images/notifIcons/envoi.svg';
        break;
      //////////////////////////////////////////
      case 'received_satt_event':
        item._params = {
          nbr: item._label['amount'],
          crypto:
            item._label['currency'] === 'SATTBEP20' ||
            item._label['currency'] === 'SATTPOLYGON'
              ? 'SATT'
              : item.label['currency'],
          email: item._label[2]
        };
        item._label = 'received_satt';
        item.img = receive_satt_pic;
        break;
      //////////////////////////////////////////
      case 'add_contact_event':
        item._params = { nbr: item._label[0] };
        item._label = 'contact_satt';
        item.img = './assets/Images/notifIcons/userImg.svg';
        break;
      //////////////////////////////////////////
      case 'add_contact_fb_event':
        item._label = item._label[0];
        item.img = './assets/Images/notifIcons/userImg.svg';
        break;
      //////////////////////////////////////////
      case 'affiliation_contact_event':
        item._label = 'link_sent';
        item.img = './assets/Images/notifIcons/ajoutLien.svg';
        break;
      //////////////////////////////////////////
      case 'contact_satt_event':
        item._params = { email: item._label[0] };
        item._label = 'contact_satt_list';
        item.img = './assets/Images/notifIcons/userImg.svg';
        break;
      //////////////////////////////////////////
      case 'import_event':
        item._params = { nbr: item._label[2], file: item._label[1] };
        item._label = 'contact_satt_import';
        item.img = './assets/Images/notifContact.svg';
        break;
      //////////////////////////////////////////
      case 'send_mail_event':
        item._params = { email: item._label[0] };
        item._label = 'email_has_been_sent';
        item.img = './assets/Images/notifIcons/envoi.svg';
        break;
      //////////////////////////////////////////
      case 'buy_satt_event':
        item._params = {
          amount: item._label['amount'],
          quantity: item._label['quantity']
        };
        item._label = 'buy_satt_notify';
        item.img = receive_satt_pic;
        break;

      //////////////////////////////////////////
    }
  }

  tr(msg: any, params: any) {
    if (!params) {
      return this.translate.instant(msg || ' ');
    } else {
      return this.translate.instant(msg || ' ', params);
    }
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  toggleSidebarMobile() {
    this.sidebarService.toggleFooterMobile.next(false);
    if (this.sidebarService.toggleSidebarMobile.value) {
      this.showMore = false;
      this.showWallet = false;
      this.sidebarService.toggleSidebarMobile.next(false);
    } else {
      this.sidebarService.toggleSidebarMobile.next(true);
      this.showMore = false;
      this.showWallet = false;
    }
  }

  toggleMoreMobile() {
    this.sidebarService.toggleFooterMobile.next(false);
    if (this.sidebarService.toggleWalletMobile.value) {
      this.sidebarService.toggleWalletMobile.next(false);
    }
  }
  toggleWallet() {
    setTimeout(() => {
      let elem = this.document.getElementById('ercQrCode')
      elem?.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    });


    }, 100)
    this.sidebarService.toggleFooterMobile.next(false);
    // this.showWallet = !this.showWallet;
    if (this.sidebarService.toggleWalletMobile.value) {
      this.sidebarService.toggleWalletMobile.next(false);
    } else {
      this.sidebarService.toggleWalletMobile.next(true);
    }
  }

  closeShowMore() {
    this.sidebarService.toggleFooterMobile.next(false);
    if (this.showMore) {
      // this.showMore = !this.showMore;
      this.showWallet = false;
      this.showNotifications = true;
    } else if (this.sidebarService.toggleSidebarMobile.value) {
      this.sidebarService.toggleSidebarMobile.next(false);
      this.showWallet = false;
      this.showNotifications = true;
    } else if (this.showWallet) {
      this.showWallet = false;
      this.showNotifications = true;
    } else if (!this.showNotifications) {
      this.showNotifications = true;
      this.showWallet = false;
    }
    if (this.isSeen !== 0) this.seeNotification();
  }
  @HostListener('window:resize', ['$event'])
  onScreenResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.newHeight = event.target.innerHeight;
      if (this.newHeight !== this.oldHeight) {
        this.oldHeight = this.newHeight;
        this.getNotifications();
      }

      if (this.mediaQueryList?.matches) {
        this.notifItemSize = 150;
        this.getNotifications();
      } else {
        if (this.notifItemSize === 150) {
          this.notifItemSize = 111;
          this.getNotifications();
        }
      }

      let screenSize = window.innerWidth;
      if (screenSize === 1024) {
        this.sidebarService.toggle();
      }
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.eRef.nativeElement?.contains(event.target)) {
        this.isClickedOutside = false;
      } else {
        this.isClickedOutside = true;
      }
    }
  }

  onRedirectOld() {
    if (isPlatformBrowser(this.platformId))
      window.location.href = 'https://old.satt.atayen.us/';
  }
  portfeuille() {
    this.walletFacade.wallet$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data: any) => {
        if (!!data) {
          this.btcCode = data.data.btc;
          this.erc20 = data.data.address;
          this.tronAddress = data.data.tronAddress;
          this.url3 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.tronAddress}&chs=219x219&chco=212121&chld=m|1`;
          this.portfeuilleList = [
            { type: 'ERC20/BEP20', code: this.erc20 },
            { type: 'BTC', code: this.btcCode },
            { type: 'tron', code: this.tronAddress }
          ];
        }
      });
  }
  copiedHashtron() {
    this.isTransactionHashCopiedtron = true;
    setTimeout(() => {
      this.isTransactionHashCopiedtron = false;
    }, 2000);
  }
  copiedHash() {
    this.isTransactionHashCopied = true;
    setTimeout(() => {
      this.isTransactionHashCopied = false;
    }, 2000);
  }
  copiedHashbtc() {
    this.isTransactionHashCopiedbtc = true;
    setTimeout(() => {
      this.isTransactionHashCopiedbtc = false;
    }, 2000);
  }
  public copyErc(code: any) {
    this.clipboard.copy(code);
  }
  public copyBtc(code: any) {
    this.clipboard.copy(code);
  }
  public copytron(code: any) {
    this.clipboard.copy(code);
  }
  ////display1////////
  generateCodeERC() {
    //@ts-ignore
    let urlM1 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.erc20}&chs=219x219&chco=212121&chld=m|1`;
    this.urlM1 = urlM1;
  }
  ////display2////////
  generateCodeFunction() {
    let urlM2 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.btcCode}&chs=219x219&chco=212121&chld=m|1`;
    this.urlM2 = urlM2;
  }

  // generateCodeTron(){
  //   let url3 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.tronAddress}&chs=219x219&chco=212121&chld=m|1`;
  //   this.url3 = url3;
  // }
  ////display1////////
  generateCodeERCDes() {
    //@ts-ignore
    let url1 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.erc20}&chs=219x219&chld=m|1`;
    this.url1 = url1;
    //@ts-ignore
    let urlM1 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.erc20}&chs=219x219&chld=m|1`;
    this.urlM1 = urlM1;
  }
  ////display2////////
  notifSize = 10;
  generateCodeDes() {
    let urll = `https://chart.apis.google.com/chart?cht=qr&chl=${this.btcCode}&chs=150x150`;
    this.url2 = urll;
  }

  goToEther(erc20: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(etherscan + erc20, '_blank');
  }
  goToBscan(erc20: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(bscan + erc20, '_blank');
  }
  goToBtc() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://www.blockchain.com', '_blank');
  }
  goToPolygonScan(erc20: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(polygonscanAddr + erc20, '_blank');
  }

  goToTronScan(tronAddress: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(tronScanAddr + tronAddress, '_blank');
  }
  goToBtcScan(btcCode: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(btcScanAddr + btcCode, '_blank');
  }

  checkMenu() {
    if (this.router.url.includes('ad-pools')) {
      this.menuAdpool = true;
    } else {
      this.menuAdpool = false;
    }
  }
  checkMenuFarmPost() {
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuFarmPost = true;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuBuyToken() {
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = true;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuTokenInfo() {
    if (isPlatformBrowser(this.platformId))
      window.open(
        'https://testnet.satt.atayen.us/wallet/token-info?crypto=SATT',
        '_self'
      );
  }
  checkMenuAbout() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://satt-token.com', '_blank');
  }
  checkMenuBlog() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://satt-token.com/blog/', '_blank');
  }
  checkMenuAdpool() {
    this.menuWallet = false;
    this.menuAdpool = true;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuHistory() {
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuFarmPost = false;
    this.menuHistory = true;
    this.menuHelp = false;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuHelp() {
    this.menuWallet = false;
    this.menuAdpool = false;
    this.menuFarmPost = false;
    this.menuHistory = false;
    this.menuHelp = true;
    this.menuBuyToken = false;
    this.menuTokenInfo = false;
    this.menuAbout = false;
    this.menuBlog = false;
  }
  checkMenuWallet() {
    if (this.isConnected) {
      this.menuWallet = true;
      this.menuAdpool = false;
      this.menuFarmPost = false;
      this.menuHistory = false;
      this.menuHelp = false;
      this.menuBuyToken = false;
      this.menuTokenInfo = false;
      this.menuAbout = false;
      this.menuBlog = false;
      this.walletService.dismissPage.next(true);
    } else {
      this.checkMenuAdpool();
    }
  }
  fixMenuItemsWidth() {
    setTimeout(() => {
      let element0 = this.document.getElementById('introo');
      if (element0) element0.style.width = element0.offsetWidth + 'px';
      let element2 = this.document.getElementById('intro2');
      if (element2) element2.style.width = element2.offsetWidth + 'px';
      let element3 = this.document.getElementById('intro3');
      if (element3) element3.style.width = element3.offsetWidth + 'px';
      let element4 = this.document.getElementById('intro4');
      if (element4) element4.style.width = element4.offsetWidth + 'px';
      let element6 = this.document.getElementById('intro6');
      if (element6) element6.style.width = element6.offsetWidth + 'px';
      let element7 = this.document.getElementById('intro7');
      if (element7) element7.style.width = element7.offsetWidth + 'px';
      let element8 = this.document.getElementById('intro8');
      if (element8) element8.style.width = element8.offsetWidth + 'px';
    }, 1000);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      let element0 = this.document.getElementById('introo');
      if (element0) element0.style.removeProperty('width');
      let element2 = this.document.getElementById('intro2');
      if (element2) element2.style.removeProperty('width');
      let element3 = this.document.getElementById('intro3');
      if (element3) element3.style.removeProperty('width');
      let element4 = this.document.getElementById('intro4');
      if (element4) element4.style.removeProperty('width');
      let element6 = this.document.getElementById('intro6');
      if (element6) element6.style.removeProperty('width');
      let element7 = this.document.getElementById('intro7');
      if (element7) element7.style.removeProperty('width');
      let element8 = this.document.getElementById('intro8');
      if (element8) element8.style.removeProperty('width');
      setTimeout(() => {
        this.resized = true;
      }, 6000);
      if (this.resized) {
        this.fixMenuItemsWidth();
        this.resized = false;
      }
    }
  }

  navigateToWelcomePage() {
    this.router.navigate(['/']);
  }

  signOut() {
    this.tokenStorageService.logout().subscribe(
      () => {
        this.campaignFacade.clearLinksListStore();
        this.campaignDataStore.clearDataStore(); // clear globale state before logging out user.
        this.ParticipationListStoreService.clearDataFarming();
        this.walletFacade.dispatchLogout(); //clear totalBalance and cryptoList
        this.accountFacadeService.dispatchLogoutAccount(); //clear account user
        this.socialAccountFacadeService.dispatchLogoutSocialAccounts(); // clear social accounts
        this.ParticipationListStoreService.nextPage.pageNumber = 0;
        this.profileSettingsFacade.clearProfilePicStore();
        this.authStoreService.clearStore();
        this.tokenStorageService.clear();
        this.kycFacadeService.dispatchLogoutKyc();
        this.isConnected = false;
        this.authService.setIsAuthenticated(false);
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
        this.router.navigate(['/auth/login']);
      },
      () => {
        this.campaignFacade.clearLinksListStore();
        this.campaignDataStore.clearDataStore(); // clear globale state before logging out user.
        this.ParticipationListStoreService.clearDataFarming();
        this.walletFacade.dispatchLogout(); //clear totalBalance and cryptoList
        this.accountFacadeService.dispatchLogoutAccount(); //clear account user
        this.socialAccountFacadeService.dispatchLogoutSocialAccounts(); // clear social accounts
        this.ParticipationListStoreService.nextPage.pageNumber = 0;
        this.profileSettingsFacade.clearProfilePicStore();
        this.authStoreService.clearStore();
        this.tokenStorageService.clear();
        this.kycFacadeService.dispatchLogoutKyc();
        this.isConnected = false;
        this.authService.setIsAuthenticated(false);
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
        this.router.navigate(['/auth/login']);
      }
    );

    /*
    this.campaignsListStore.clearStore();
*/
  }
  ngOnDestroy(): void {
    if (!!this.isDestroyed$) {
      this.isDestroyed$.next('');
      this.isDestroyed$.complete();
      this.isDestroyed$.unsubscribe();
    }
    //this.translate.onLangChange.unsubscribe();
  }
}
