import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { filterAmount } from '@app/helpers/utils/common';
import Big from 'big.js';
import { WalletStoreService } from '@core/services/wallet-store.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {
  listCrypto: any[] = [
    { name: 'ETH', network: 'ERC20' },
    { name: 'BNB', network: 'BEP20' },
    { name: 'BTC', network: 'BTC' },
    { name: 'MATIC', network: 'POLYGON' },
    { name: 'BTT', network: 'BTTC' },
    { name: 'TRX', network: 'TRON' }
  ];
  gas = Big(0);
  errorMessage: boolean = false;
  gasToDisplay: any;
  arrayToMigrate: any[] = [];
  cryptobyNetwork: any;
  cryptoChecked = 'ERC20';
  network = { name: '', balance: '' };
  cryptoList$ = this.walletFacade.cryptoList$;
  passWallet = false;
  showPass: boolean = false;
  walletPassword = '';
  wrongpassword: boolean = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  hash = '';
  walletId = localStorage.getItem('wallet_id');
  spinner = false;
  outOfGas = false;
  @Input() migrate: any;
  onDestroy$ = new Subject();

  @Output() migrateEvent = new EventEmitter<String>();
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getScreenHeight = event.target.innerHeight;
    this.getScreenWidth = event.target.innerWidth;
    event.target.innerHeight;
  }
  constructor(
    private service: CryptofetchServiceService,
    private walletFacade: WalletFacadeService,
    private walletStoreService: WalletStoreService,
    private tokenStorageService: TokenStorageService
  ) {}
  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getCryptoList();
    this.network.name = 'ETH';
  }

  getCryptoList() {
    this.cryptoList$.subscribe((data: any) => {
      this.cryptobyNetwork = data.filter(
        (element: any) =>
          Number(element.quantity) > 0 &&
          !isNaN(Number(element.quantity)) &&
          element.network === this.cryptoChecked
      );
      if (this.network.name === '') this.network.name = 'ETH';
      let balances = data.filter(
        (element: any) => element.symbol === this.network.name
      );
      if (balances.length > 0) this.network.balance = balances[0]?.quantity;
      if (this.cryptobyNetwork.length === 1) {
        this.arrayToMigrate = this.cryptobyNetwork.slice();
        let gasLimit = this.getGasPrice(this.arrayToMigrate[0]);
        let gasPrice = 10000000000;
        this.gas = Big(gasLimit).times(Big(gasPrice));
        this.gasToDisplay = filterAmount(this.gas.div(10 ** 18).toString());
        if (this.network.name === '') this.network.name = 'ETH';
        let balances = data.filter(
          (element: any) => element.symbol === this.network.name
        );
        if (balances.length > 0) this.network.balance = balances[0]?.quantity;
        if (
          this.network.balance === '' ||
          Big(this.gasToDisplay).gt(Big(this.network.balance))
        )
          this.outOfGas = true;
        else this.outOfGas = false;
      }
    });
  }
  setState(crypto: string) {
    this.outOfGas = false;
    this.hash = '';
    this.arrayToMigrate = [];
    this.gas = Big(0);
    this.cryptoChecked = crypto;
    const index = this.listCrypto.findIndex((e) => e.network === crypto);
    this.getCryptoList();
    this.network.name = this.listCrypto[index]?.name;
    let element = this.cryptobyNetwork.find(
      (e: any) => e.symbol === this.network.name
    );
    crypto === "TRON" && (this.gasToDisplay= "0.0268")
    if (element) this.network.balance = element?.quantity;
    else {
      this.network.balance = '';
      this.outOfGas = true;
    }
  }
  next() {
    this.outOfGas = false;
    this.spinner = true;
    this.hash = '';
    this.service
      .migrateTokens(
        this.arrayToMigrate,
        this.cryptoChecked,
        this.walletPassword
      )
      .subscribe(
        (data: any) => {
          this.arrayToMigrate = [];
          this.spinner = false;
          let network =
            this.cryptoChecked === 'BEP20'
              ? 'https://testnet.bscscan.com/address/'
              : 'https://goerli.etherscan.io/address/';
          this.hash = network + this.walletId;
          this.walletStoreService.getCryptoList();
        },
        (err: any) => {
          err.error.error ===
            'Key derivation failed - possibly wrong password' &&
            (this.errorMessage = true);
          setTimeout(() => {
            this.errorMessage = false;
          }, 3000);
          this.spinner = false;
        }
      );
  }

  addCrypto(element: any) {
    let gasLimit = this.getGasPrice(element);

    let gasPrice = 10000000000;
    const index = this.arrayToMigrate.findIndex(
      (e) => e.symbol === element.symbol
    );
    if (index !== -1) {
      this.gas = this.gas.minus(Big(gasLimit).times(Big(gasPrice)));

      this.arrayToMigrate.splice(index, 1);
    } else {
      this.gas = this.gas.plus(Big(gasLimit).times(Big(gasPrice)));
      this.arrayToMigrate.push(element);
    }
    this.gasToDisplay = filterAmount(this.gas.div(10 ** 18).toString());
    if (
      this.network.balance === '' ||
      Big(this.gasToDisplay).gt(Big(this.network.balance))
    )
      this.outOfGas = true;
    else this.outOfGas = false;
  }
  nextStep() {
    this.arrayToMigrate = [];
    this.hash = '';

    if (this.cryptoChecked === 'TRON') {
      this.walletFacade
        .getAllWallet()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data: any) => {
          this.tokenStorageService.saveWalletVersion('v2');
          this.tokenStorageService.saveIdWallet(data.data.addressV2);
          this.tokenStorageService.saveTronWallet(data.data.tronAddressV2);
          this.tokenStorageService.saveWalletBtc(data.data.btcAddressV2);

          this.walletStoreService.getCryptoList();
          this.walletStoreService.getTotalBalance();
          this.sendMigrationStatus();
        });
    } else {
      const index = this.listCrypto.findIndex((object: any) => {
        return object.network === this.cryptoChecked;
      });
      if (index !== -1) {
        this.network.name = this.listCrypto[index + 1]?.name;
        this.cryptoChecked = this.listCrypto[index + 1].network;
        this.getCryptoList();
      }
    }
  }

  getGasPrice(element: any) {
    return element.network === 'BEP20' ||
      element.symbol === 'ETH' ||
      element.network === 'POLYGON' ||
      element.network === 'BTTC'
      ? 21000
      : element.network === 'ERC20'
      ? 65000
      : 0;
  }
  sendMigrationStatus() {
    this.migrateEvent.emit('close');
  }
  ngOnDestroy() {
    this.onDestroy$.next('');
    this.onDestroy$.complete();
  }
}
