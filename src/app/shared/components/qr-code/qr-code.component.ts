import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment as env } from './../../../../environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const bscanaddr = env.bscanaddr;
const etherscanaddr = env.etherscanaddr;
const tronScanAddr = env.tronScanAddr;
const polygonscanAddr = env.polygonscanAddr;
const bttscanAddr = env.bttscanAddr;
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
  urlM1: any;
  erc20Selected = false;
  btcSelected = false;
  tronSelected = false;

  isTransactionHashCopied = false;
  isTransactionHashCopiedbtc = false;
  isTransactionHashCopiedtron = false;
  isLayoutDesktop = true;
  i = 0;

  private isDestroyed$ = new Subject();

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
    this.walletFacade.loadUserWallet();
    this.walletFacade.wallet$.subscribe((data: any) => {
      if (!!data) {
        console.log("dataaaaaaaaaaaaaa",data)
        this.btcCode = data.data.btc;
        this.eth = data.data.address;
        this.tronAddress = data.data.tronAddress;
        this.url1 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.eth}&chs=222x222`;
        this.url2 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.btcCode}&chs=222x222`;
        this.url3 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.tronAddress}&chs=222x222`;

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
