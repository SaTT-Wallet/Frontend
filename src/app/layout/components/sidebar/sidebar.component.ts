import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GazConsumedByCampaign } from '@app/config/atn.config';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { isPlatformBrowser } from '@angular/common';

//TODO: [SW-178] fix sidebar style and animation
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public isOpen: boolean;
  @ViewChild('estimatedValueToggler') estimatedValueToggler!: ElementRef;

  estimatedUSDValue: any = '$ 0.00';
  estimatedBTCValue: any = '0.00 BTC';
  estimatedETHValue: any = '0.00 ETH';
  estimatedSATTValue: any = '0.00 SaTT';
  destroy$: Subject<boolean> = new Subject<boolean>();

  active: string = '';
  bnb: any;
  eth: any;
  gazsend: any;
  eRC20Gaz: any;
  bEPGaz: any;
  isConnected: boolean = false;
  constructor(
    public sidebarService: SidebarService,
    private renderer: Renderer2,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private walletFacade: WalletFacadeService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.isOpen = this.sidebarService.toggleSidebar.value;

    /**
     * This events get called by all clicks on the page
     */
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen('document', 'click', (e: any) => {
        let getclass = e?.target?.attributes?.class?.nodeValue?.split(' ')[0];
        if (!(getclass === 'crypto')) {
          this.sidebarService.BalanceDropDown('change', false);
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  @Output() hidePortfolio: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isConnected = true;
      if (!this.tokenStorageService.getHideRedBloc()) {
        this.tokenStorageService.setItem('hideRedBloc', 'false');
      }

      this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(
        (params) => {
          if (params['page'] === 'wallet') {
            this.router.navigate(['/home']);
          }
        },
        () => {},
        () => {}
      );

      /*
    this.calcEstimatedValues();
*/
      this.parentFunction();
    } else {
      this.isConnected = false;
    }
  }

  // storeIdWallet(wallet: any) {
  //   this.ContactMessageService.userNode(
  //     wallet
  //   ).subscribe((data: any) => {});
  // }

  /*  calcEstimatedValues() {
    let address = this.tokenStorageService.getIdWallet();
    this.Fetchservice.fetchCryptoData().subscribe((prices: any) => {
      this.Fetchservice.totalAmount.subscribe((data: any) => {
        this.estimatedUSDValue = "$ " + data;
        this.estimatedBTCValue =
          (data/ prices["BTC"].price).toFixed(2) +
          " BTC";
        this.estimatedETHValue =
          (data / prices["ETH"].price).toFixed(2) +
          " ETH";
        this.estimatedSATTValue =
          (data / prices["SATT"].price).toFixed(2) +
          " SATT";
      });
    });
  }*/
  changeClass() {
    this.sidebarService.BalanceDropDown(
      'change',
      !this.sidebarService.DropDown
    );
  }

  toggleSidebarMobile() {
    this.sidebarService.toggleMobile();
  }

  toggleSidebarMobile2() {
    this.sidebarService.toggleMobile2();
  }

  parentFunction() {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        map((response: any) => response.data),
        takeUntil(this.destroy$)
      )
      .subscribe((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;

        this.walletFacade.etherGaz$
          .pipe(takeUntil(this.destroy$))
          .subscribe((gaz: any) => {
            let price;
            price = gaz.gasPrice;
            this.gazsend = (
              ((price * GazConsumedByCampaign) / 1000000000) *
              this.eth
            ).toFixed(2);
            this.eRC20Gaz = this.gazsend;
          });

        this.walletFacade.bnbGaz$
          .pipe(takeUntil(this.destroy$))
          .subscribe((gaz: any) => {
            let price = gaz.gasPrice;
            this.bEPGaz = (
              ((price * GazConsumedByCampaign) / 1000000000) *
              this.bnb
            ).toFixed(2);
          });
      });
  }

  goToCampaign() {
    this.router.navigate(['home/ad-pools']);
    this.sidebarService.toggleSidebarMobile.next(false);
  }
}
