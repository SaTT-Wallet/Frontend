
import { PLATFORM_ID,Component, OnInit, Inject } from '@angular/core';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment as env } from './../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';

const bscanaddr = env.bscanaddr;
const etherscanaddr = env.etherscanaddr;
const tronScanAddr = env.tronScanAddr;
const polygonscanAddr = 'https://mumbai.polygonscan.com/address/';
const bttscanAddr = 'https://testnet.bttcscan.com/address/';


@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QRCodeComponent implements OnInit {
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


  constructor(private walletFacade: WalletFacadeService,
    @Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit(): void {
    this.portfeuille();
  }
  portfeuille() {
    
    this.walletFacade.loadUserWallet()
    this.walletFacade.wallet$
    .subscribe((data: any) => {
        if (!!data) {
          this.btcCode = data.data.btc;
          this.eth = data.data.address;
          this.tronAddress = data.data.tronAddress;
          this.url1 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.eth}&chs=150x150`;
          this.url2 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.btcCode}&chs=150x150`;
          this.url3 = `https://chart.apis.google.com/chart?cht=qr&chl=${this.tronAddress}&chs=150x150`;


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
  goToBscan(btcCode: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(bscanaddr + btcCode, '_blank');
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

  


}
