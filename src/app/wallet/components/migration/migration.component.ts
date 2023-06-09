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
import { catchError, map, take, takeUntil,tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { GazConsumed } from '@app/config/atn.config';


@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {

  walletEVM!: string;
  walletBTC!: string;
  walletTRON!: string;
  shortWalletTRON!: string;
  shortWalletBTC!: string;
  shortWalletEVM!: string;

  isWalletAddressCopied: boolean = false;


  listCrypto: any[] = [
    { name: 'ETH', network: 'ERC20', explorer: environment.etherscanaddr },
    { name: 'BNB', network: 'BEP20', explorer: environment.bscanaddr },
    { name: 'BTC', network: 'BTC', explorer: environment.bttscanAddr },
    {
      name: 'MATIC',
      network: 'POLYGON',
      explorer: environment.polygonscanAddr
    },
    { name: 'BTT', network: 'BTTC', explorer: environment.bttscanAddr },
    { name: 'TRX', network: 'TRON', explorer: environment.tronScanAddr }
  ];
  gas = Big(0);
  errorMessage: boolean = false;
  gasToDisplay: any;
  arrayToMigrate: any[] = [];

  migrationTokens: any = [];
  cryptobyNetwork: any;
  cryptoChecked = 'ERC20';
  activatedRoute: ActivatedRoute | null | undefined;
  errorTransaction: boolean = false;
  errorTransactionMessage: string = '';
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
  gasPriceEstimation!:string;

  @Output() migrateEvent = new EventEmitter<String>();
  @Output() newWallet = new EventEmitter<String>();
  etherPrice!: number;
  price!: number;
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
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private clipboard: Clipboard

  ) {}
  ngOnInit(): void {
    this.fetchWallet();
    this.arrayToMigrate = [];
    this.migrationTokens = [];
    this.getScreenWidth = window.innerWidth;
    this.getCryptoList();
    this.network.name = 'ETH';
    this.walletFacade.getEtherGaz().pipe(take(1)).subscribe((gaz: any)=>{
      this.price = gaz.data.gasPrice
     
    })
    
  }

  getInitEstimation(element: any) {
    try {
      const gasLimit = this.getGasPrice(element)
    this.gasPriceEstimation = new Big (this.gasToDisplay || 0.0000).plus((
      ((this.price *(gasLimit)) / 1000000000) 
    )).toFixed(8);
    return this.gasPriceEstimation;
    } catch(err) {
      return 0;
    }
    
  }

  copyAddress(network: string) {
   
    this.isWalletAddressCopied = true;
    if(network === "TRX") {
      this.clipboard.copy(this.walletTRON)
    } else if(network === "BTC") {
      this.clipboard.copy(this.walletBTC)
    } else {
      this.clipboard.copy(this.walletEVM)
    }
    
    setTimeout(() => {
      this.isWalletAddressCopied = false;
    }, 2000)
  }

  errorPictureHandle(event: any)  {
    event.target.src = "assets/Images/symbol_crypto/indispo.svg"
  }

  fetchWallet() {
    this.walletFacade.getAllWallet().subscribe((res:any) => {
      this.walletEVM = res.data.address;
      this.walletBTC = res.data.btcAddress;
      this.walletTRON = res.data.tronAddress
      this.shortWalletEVM = res.data.address.slice(0,8) + "..." + res.data.address.slice(-8)
      this.shortWalletTRON = res.data.tronAddress.slice(0,8) + "..." + res.data.address.slice(-8)
      this.shortWalletBTC = res.data.btcAddress.slice(0,8) + "..." + res.data.address.slice(-8)
      
    })
  }
  getCryptoList() {
    this.cryptoList$.subscribe((data: any) => {
             this.etherPrice = data.find((element:any) => element.name ==="Ethereum")['price']

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
        this.gasToDisplay =  filterAmount(this.gas.div(10 ** 18).toString());
        this.cryptoChecked === 'TRON' && (this.gasToDisplay = '0.0268');
        //if (this.network.name === '') this.network.name = 'ETH';
     
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
    
    this.errorTransaction = false;
    this.migrationTokens = [];
    this.outOfGas = false;
    this.hash = '';
    this.arrayToMigrate = [];
    this.gas = Big(0);
    this.cryptoChecked = crypto;
    const index = this.listCrypto.findIndex((e) => e.network === crypto);
    this.network.name = this.listCrypto[index]?.name;
    this.walletPassword=""
    this.getCryptoList();
    
  }


  goToBuy(id: any, network: any, cryptobyNetwork:any) {
    this.sendMigrationStatus()

    if( network === "BTTC"){
      window.open('https://sunswap.com/#/v2?lang=en-US&t0=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&t1=TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4&type=swap', '_blank');
    
   } else {
    if (network === 'ERC20') {
      id = 'ETH';
    }
    if ( network === 'BEP20') {
      id = 'BNB';
    }
    if ( network === 'TRON') {
      id = 'TRX';
    }
    this.router.navigate(['/wallet/buy-token'], {
      queryParams: { id: id, network: network },
      relativeTo: this.activatedRoute
    });
  }
  }

  displayErrorMessage(data:any) {
    
    if(data[0].includes("insufficient funds for gas")) {
      this.errorTransactionMessage = data[0].replace("Returned error:", "");
      this.outOfGas = true; 
      this.spinner = false;
    } else this.errorTransactionMessage = "Something went wrong please try again"
    this.errorTransaction= true;
    this.walletPassword = "";
    this.spinner = false;
  }

  next() {
    this.outOfGas = false;
    this.spinner = true;
    this.hash = '';
    this.errorTransaction = false;
    this.service
      .migrateTokens(
        this.arrayToMigrate,
        this.cryptoChecked,
        this.walletPassword
      )
      .subscribe(
        (data: any) => {
            if(data.name === "JsonWebTokenError") {
              this.expiredSession() 
            } else {
              if(data.data.errorTransaction.length > 0) {
                if(data.data.transactionHash.length > 0) {
                  this.displaySuccessMessage(data.data.transactionHash)
                  this.displayErrorMessage(data.data.errorTransaction)
                } else {
                  this.displayErrorMessage(data.data.errorTransaction)
                }
              }  else {
                
                if(this.network.name === 'TRX') {
                  setTimeout(() => {
                    this.displaySuccessMessage(data.data.transactionHash);
                  }, 70000)
                } else this.displaySuccessMessage(data.data.transactionHash)
                
              }
            }
          
            

        },
        (err: any) => {
          
          if
          (err.error.error ===
            'Key derivation failed - possibly wrong password' || err.error.error === "Invalid private key provided") {
              this.errorMessage = true;
              this.walletPassword = "";
            }
            
          setTimeout(() => {
            this.errorMessage = false;
          }, 3000);
          this.spinner = false;
        }
      );
  }

  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }

  addCrypto(element: any) {
   
    let elementNative= this.cryptobyNetwork.find(
      (e: any) =>e.symbol === this.network.name
    );
    
    if (elementNative) {
      // this.outOfGas = false;
      this.network.balance = element?.quantity;
    } else {
      this.network.balance = '';
      this.outOfGas = true;
    }
    let gasLimit = this.getGasPrice(element);
    let gasPrice = 10000000000;
    
    const index = this.arrayToMigrate.findIndex(
      (e) => e.symbol === element.symbol
    );
    if (index !== -1) {
      this.gas = this.gas.minus(Big(gasLimit).times(Big(gasPrice)));

      this.arrayToMigrate.splice(index, 1);
      if(element.network ==='ERC20'){
        this.gasToDisplay = new Big (this.gasToDisplay).minus((
          ((this.price *(gasLimit )) / 1000000000) 
        )).toFixed(8);
    }
    } else {
      this.gas = this.gas.plus(Big(gasLimit).times(Big(gasPrice)));
      this.arrayToMigrate.push(element);
      if(element.network ==='ERC20'){
          this.gasToDisplay = new Big (this.gasToDisplay || 0.0000).plus((
            ((this.price *(gasLimit)) / 1000000000) 
          )).toFixed(8);
      }
    }
    if(element.network !=='ERC20')
    this.gasToDisplay = filterAmount(this.gas.div(10 ** 18).toString());
   
  }
  nextStep() {
    this.arrayToMigrate = [];
    this.hash = '';
    this.walletPassword="";
    this.errorTransaction = false;
    if (this.cryptoChecked === 'TRON') {
      this.walletFacade.verifyUserToken().subscribe((res:any) => {
        if(res.message === "success") {
          this.sendMigrationStatus()
          this.newWallet.emit("new-wallet")
        } else this.expiredSession();
      })
        
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

  displaySuccessMessage(data: any) {
    this.arrayToMigrate = [];
    this.spinner = false;
    const index = this.listCrypto.findIndex(
      (e) => e.network === this.cryptoChecked
    );
    let network = this.listCrypto[index].explorer;
    this.hash = network + data[0].from;
    this.walletStoreService.getCryptoList();
    this.walletStoreService.getTotalBalance();
  }
}
