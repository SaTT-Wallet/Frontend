import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { filterAmount } from '@app/helpers/utils/common';
import Big from 'big.js';

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
  hash = '';
  walletId = localStorage.getItem('wallet_id');
  spinner = false;
  outOfGas = false;
  @Input() migrate: any;
  @Output() migrateEvent = new EventEmitter<String>();

  constructor(
    private service: CryptofetchServiceService,
    private walletFacade: WalletFacadeService
  ) {}
  ngOnInit(): void {
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

      let balances = data.filter(
        (element: any) => element.symbol === this.network.name
      );
      this.network.balance = balances[0]?.quantity;
    });
  }
  setState(crypto: string) {
    this.arrayToMigrate = [];
    this.gas = Big(0);
    this.cryptoChecked = crypto;
    const index = this.listCrypto.findIndex((e) => e.network === crypto);
    this.getCryptoList();
    this.network.name = this.listCrypto[index]?.name;
    let element = this.cryptobyNetwork.find(
      (e: any) => e.symbol === this.network.name
    );
    this.network.balance = element?.quantity;
  }
  next() {
    this.spinner = true;
    this.service
      .migrateTokens(
        this.arrayToMigrate,
        this.cryptoChecked,
        this.walletPassword
      )
      .subscribe(
        (data: any) => {
          console.log({ data });

          this.arrayToMigrate = [];
          this.spinner = false;
          let network =
            this.cryptoChecked === 'BEP20'
              ? 'https://testnet.bscscan.com/address/'
              : 'https://goerli.etherscan.io/address/';
          this.hash = network + this.walletId;
        },
        (err: any) => {
          console.log({ err });

          this.spinner = false;
        }
      );
  }

  addCrypto(element: any) {
    let gasLimit =
      element.network === 'BEP20' ||
      element.symbol === 'ETH' ||
      element.network === 'POLYGON' ||
      element.network === 'BTTC'
        ? 21000
        : element.network === 'ERC20'
        ? 65000
        : 0;
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

    if (Big(this.gasToDisplay).gt(Big(this.network.balance)))
      this.outOfGas = true;
    else this.outOfGas = false;
  }
  nextStep() {
    this.arrayToMigrate = [];
    this.hash = '';
    const index = this.listCrypto.findIndex((object: any) => {
      return object.network === this.cryptoChecked;
    });
    if (index < this.listCrypto.length - 1) {
      this.cryptoChecked = this.listCrypto[index + 1].network;
      this.getCryptoList();
    }
  }

  sendMigrationStatus() {
    this.migrateEvent.emit('close');
  }
}
