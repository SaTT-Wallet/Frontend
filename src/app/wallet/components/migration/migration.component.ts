import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';

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
  arrayToMigrate: any[] = [];
  cryptobyNetwork: any;
  cryptoChecked = 'ERC20';
  cryptoList$ = this.walletFacade.cryptoList$;
  passWallet = false;
  showPass: boolean = false;
  walletPassword = '';
  wrongpassword: boolean = false;
  hash = '';
  walletId = localStorage.getItem('wallet_id');
  spinner = false;
  @Input() migrate: any;
  @Output() migrateEvent = new EventEmitter<String>();

  constructor(
    private service: CryptofetchServiceService,
    private walletFacade: WalletFacadeService
  ) {}
  ngOnInit(): void {
    this.getCryptoList();
  }

  getCryptoList() {
    this.cryptoList$.subscribe((data: any) => {
      this.cryptobyNetwork = data.filter(
        (element: any) =>
          Number(element.quantity) > 0 &&
          !isNaN(Number(element.quantity)) &&
          element.network === this.cryptoChecked
      );
    });
  }
  setState(crypto: string) {
    this.arrayToMigrate = [];
    this.cryptoChecked = crypto;
    this.getCryptoList();
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
    const index = this.arrayToMigrate.findIndex(
      (e) => e.symbol === element.symbol
    );
    if (index !== -1) this.arrayToMigrate.splice(index, 1);
    else this.arrayToMigrate.push(element);
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
