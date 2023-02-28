import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { IOption } from '@shared/components/multi-select/multi-select.component';
import { UntypedFormBuilder } from '@angular/forms';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignsFacade } from '@campaigns/models/campaigns-facade.interface';
import { CampaignsService } from '@campaigns/facade/campaigns.facade';
import { DisplayItemsStyle } from '@campaigns/components/toggle-style-host/toggle-style-host.component';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { ListTokens } from '@config/atn.config';
import { Big } from 'big.js';
import { AuthFacadeService } from '@app/core/facades/auth-facade/auth-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@app/core/windowRefService';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ad-pool-filter',
  templateUrl: './ad-pool-filter.component.html',
  styleUrls: ['./ad-pool-filter.component.scss']
})
export class AdPoolFilterComponent implements OnInit {
  @Output() onFormChange = new EventEmitter();
  @Output() isFormatGrid = new EventEmitter();
  @Output() cryptoFilter = new EventEmitter();

  toggled: boolean = false;
  showFilter = false;
  filterOptions: any = {
    blockchainType: '',
    oracles: [],
    remainingBudget: [],
    searchTerm: '',
    status: '',
    showOnlyMyCampaigns: null,
    showOnlyLiveCampaigns: null
  };

  filterCampaigns = this.fb.group({
    searchTerm: this.fb.control(''),
    status: this.fb.control('all'),
    oracles: this.fb.control([])
  });
  oraclesOptions: IOption[] = [
    {
      value: 'facebook',
      iconUrl: '/assets/Images/white-icon-facebook.svg',
      selectedIconUrl: '/assets/Images/fb-icon.svg',
      bgColor: 'white'
    },
    {
      value: 'twitter',
      iconUrl: '/assets/Images/white-icon-twitter.svg',
      selectedIconUrl: '/assets/Images/white-icon-twitter.svg',
      bgColor: '#55ACEE'
    },
    {
      value: 'youtube',
      iconUrl: '/assets/Images/white-icon-youtube2.svg',
      selectedIconUrl: '/assets/Images/youtube-activated.svg',
      bgColor: '#FF0000'
    },
    {
      value: 'instagram',
      iconUrl: '/assets/Images/white-icon-instagram.svg',
      selectedIconUrl: '/assets/Images/white-icon-instagram.svg',
      bgColor:
        'linear-gradient(315.8deg, #E09B3D 14.64%, #C74C4D 35.86%, #C21975 57.07%, #7024C4 85.36%)'
    }
  ];
  participationStatusOptions: IOption[] = [
    {
      value: 'true',
      text: 'icon-load',
      iconUrl: '/assets/Images/icon-load.svg'
    },
    {
      value: 'false',
      text: 'icon-pending',
      iconUrl: '/assets/Images/icon-pending.svg'
    },
    {
      value: 'rejected',
      text: 'icon-delete',
      iconUrl: '/assets/Images/icon-delete.svg'
    }
  ];
  showMore = false;
  isUserCampaignsToggled = false;
  onlyLiveCampaigns = false;
  listCryptos: any[] = [];
  selectedCrypto: any;
  showSort = false;
  sortItem: string = '';
  sortAdPoolUp = false;
  sortMediaUp = false;
  sortEndOnUp = false;
  sortRemunerationUp = false;
  sortFundsUp = false;
  isGridFormat = false;
  displayedItems: DisplayItemsStyle = 'grid';
  cryptoList$ = this.walletFacade.cryptoList$;
  cryptoList: any[] = [];
  cryptoListTags: any[] = [];
  connected: boolean = false;
  private isDestroyed = new Subject();

  constructor(
    private fb: UntypedFormBuilder,
    private campaignsListStoreService: CampaignsListStoreService,
    private modalService: NgbModal,
    private campaignsFacade: CampaignsService,
    private walletFacade: WalletFacadeService,
    private authFacade: AuthFacadeService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private documentRef: any,
    private windowRefService: WindowRefService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.walletFacade.loadCryptoList();
    this.getUserCrypto();
    this.checkConnected();
  }

  listenForStyleHost($event: any) {
    this.isFormatGrid.emit($event);
    this.displayedItems = $event ? 'grid' : 'list';
  }

  filterByBlockChainType($event: any) {
    if ($event === 'left') {
      this.filterOptions.blockchainType = 'erc20';
    }
    if ($event === 'right') {
      this.filterOptions.blockchainType = 'bep20';
    }
    if ($event === 'both') {
      this.filterOptions.blockchainType = '';
    }
    if ($event === 'none') {
      this.filterOptions.blockchainType = '';
    }
    this.campaignsListStoreService.setFilterValues(this.filterOptions);
  }

  filterByPerformanceType($event: any) {
    if ($event === 'left') {
      this.filterOptions.remuneration = 'publication';
    }
    if ($event === 'right') {
      this.filterOptions.remuneration = 'performance';
    }
    if ($event === 'both') {
      this.filterOptions.remuneration = '';
    }
    if ($event === 'none') {
      this.filterOptions.remuneration = '';
    }
    this.campaignsListStoreService.setFilterValues(this.filterOptions);
  }

  toggleFilters() {
    this.showMore = !this.showMore;
  }

