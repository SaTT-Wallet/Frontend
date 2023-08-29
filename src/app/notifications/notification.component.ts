import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  PLATFORM_ID,
  Inject,
  ViewChild,
  Renderer2
} from '@angular/core';
import { NotificationService } from '@core/services/notification/notification.service';
import { ContactService } from '@core/services/contact/contact.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
//import * as moment from 'moment';
import _ from 'lodash';
import { walletUrl, ListTokens, tronScan } from '@config/atn.config';
import { isPlatformBrowser } from '@angular/common';
import { bscan, etherscan, polygonscan, bttscan } from '@app/config/atn.config';
//import 'moment/locale/fr'

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Big } from 'big.js';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { INotificationsResponse } from '@app/core/notifications-response.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { environment } from '@environments/environment';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { User } from '@app/models/User';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { ProfileSettingsFacadeService } from '@app/core/facades/profile-settings-facade.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-history',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
 
  searchTerm: any;
  term: any;
  public currentLang: string | undefined;
  form: UntypedFormGroup;
  picUserUpdated: boolean = false;
  searchvalue: string = '';
  arrayTypeNotification: Array<{ type: string; type_notif: string }>;
  arrayContact: any;
  user!: User;
  dataNotification: any;
  dataNotificationFilter: any;
  dateDebutValue: any;
  dateFinValue: any;
  urlpic: any;
  typeNotifValue: any;
  contactValue: any;
  urlPic: any;
  isloading: boolean = false;
  nodata: boolean = true;
  isfocused: boolean = false;
  filterListType: any = [];
  @ViewChild('instagramDiv') instagramDiv?: ElementRef;
  @ViewChild('instaDiv') instaDiv?: ElementRef;
  isClickedOutside: boolean = true;
  showSpinner!: boolean;
  showSpinner2!: boolean;
  crypto: any;
  private isDestroyed = new Subject();
  showNotifcationMessage!: string;
  showNotification: boolean  = false;
  percentProf: number = 0;
  private onDestoy$ = new Subject();
  private account$ = this.accountFacadeService.account$;
  campaignCover: string = '';
  notificationRandomNumber!: number;
  percentProf2!: string;

  offset: any;
  // tansfer:string='transfer_event_currency'
  bscan = environment.bscan;
  etherscan = environment.etherscan;
  tronScan = environment.tronScan;
  polygonscan = environment.polygonscan;
  bttscan = environment.bttscan;

  newNotification: boolean = false;
  errorMessagecode = '';
  modalReference: any;
  //
  buttonData1 = [
    { text: "filtre_mycrypto_sent", toggle: true },
    { text: "filtre_mycrypto_received", toggle: true },
    { text: "filtre_mycrypto_requested", toggle: true }
  ];
  buttonData2 = [
    { text: "filtre_choosestatus_in progress", toggle: true },
    { text: "filtre_choosestatus_finished", toggle: true },
    { text: "filtre_choosestatus_budget_alert", toggle: true }
  ];
  buttonData3 = [
    { text: "filtre_My_Links_to_harvest", toggle: true },
    { text:  "filtre_My_Links_waiting", toggle: true },
    { text: "filtre_My_Links_refused", toggle: true }
  ];
  checkboxData = [
    { label: 'Facebook', toggle: false },
    { label: 'Instagram', toggle: false },
    { label: 'Linkedin', toggle: false },
    { label: 'Tiktok', toggle: false },
    { label: 'Twitter', toggle: false },
    { label: 'Youtube', toggle: false }
  ];
  // this.translate.instant('filtre_Adpools_message')
  checkboxData1 = [{ label: "filtre_Adpools_message", toggle: false }];



  enableDisableRulecheck(checkbox: any) {
    checkbox.toggle = !checkbox.toggle;

    const checkboxLabelMappings: { [key: string]: string } = {
      'filtre_Adpools_message': 'cmp_candidate_insert_link',
      'Facebook': 'cmp_candidate_accept_link/facebook',
      'Instagram': 'cmp_candidate_accept_link/instagram',
      'Linkedin': 'cmp_candidate_accept_link/linkedin',
      'Tiktok': 'cmp_candidate_accept_link/tiktok',
      'Twitter': 'cmp_candidate_accept_link/twitter',
      'Youtube': 'cmp_candidate_accept_link/youtube'
    };
  
    const filterType = checkboxLabelMappings[checkbox.label];
  
    if (filterType) {
      if (checkbox.toggle) {
        this.filterListType.push(filterType);
      } else {
        const index = this.filterListType.indexOf(filterType);
        if (index > -1) {
          this.filterListType.splice(index, 1);
        }
      }
      this.filterNotificationList(this.filterListType);
    }
  }


  enableDisableRule(button: any) {
    button.toggle = !button.toggle;
    const buttonTypeMappings: { [key: string]: string } = {
      'filtre_mycrypto_sent': 'transfer_event',
      'filtre_mycrypto_received': 'receive_transfer_event',
      'filtre_mycrypto_requested': 'send_demande_satt_event'
    };
    const filterType = buttonTypeMappings[button.text];
    if (filterType) {
      if (!button.toggle) {
        this.filterListType.push(filterType);
      } else {
        const index = this.filterListType.indexOf(filterType);
        if (index > -1) {
          this.filterListType.splice(index, 1);
        }
      }
      this.filterNotificationList(this.filterListType);
    }
  }
 

  constructor(
    private eRef: ElementRef,
    private renderer: Renderer2,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private _changeDetectorRef: ChangeDetectorRef,
    private NotificationService: NotificationService,
    private ContatcService: ContactService,
    private translate: TranslateService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private accountFacadeService: AccountFacadeService,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: string,
    private modalService: NgbModal
  ) {
    this.arrayTypeNotification = [
      { type: 'transfer_satt_event', type_notif: 'send_satt' },
      { type: 'received_satt_event', type_notif: 'receive_satt' },
      { type: 'contact_satt_event', type_notif: 'contact_' }
    ];

    this.form = new UntypedFormGroup({
      type_notification: new UntypedFormControl(null, Validators.required),
      contact: new UntypedFormControl(null, Validators.required),
      date_debut: new UntypedFormControl(null, Validators.required),
      date_fin: new UntypedFormControl(null, Validators.required)
    });

    translate.onLangChange
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((event: LangChangeEvent) => {
        this.currentLang = event.lang;
        this._changeDetectorRef.detectChanges();
        this.translate.use(this.currentLang);
        this.getAllNotifications();
      });
  }
  getNotificationIcon() {
    return this.showNotifcationMessage === 'showing-buy-satt' 
    ? './assets/Images/notif-buy-satt.svg' 
    : (this.showNotifcationMessage === 'showing-buy-fees' ? './assets/Images/notif-buy-gas.svg' 
    : (this.showNotifcationMessage === 'showing-campaign' ? './assets/Images/notifIcons/tesmail.svg' 
    : (this.showNotifcationMessage === 'showing-random-number' ? 
    (
      this.notificationRandomNumber === 1  ? './assets/Images/notif-faq.svg' : (this.notificationRandomNumber === 2  ?  './assets/Images/notif-social-media.svg' : './assets/Images/notif-invite-friends.svg') 
    ) : './assets/Images/moonboy/Default_avatar_MoonBoy.png')
    ) 
    )
  }
  getNotificationBody() {
    return (this.showNotifcationMessage === 'showing-campaign' ? 'new_adpools_notification'
    : (
      this.showNotifcationMessage === 'showing-buy-fees' ? 'notif_buy_gas'
      : (
          this.showNotifcationMessage === 'showing-buy-satt' ? 'notif_buy_satt' 
          : (this.showNotifcationMessage === 'showing-complete-profile' ? 'notif_complete_profile' 
          : 
          (this.showNotifcationMessage === 'showing-random-number' ? (

          this.notificationRandomNumber === 1 ? 'notif_problem_faq' : (this.notificationRandomNumber === 2 ? 'notif_join_social_networks' : 'notif_invite_friends')
          ) : '') 
          )
          
        
      )
    )
    
    )
  }
  getNotificationTitle() {
    return (this.showNotifcationMessage === 'showing-campaign' ? 'New_AdPools_welcome'
                  : (
                    this.showNotifcationMessage === 'showing-buy-fees' ? 'buy-gas'
                    : (
                        this.showNotifcationMessage === 'showing-buy-satt' ? 'invite_friends' 
                        : (this.showNotifcationMessage === 'showing-random-number' ? (

                        this.notificationRandomNumber === 1 ? 'problem_faq' : (this.notificationRandomNumber === 2 ? 'join_social_networks' : 'invite_friends_notif')
                        ) : './assets/Images/moonboy/Default_avatar_MoonBoy.png') 
                      
                    )
                  )
                  
                  ) 
  }
  getNotificationButtonTitle() {
    return (this.showNotifcationMessage === 'showing-campaign' ? 'ad_pool' 
    : (
      (this.showNotifcationMessage === 'showing-buy-fees' || this.showNotifcationMessage === 'showing-buy-satt') ? 'Cryptolist.acheter'
      : (
        this.showNotifcationMessage === 'showing-complete-profile' ? 'complete-profile' : (
          this.notificationRandomNumber === 1 ? 'read-faq' : 'campaign.shares' 
        )
      )
    )
    
    ) 
  }
  getButtonClass() {
    if (this.showNotifcationMessage === 'new_adpools_notification' || this.showNotifcationMessage === 'notif_buy_gas') {
      return 'button-rounded';
    } else {
      return 'button-roundedblue';
    }
  }
  navigateTo() {
    switch(this.showNotifcationMessage) {
      case 'showing-complete-profile':
          this.router.navigate(['/settings/profile']);
          break;
        case 'showing-buy-satt':
          this.router.navigate(['/wallet/buy-token']);
          break;
        case 'showing-buy-fees':
          this.router.navigate(['/wallet/buy-token']);
          break;
        case 'showing-campaign':
          this.router.navigate(['/ad-pools']);
          break;
        case 'showing-random-number':
          if(this.notificationRandomNumber === 1) this.router.navigate(['/FAQ']);
          else this.router.navigate(['/FAQ']);
          
          break;


        default:
          console.error('case not found')
    }
  }
  getNotificationsDecision() {
    this.showSpinner2 = true;
    this.socialAccountFacadeService.notification().subscribe((res: any) => {
      switch(res.message) {
        case 'showing-complete-profile':
          this.showNotifcationMessage = res.message;
          this.getDetails();
          this.showNotification = true;
          this.showSpinner2 = false;
          break;
        case 'showing-buy-satt':
          this.showNotifcationMessage = res.message;
          this.showNotification = true;
          this.showSpinner2 = false;
          break;
        case 'showing-buy-fees':
          this.showNotifcationMessage = res.message;
          this.showNotification = true;
          this.showSpinner2 = false;
          break;
        case 'showing-campaign':
          this.showNotifcationMessage = res.message;
          this.showNotification = true;
          this.campaignCover = res.data;
          this.campaignCover = this.campaignCover.replace('ipfs:', '');
          this.showSpinner2 = false;
          break;
        case 'showing-random-number':
          this.showNotifcationMessage = res.message;
          this.showNotification = true;
          this.notificationRandomNumber = res.data;
          this.showSpinner2 = false;
          break;


        default:
          this.showNotification = false;
          this.showSpinner2 = false;
      }
     
    }, (err: any) => {
      this.showNotification = false;
      this.showSpinner2 = false;
    })
  }
  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
  }

  getDetails() {
    // this.spinner.show();
    this.showSpinner = true;
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          let count = 0;
          this.showSpinner = false;
          this.user = new User(response);
          this.urlpic = this.user.idUser;
          this.picUserUpdated = response.photoUpdated;
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
          //let count2 = 0;
          this.percentProf = (count * 100) / 10;

          this.percentProf2 = this.percentProf.toFixed(0) + '%';


          if (!this.user.instagramLink) {
            $('#addInsta').css('pointer-events', 'none');
          }
          if (!this.user.fbLink) {
            $('#addFb').css('pointer-events', 'none');
          }
          if (!this.user.twitterLink) {
            $('#addTwitter').css('pointer-events', 'none');
          }
          if (!this.user.youtubeLink) {
            $('#youtube-link').css('pointer-events', 'none');
          }

          this.profileSettingsFacade.profilePic$
            .pipe(takeUntil(this.onDestoy$))
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
          // if (this.user.picLink) {
          //   this.user.userPicture = this.user?.picLink;
          // }else{
          //    this.ProfileService.getUserProfilePic().subscribe(
          //   (profile: any) => {
          //     let objectURL = URL.createObjectURL(profile);
          //     this.user.userPicture =
          //       this.sanitizer.bypassSecurityTrustUrl(objectURL);
          //   }
          // );
          // }
        }
      });
  }
  hideNotification() {
    this.showNotification = false;
  }
  ngOnInit(): void {
    this.getAllNotifications();
    this.getNotificationsDecision();
    
  }
  seeNotification() {
    this.NotificationService.notificationSeen()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response: any) => {
        if (response?.message === 'Notification clicked') {
          this.newNotification = false;
        }
      });
  }

  filtrer() {
    this.showSpinner = true;
    this.dateDebutValue = this.form.get('date_debut')?.value;
    this.dateFinValue = this.form.get('date_fin')?.value;
    this.typeNotifValue = this.form.get('type_notification')?.value;
    this.contactValue = this.form.get('contact')?.value;
    this.NotificationService.getAllNotifications()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(
        (response: any) => {
          if (response.code === 200 && response.message === 'success') {
            this.showSpinner = false;
            this.dataNotificationFilter = response.data.notifications;
            //--------------------------------filter with date and type
            if (
              this.typeNotifValue &&
              this.dateDebutValue &&
              this.dateFinValue
            ) {
              const filter_type_date = this.dataNotificationFilter.forEach(
                (item: any) => {
                  return (
                    item.type === this.typeNotifValue &&
                    item.created > this.dateDebutValue &&
                    item.created < this.dateFinValue
                  );
                }
              );
              if (filter_type_date) {
                this.nodata = false;
                filter_type_date.forEach((item2: any) => {
                  this.siwtchFunction(item2);
                });
                this.dataNotification = _.chain(filter_type_date)
                  .groupBy('created')
                  .map((value: any, key: any) => ({ created: key, value }))
                  .value();
              } else {
                this.nodata = true;
                this.dataNotification = [];
              }
              this.dateDebutValue = this.form.get('date_debut')?.setValue(null);
              this.dateFinValue = this.form.get('date_fin')?.setValue(null);
              this.typeNotifValue = this.form
                .get('type_notification')
                ?.setValue(null);
            }
            //------------------------------filter with date
            else if (this.dateDebutValue && this.dateFinValue) {
              const filter_date = this.dataNotificationFilter.forEach(
                (item: any) => {
                  return (
                    item.created > this.dateDebutValue &&
                    item.created < this.dateFinValue
                  );
                }
              );
              if (filter_date) {
                this.nodata = false;
                filter_date.forEach((item2: any) => {
                  this.siwtchFunction(item2);
                });
                this.dataNotification = _.chain(filter_date)
                  .groupBy('created')
                  .map((value: any, key: any) => ({ created: key, value }))
                  .value();
              } else {
                this.nodata = true;
                this.dataNotification = [];
              }
              this.dateDebutValue = this.form.get('date_debut')?.setValue(null);
              this.dateFinValue = this.form.get('date_fin')?.setValue(null);
            }
            //------------------------------filter with type
            else if (this.typeNotifValue) {
              const filter_type = this.dataNotificationFilter.forEach(
                (item: any) => {
                  return item.type === this.typeNotifValue;
                }
              );
              if (filter_type) {
                this.nodata = false;
                filter_type.forEach((item2: any) => {
                  this.siwtchFunction(item2);
                });
                this.dataNotification = _.chain(filter_type)
                  .groupBy('created')
                  .map((value: any, key: any) => ({ created: key, value }))
                  .value();
              } else {
                this.nodata = true;
                this.dataNotification = [];
              }
            } else {
              this.getAllNotifications();
            }
            this.typeNotifValue = this.form
              .get('type_notification')
              ?.setValue(null);
          } else {
            this.nodata = true;
            this.dataNotification = [];
          }
        },
        () => {}
      );
  }
  getLinkIconWaitingValidation(prom : any) {
    return `./assets/Images/oracle-${prom.oracle}-waiting-validation.svg`
  }

  getLinkIconValidate( link: string) {
    const keywordToIconMap = [
      { keyword: 'facebook', icon: 'facebook' },
      { keyword: 'instagram', icon: 'instagram' },
      { keyword: 'linkedin', icon: 'linkedin' },
      { keyword: 'threads', icon: 'threads' },
      { keyword: 'tiktok', icon: 'tiktok' },
      { keyword: 'twitter', icon: 'twitter' },
      { keyword: 'youtube', icon: 'youtube' }
    ];
  
    const foundMapping = keywordToIconMap.find(mapping => link.includes(mapping.keyword));
    return foundMapping ? `./assets/Images/oracle-${foundMapping.icon}-validate.svg` : '';
  }


  getOracle( link: string) {
    const keywordToOracleList = [
      { keyword: 'facebook', oracle: 'facebook' },
      { keyword: 'instagram', oracle: 'instagram' },
      { keyword: 'linkedin', oracle: 'linkedin' },
      { keyword: 'threads', oracle: 'threads' },
      { keyword: 'tiktok', oracle: 'tiktok' },
      { keyword: 'twitter', oracle: 'twitter' },
      { keyword: 'youtube', oracle: 'youtube' }
    ];
  
    const foundMapping = keywordToOracleList.find(mapping => link.includes(mapping.keyword));
    return foundMapping ? foundMapping.oracle : '';
  }

  getSafeUrl(i:any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(i.label.cmp_link + "embed/captioned/?cr=1&v=14&wp=540&rd=http%3A%2F%2Flocalhost%3A4200&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A15257.489999999962%2C%22ls%22%3A1741.52000000322%2C%22le%22%3A1848.8950000028126%7D");
    
  }
  getAllNotifications() {
    this.showSpinner = true;
    this.NotificationService.getAllNotifications()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response: INotificationsResponse) => {
        if (!response) {
          this.showSpinner = false;

          this.errorMessagecode = 'No notifications found';
        }

        if (response !== null && response !== undefined) {
          
          this.isloading = false;
          this.dataNotification = response.data.notifications;
          this.dataNotification.map((notif:any) => {
           
          })
          if (response.data.isSeen !== 0) {
            this.seeNotification();
          }

          this.dataNotification.forEach((item: any) => {
            item.created =
              item.created && item.created !== 'a few seconds ago'
                ? item.created
                : item.createdAt;
            this.siwtchFunction(item);
          });
          this.dataNotification = _.chain(this.dataNotification)
            .sortBy((data) => data.createdInit)
            .reverse()
            .groupBy('created')
            .map((value: any, key: any) => {
              return { created: key, value };
            })
            .value();

            /*
             for(let item  of notification.value; let index=i) {
                if(item.type === 'join_on_social' || item.type === 'invite_friends' || item.type === 'buy_some_gas') {
                  delete notification.value[index];
                }
            }
              */
            this.dataNotification.forEach((notification: any) => {
              
              for(let i = 0 ; i < notification.value.length; i++ ) {
                if(notification.value[i].type === 'join_on_social' || notification.value[i].type === 'invite_friends' || notification.value[i].type === 'buy_some_gas' ) {
                  delete notification.value[i];
                }
              }
            
            
            
            
            
            })


            this.dataNotificationFilter = this.dataNotification;
           
            this.showSpinner = false;
        
          }
      });
  }

  filterNotificationList(types: string[]) {
    if (types.length > 0) {
      const data = this.dataNotification;
      this.dataNotificationFilter = data.map((notification: any) => {
        const filteredValue = notification.value.filter((item: any) => {
          let linkFiltred = false;
          if (types.some(type => type.startsWith('cmp_candidate_accept_link/')) && item.type === 'cmp_candidate_accept_link') {
            linkFiltred = true;
            
          } else {
            linkFiltred = false;
          }
          return types.includes(linkFiltred ? `cmp_candidate_accept_link/${this.getOracle(item.label.cmp_link)}` : item.type);
        });
        return { ...notification, value: filteredValue };
      });
    } else {
      this.dataNotificationFilter = this.dataNotification;
    }
  }
  

  resetFilter() {
    this.filterListType = [];
    this.dataNotificationFilter = this.dataNotification;
  }


  onScroll() {
    if (this.isloading) {
      this.showSpinner = true;
    }
  }

  siwtchFunction(item: any) {
    const etherInWei = new Big(1000000000000000000);
    let itemDate = new Date(item.created);
    item.createdInit = item.created;
    if (this.tokenStorageService.getLocalLang() === 'en') {
      item.createdFormated = moment
        .parseZone(itemDate)
        .format(' MMMM Do YYYY, h:mm a z');
      item.created = moment.parseZone(item.created).fromNow().slice();
    } else if (this.tokenStorageService.getLocalLang() === 'fr') {
      item.createdFormated = moment
        .parseZone(itemDate)
        .locale('fr')
        .format(' Do MMMM  YYYY, HH:mm a z');
      item.created = moment.parseZone(itemDate).locale('fr').fromNow();
    }
    // console.log(this.translate.instant(''))
    //  let typeof_data=typeof(item.label)
    //  console.log(this.translate.instant(''))
    //    if(typeof_data =='object'){
    //   item._label= item.label
    // }else{
    //   item._label = JSON.parse(item.label )
    // }
    item._label = item.label;

    const receive_satt_pic = './assets/Images/notifIcons/Reception.svg';
    const receive_satt_pic1 = './assets/Images/notifIcons/Reception1.svg';
    switch (item.type) {
      case 'buy_some_gas':
        item._label = 'buy_some_gas';
        item.img = receive_satt_pic;
        item.img1 = receive_satt_pic1;
        item.content = 'gas_notif';
        break;
      case 'invite_friends':
        item._label = 'invite_friends';
        item.img = receive_satt_pic;
        item.img1 = receive_satt_pic1;
        item.content = 'invite_notif';
        break;
      case 'join_on_social':
        item._label = 'join_on_social';
        item.img = receive_satt_pic;
        item.img1 = receive_satt_pic1;
        item.content = 'network_notif';
        break;
      case 'send_demande_satt_event':
        item._params = {
          nbr: item._label['price'],
          crypto:
            item._label['cryptoCurrency'] &&
            (item._label['cryptoCurrency'] === 'SATTBEP20' ||
              item._label['cryptoCurrency'] === 'SATTPOLYGON' ||
              item._label['currency'] === 'SATTBTT' ||
              item._label['currency'] === 'SATTTRON')
              ? 'SATT'
              : item._label['cryptoCurrency'] ||
                (item._label['currency'] &&
                  (item._label['currency'] === 'SATTBEP20' ||
                    item._label['currency'] === 'SATTPOLYGON' ||
                    item._label['currency'] === 'SATTBTT' ||
                    item._label['currency'] === 'SATTTRON'))
              ? 'SATT'
              : item._label['currency'],
          // crypto: item._label['currency'],
          name: item._label['name']
        };
        item._label = 'asked_to_acquire';
        item.img = receive_satt_pic;
        item.img1 = receive_satt_pic1;
        break;
      //////////////////////////////////////////
      case 'demande_satt_event':
        item._params = {
          nbr: item._label['price'],
          crypto:
            item._label['cryptoCurrency'] &&
            (item._label['cryptoCurrency'] === 'SATTBEP20' ||
              item._label['cryptoCurrency'] === 'SATTPOLYGON' ||
              item._label['currency'] === 'SATTBTT' ||
              item._label['currency'] === 'SATTTRON')
              ? 'SATT'
              : item._label['cryptoCurrency'] ||
                (item._label['currency'] &&
                  (item._label['currency'] === 'SATTBEP20' ||
                    item._label['currency'] === 'SATTPOLYGON' ||
                    item._label['currency'] === 'SATTBTT' ||
                    item._label['currency'] === 'SATTTRON'))
              ? 'SATT'
              : item._label['currency'],
          name: item._label['name']
        };
        item._label = 'asked_cryptoCurrency';
        item.img = receive_satt_pic;
        item.img1 = receive_satt_pic1;
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
          item._label['currency'] === "SATTPOLYGON" && (item._label['decimal'] = 18)
          let decimal = item._label['decimal']
            ? new Big('10').pow(item._label['decimal'])
            : ListTokens[item._label.currency].decimals;

          item._params = {
            currency:
              item._label['currency'] === 'SATTBEP20' ||
              item._label['currency'] === 'SATTPOLYGON' ||
              item._label['currency'] === 'SATTBTT' ||
              item._label['currency'] === 'SATTTRON'
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
        item.img1 = './assets/Images/notifIcons/envoi1.svg';
        break;

      /*
            item._label['currency'] === 'SATTBEP20' ||
              item._label['currency'] === 'SATTPOLYGON'
              ? 'SATT': item.label['currency'],
        
        */
      //////////////////////////////////////////

      case 'receive_transfer_event':
        if (item._label['currency']) {

          item._label['currency'] === "SATTPOLYGON" && (item._label['decimal'] = 18)
          let decimal = item._label['decimal']
            ? new Big('10').pow(item._label['decimal'])
            : ListTokens[item._label.currency]?.decimals;

          item._params = {
            nbr: Big(item._label['amount']).div(decimal ?? 18),
            currency:
              item._label['currency'] === 'SATTBEP20' ||
              item._label['currency'] === 'SATTPOLYGON' ||
              item._label['currency'] === 'SATTBTT' ||
              item._label['currency'] === 'SATTTRON'
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
        item.img1 = './assets/Images/notifIcons/Receive.svg';
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
      case 'apply_campaign':
        item._params = {
          title: item._label['cmp_name'],
          owner: item._label['cmp_owner'],
          hash: item._label['txhash'] || item._label['hash']
        };
        item._label = 'apply_campaign';
        item.img = './assets/Images/notifIcons/CandidValid.svg';
        break;
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
        item.img1 = receive_satt_pic1;
        break;
      //////////////////////////////////////////
      case 'transfer_satt_event':
        item._params = {
          nbr: item._label['amount'],
          crypto:
            item._label['currency'] === 'SATTBEP20' ||
            item._label['currency'] === 'SATTPOLYGON' ||
            item._label['currency'] === 'SATTBTT' ||
            item._label['currency'] === 'SATTTRON'
              ? 'SATT'
              : item.label['currency'],
          email: item._label[2]
        };
        item._label = 'transfer_money';
        item.img = './assets/Images/notifIcons/envoi.svg';
        item.img1 = './assets/Images/notifIcons/envoi1.svg';
        break;
      //////////////////////////////////////////
      case 'received_satt_event':
        item._params = {
          nbr: item._label['amount'],
          crypto:
            item._label['currency'] === 'SATTBEP20' ||
            item._label['currency'] === 'SATTPOLYGON' ||
            item._label['currency'] === 'SATTBTT' ||
            item._label['currency'] === 'SATTTRON'
              ? 'SATT'
              : item.label['currency'],
          email: item._label[2]
        };
        item._label = 'received_satt';
        item.img = receive_satt_pic;
        item.img1 = receive_satt_pic1;
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
        item.img1 = './assets/Images/notifIcons/envoi1.svg';
        break;
      //////////////////////////////////////////
      case 'buy_satt_event':
        item._params = {
          amount: item._label['amount'],
          quantity: item._label['quantity']
        };
        item._label = 'buy_satt_notify';
        item.img = receive_satt_pic;
        item.img1 = receive_satt_pic1;
        break;

      //////////////////////////////////////////
    }
  }

  tr(item: any, params: any) {
    if (!params) {
      return this.translate.instant(item || ' ');
    } else {
    }
  }

  onFocus() {
    this.isfocused = true;
  }
  focusOutFunction() {
    this.isfocused = false;
  }

  hashLink(network: any, link: any) {
    if (network === 'eth' && isPlatformBrowser(this.platformId)) {
      window.open(etherscan + link, '_blank');
    } else if (
      (network === 'bsc' || network === 'BEP20') &&
      isPlatformBrowser(this.platformId)
    ) {
      window.open(bscan + link, '_blank');
    } else if (network === 'BTTC' && isPlatformBrowser(this.platformId)) {
      window.open(bttscan + link, '_blank');
    } else if (network === 'polygon' && isPlatformBrowser(this.platformId)) {
      window.open(polygonscan + link, '_blank');
    } else if (network === 'tron' && isPlatformBrowser(this.platformId)) {
      window.open(tronScan + link, '_blank');
    }
  }

  redirect(notif: any, content: any): void {
    // if (notif.type === 'join_on_social') {
    //   this.modalReference = this.modalService.open(content);
    // }
    // if (notif.type === 'invite_friends') {
    //   this.router.navigateByUrl('/wallet/buy-token');
    // }

    // if (notif.type === 'buy_some_gas') {
    //   this.router.navigate(['/wallet/buy-token'], {
    //     queryParams: { id: 'BNB', network: 'BEP20' }
    //   });
    // }

    if (notif?.label?.txhash) {
      this.hashLink(notif?.label?.network, notif?.label?.txhash);
    } else if (notif?.label?.cmp_hash) {
      this.router.navigate(['home/farm-posts']);
    } //if the notification has cmp_has it will redirect to campaign detail component

    // if (notif?.label?.transactionHash) {
    //   let owner = notif.type === 'transfer_event' ? null : 'not owner';

    //   if (owner === 'not owner') {
    //     this.router.navigate(['home'], {
    //       queryParams: {
    //         page: 'send',
    //         transactionHash: notif?.label?.transactionHash,
    //         network: notif?.label?.network,
    //         amount: notif?.label?.amount,
    //         currency: notif?.label?.currency,
    //         owner
    //       }
    //     });
    //   } else {
    //     // this.router.navigate(['home/TransactionsHistory']);
    //   }
    // }

    // if (notif?.label?.transactionHash) {
    //   let owner = notif.type == "transfer_event" ? null : "not owner";
    //   this.router.navigate(["home/TransactionsHistory"])
    // }

    if (notif?.label?.promHash) {
      // console.log(notif?.label?.promHash)
      this.router.navigate(['home/farm-posts'], {
        queryParams: { promHash: notif?.label?.promHash }
      });
    }
    if (notif?.label?.cmp_hash && notif?.label?.linkHash) {
      // console.log(notif?.label?.promHash)
      this.router.navigate(['home/farm-posts']);
    }

    if (notif.label.network === 'eth') {
      window.open(etherscan + notif.label.transactionHash, '_blank');
    }
    if (notif.label.network === 'bsc') {
      window.open(bscan + notif.label.transactionHash, '_blank');
    }
    if (notif.label.network === 'BTTC') {
      window.open(bttscan + notif.label.transactionHash, '_blank');
    }
    if (notif.label.network === 'polygon') {
      window.open(polygonscan + notif.label.transactionHash, '_blank');
    }
    if (notif.label.network === 'tron') {
      window.open(tronScan + notif.label.transactionHash, '_blank');
    }
  }

  shareOnSocialMedias(content: any) {
    this.modalService.open(content);
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
