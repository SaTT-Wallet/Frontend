import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '@environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const bscanaddr = environment.bscanaddr;
const etherscanaddr = environment.etherscanaddr;
const tronScanAddr = environment.tronScanAddr;
const polygonscanAddr = environment.polygonscanAddr;
const bttscanAddr = environment.bttscanAddr;
const btcScanAddr = 'https://www.blockchain.com/btc/address/';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QRCodeComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  btcCode: string = '';
  eth: string = '';
  tronAddress: string = '';
  portfeuilleList: Array<{ type: any; code: any }> = [];
  url1: any;
  url2: any;
  url3: any;
  url4: any;
  url5: any;
  url6: any;
  urlM1: any;
  erc20Selected = false;
  btcSelected = false;
  tronSelected = false;
  erc20V2Selected = false;
  btcV2Selected = false;
  tronV2Selected = false;

  isTransactionHashCopied = false;
  isTransactionHashCopiedbtc = false;
  isTransactionHashCopiedtron = false;
  isLayoutDesktop = true;
  i = 0;

  private isDestroyed$ = new Subject();
  ethv2: any;
  btcv2Code: any;
  tronv2Address: any;
  existV1: any;
  existV2: any ;
 

  constructor(
    private walletFacade: WalletFacadeService,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: Document,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge, Breakpoints.Medium])
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((result) => {
        this.isLayoutDesktop = result.matches;

        if (this.isLayoutDesktop === false && this.i % 2 === 0) {
          this.toogleDropDownQr();
          this.i++;
        }
      });
  }

  ngOnInit(): void {
    this.portfeuille();

  }
  toogleDropDownQr() {
    let elem = this.document.getElementsByClassName('toggle-qr');
    //@ts-ignore
    elem[0]?.click();
  }
  portfeuille() {
    this.walletFacade.getAllWallet()
    this.walletFacade.getAllWallet().subscribe((data: any) => {

      this.existV1= data.data.address
      
      if (!!data) {

       if(data.data.addressV2 != null){    this.existV2 = true      }
       else {this.existV2 = false   }
        this.btcCode = data.data.btcAddress;
        this.eth = data.data.address;
        this.tronAddress = data.data.tronAddress ;

        this.ethv2 = data.data.addressV2 ;
        this.btcv2Code = data.data.btcAddressV2;
        this.tronv2Address = data.data.tronAddressV2;


        this.url1 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.eth}&chs=222x222`;
        this.url2 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.btcCode}&chs=222x222`;
        this.url3 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.tronAddress}&chs=222x222`;

        this.url4 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.ethv2}&chs=222x222`;
        this.url5 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.btcv2Code}&chs=222x222`;
        this.url6 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.tronv2Address}&chs=222x222`;

        // assign qr code  uls
      }
    });
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
  copiedHashtron() {
    this.isTransactionHashCopiedtron = true;
    setTimeout(() => {
      this.isTransactionHashCopiedtron = false;
    }, 2000);
  }
  goToEther(eth: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(etherscanaddr + eth, '_blank');
  }
  goToBscan(eth: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(bscanaddr + eth, '_blank');
  }
  goToPolygonScan(eth: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(polygonscanAddr + eth, '_blank');
  }

  goToBttScan(eth: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(bttscanAddr + eth, '_blank');
  }

  goToTronScan(tronAddress: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(tronScanAddr + tronAddress, '_blank');
  }
  goToBtcScan(btcCode: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(btcScanAddr + btcCode, '_blank');
  }
}