  toggleIsUserCampaigns() {
    this.isUserCampaignsToggled = !this.isUserCampaignsToggled;
    if (this.isUserCampaignsToggled) {
      this.filterOptions.showOnlyMyCampaigns = true;
    } else {
      this.filterOptions.showOnlyMyCampaigns = '';
    }
    this.campaignsListStoreService.setFilterValues(this.filterOptions);
  }

  toggleOnlyLiveCampaigns() {
    this.onlyLiveCampaigns = !this.onlyLiveCampaigns;
    if (this.onlyLiveCampaigns) {
      this.filterOptions.showOnlyLiveCampaigns = true;
    } else {
      this.filterOptions.showOnlyLiveCampaigns = '';
    }
    this.campaignsListStoreService.setFilterValues(this.filterOptions);
  }

  filterByOracle($event: any) {
    this.filterOptions.oracles = $event;
    this.campaignsListStoreService.setFilterValues(this.filterOptions);
  }

  filterByBudget(budget: any) {
    this.filterOptions.remainingBudget = budget;
    this.campaignsListStoreService.setFilterValues(this.filterOptions);
  }

  toggleFilter() {
    this.showSort = false;
    this.showFilter = !this.showFilter;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  close(type: string) {
    if (type === 'filter') {
      this.showFilter = false;
    } else {
      this.showSort = false;
    }
  }

  toggleSort() {
    this.showFilter = false;
    this.showSort = !this.showSort;
  }
  checkConnected() {
    if (this.tokenStorageService.getIsAuth()) {
      this.connected = true;
    }
  }

  sortMedia(sortField: string, sortUp: boolean) {}

  sortCampaignsByField(sortField: string, sortUp: boolean) {
    const sortObject = { sortField: sortField, sortUp: sortUp };
    this.campaignsFacade.loadAdPoolCampaignsSortItem(sortObject);
  }
  getCurrencyName(cryptoName: any) {
    const currencyName = cryptoName;
    /*if (currencyName === ' SATTBEP20') {
      return 'SATTBEP20';
    }*/
    return currencyName;
  }

  checkCryptoFilter() {
    if (isPlatformBrowser(this.platformId)) {
      let dropdown = this.documentRef.getElementById('dropdown-ul');
      let dropdownWidth = dropdown.offsetWidth;
      dropdown.style.overflowX = 'scroll';
      this.cryptoListTags = this.cryptoList.filter(
        (crypto) => !!crypto.selected && crypto.selected
      );
      this.cryptoFilter.emit(
        this.cryptoListTags.map((crypto) => crypto.symbol.toUpperCase())
      );
    }
  }

  unselectCrypto(cryptoTag: any) {
    this.cryptoList[
      this.cryptoList.map((crypto) => crypto.symbol).indexOf(cryptoTag.symbol)
    ].selected = false;
    this.checkCryptoFilter();
  }

  getUserCrypto() {
    this.walletFacade.cryptoList$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((data: any) => {
        //  this.cryptoList = [...this.dataList.filter((data:any) => data.symbol.includes("SATT")).reverse(),...this.dataList.filter((data:any) => !data.symbol.includes("SATT")).reverse() ]
        data.sort(
          (a: any, b: any) =>
            parseFloat(b.total_balance) - parseFloat(a.total_balance)
        );
        // for (const key in ListTokens) {
        //   this.dataList.forEach((data: any) => {
        //     if (key === data.symbol) {
        //       this.cryptoList.push(data);
        //     }
        //   });
        // }

        //  this.dataList = data.listOfCrypto;
        // if (data.listOfCrypto.total_balance === "0") {
        //   this.dataList.total_balance = "0.00";
        // }
        data.forEach((crypto: any) => {
          crypto.type =
            crypto.network ?? ListTokens[crypto.symbol].type.toUpperCase();
          //  crypto.type = ListTokens[crypto.symbol]?.type;
          crypto.undername2 = crypto.undername2 ?? crypto.symbol;
          crypto.undername = crypto.undername ?? 'indispo';
          crypto.typetab = crypto.type;
          crypto.price = this.filterAmount(crypto.price + '');
          // crypto.variation = crypto.variation.toFixed(2) ?? "0";
          // crypto.quantity = this.filterAmount(crypto.quantity + "");
          if (crypto.quantity.toString().startsWith('-')) {
            crypto.quantity = '0';
          }
          crypto.quantity = new Big(crypto.quantity)
            .round(10, Big.roundDown)
            .toFixed();
          //crypto.quantity = new Big(crypto.quantity)
          crypto.total_balance = crypto.total_balance.toFixed(2);
        });
        data = [
          ...data.filter((data: any) => data.symbol === 'SATT'),
          ...data.filter((data: any) => data.symbol === 'USDT'),
          ...data.filter((data: any) => data.symbol === 'DAI'),
          ...data.filter((data: any) => data.symbol === 'SATTBEP20'),
          ...data.filter((data: any) => data.symbol === 'BUSD')
        ];
        this.cryptoList = data;
      });
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
  trackByCryptoTag(index: number, cryptoTag: any): string {
    return cryptoTag.code;
  }
  trackByCryptoList(index: number, cryptolist: any): string {
    return cryptolist.code;
  }
  trackByCryptoListTags(index: number, cryptolisttags: any): string {
    return cryptolisttags.code;
  }
  trackBySelectedCryptoTag(index: number, SelectedCrypto: any): string {
    return SelectedCrypto.code;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
