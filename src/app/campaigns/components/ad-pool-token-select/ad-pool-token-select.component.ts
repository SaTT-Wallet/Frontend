import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { WalletStoreService } from '@app/core/services/wallet-store.service';
import { CryptofetchServiceService } from '@app/core/services/wallet/cryptofetch-service.service';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ethers } from 'ethers';
@Component({
  selector: 'app-ad-pool-token-select',
  templateUrl: './ad-pool-token-select.component.html',
  styleUrls: ['./ad-pool-token-select.component.scss']
})
export class AdPoolTokenSelectComponent implements OnInit {
  constructor(private Fetchservice: CryptofetchServiceService) {}
  ngOnInit(): void {
    this.Fetchservice.getBalanceCrypto().subscribe((res: any) => {
      console.log(res, 'balance');
    });
  }

  //     this.provider
  //       .getBlockNumber()
  //       .then((res) => console.log({ res }, 'block number'));
  //   }

  //   ngOnInit(): void {
  //     this.Fetchservice.getBalanceCrypto().subscribe((res: any) => {
  //       console.log(res, 'balance');
  //     });
  //   tokenContractAddress = '0x2170ed0880ac9a755fd29b2688956bd959f933f8';
  //   userWalletAddress = '0x699d38aabbee88f9e948bbf5f78705503f13149c';
  //   tokenOwnerAddress = this.userWalletAddress;

  //   contractAbi = [
  //     {
  //       inputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'constructor'
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: 'address',
  //           name: 'owner',
  //           type: 'address'
  //         },
  //         {
  //           indexed: true,
  //           internalType: 'address',
  //           name: 'spender',
  //           type: 'address'
  //         },
  //         {
  //           indexed: false,
  //           internalType: 'uint256',
  //           name: 'value',
  //           type: 'uint256'
  //         }
  //       ],
  //       name: 'Approval',
  //       type: 'event'
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: 'address',
  //           name: 'previousOwner',
  //           type: 'address'
  //         },
  //         {
  //           indexed: true,
  //           internalType: 'address',
  //           name: 'newOwner',
  //           type: 'address'
  //         }
  //       ],
  //       name: 'OwnershipTransferred',
  //       type: 'event'
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: 'address',
  //           name: 'from',
  //           type: 'address'
  //         },
  //         { indexed: true, internalType: 'address', name: 'to', type: 'address' },
  //         {
  //           indexed: false,
  //           internalType: 'uint256',
  //           name: 'value',
  //           type: 'uint256'
  //         }
  //       ],
  //       name: 'Transfer',
  //       type: 'event'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: '_decimals',
  //       outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: '_name',
  //       outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: '_symbol',
  //       outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [
  //         { internalType: 'address', name: 'owner', type: 'address' },
  //         { internalType: 'address', name: 'spender', type: 'address' }
  //       ],
  //       name: 'allowance',
  //       outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { internalType: 'address', name: 'spender', type: 'address' },
  //         { internalType: 'uint256', name: 'amount', type: 'uint256' }
  //       ],
  //       name: 'approve',
  //       outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
  //       name: 'balanceOf',
  //       outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
  //       name: 'burn',
  //       outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'decimals',
  //       outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { internalType: 'address', name: 'spender', type: 'address' },
  //         { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' }
  //       ],
  //       name: 'decreaseAllowance',
  //       outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'getOwner',
  //       outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { internalType: 'address', name: 'spender', type: 'address' },
  //         { internalType: 'uint256', name: 'addedValue', type: 'uint256' }
  //       ],
  //       name: 'increaseAllowance',
  //       outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
  //       name: 'mint',
  //       outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'name',
  //       outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'owner',
  //       outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [],
  //       name: 'renounceOwnership',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'symbol',
  //       outputs: [{ internalType: 'string', name: '', type: 'string' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'totalSupply',
  //       outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { internalType: 'address', name: 'recipient', type: 'address' },
  //         { internalType: 'uint256', name: 'amount', type: 'uint256' }
  //       ],
  //       name: 'transfer',
  //       outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { internalType: 'address', name: 'sender', type: 'address' },
  //         { internalType: 'address', name: 'recipient', type: 'address' },
  //         { internalType: 'uint256', name: 'amount', type: 'uint256' }
  //       ],
  //       name: 'transferFrom',
  //       outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     },
  //     {
  //       constant: false,
  //       inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
  //       name: 'transferOwnership',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function'
  //     }
  //   ];

  //   providerUrl = 'https://bsc-testnet.publicnode.com';
  //   provider = new ethers.JsonRpcProvider(this.providerUrl, {
  //     name: 'bsc',
  //     chainId: 97
  //   });

  //   tokenContract = new ethers.Contract(
  //     this.tokenContractAddress,
  //     this.contractAbi,
  //     this.provider
  //   );

  //   getTokenBalance = async () => {
  //     try {
  //       const balance = await this.tokenContract.balanceOf(
  //         this.userWalletAddress
  //       );
  //       console.log({ balance }, 'baaalance');

  //       const balanceReadable = ethers.formatUnits(balance, 18);
  //       console.log('token balance: ', balanceReadable);
  //       return balanceReadable;
  //     } catch (error) {
  //       console.error('Error fetching token balance:', error);
  //       return 'Error fetching token balance';
  //     }
  //   };

  //   tokenSearch = new FormControl('');
  //   // @Input() selectedToken: any = [];
  //   @Input() closeModal: boolean = false;
  //   @Output() tokenSelected = new EventEmitter<any>();
  //   cryptoList: any = [];
  //   filterList: any = [];
  //   userCrypto: any = [];
  //   isDestroyed$ = new Subject<any>();
  //   tokenNotFound: boolean = false;
  //   showWarning: boolean = true;
  //   showSearchNewTokenContainer: boolean = false;
  //   @Input() selectedNetworkValue!: string;
  //   tokenList: any = [];

  //   reset(e: any) {
  //     e.target.value = '';
  //     this.filterList = this.cryptoList;
  //     this.showSearchNewTokenContainer = false;
  //     this.showWarning = true;
  //     this.tokenNotFound = false;
  //   }
  //   searchToken(e: any) {
  //     this.filterList = [];

  //     if (e.target.value.length > 0) {
  //       this.cryptoList.forEach((crypto: any) => {
  //         if (
  //           crypto.value.name
  //             .toString()
  //             .toLowerCase()
  //             .includes(e.target.value.toLowerCase()) // crypto.symbol.includes(e.target.value)
  //         )
  //           this.filterList.push(crypto);
  //         console.log(this.filterList), 'filterList';
  //       });
  //       if (this.filterList.length === 0) this.tokenNotFound = true;
  //       else this.tokenNotFound = false;
  //     } else this.filterList = this.cryptoList;
  //   }

  //   searchPersonalizedToken() {
  //     this.showSearchNewTokenContainer = !this.showSearchNewTokenContainer;
  //     this.showWarning = false;
  //   }

  //   tokenToSelect(crypto: any) {
  //     this.getTokenBalance();
  //     this.tokenSelected.emit(crypto.value);

  //     this.closeModal = true;
  //   }

  //   constructor(
  //     private walletFacade: WalletFacadeService,
  //     private Fetchservice: CryptofetchServiceService
  //   ) {
  //     this.provider
  //       .getBlockNumber()
  //       .then((res) => console.log({ res }, 'block number'));
  //   }

  //   ngOnInit(): void {
  //     this.Fetchservice.getBalanceCrypto().subscribe((res: any) => {
  //       console.log(res, 'balance');
  //     });

  //     this.walletFacade.getCryptoPriceList().subscribe((res: any) => {
  //       console.log({ data: res.data }, 'data wallet facade');
  //       const result = Object.keys(res.data);
  //       result.forEach((key) => {
  //         let arr = res?.data[key]?.networkSupported || [];
  //         if (!res.data[key].network) {
  //           arr.forEach((data: any) => {
  //             data.platform?.name
  //               .toUpperCase()
  //               .includes(this.selectedNetworkValue) &&
  //               !this.cryptoList.find(
  //                 (e: any) => e.name === res.data[key].name
  //               ) &&
  //               this.cryptoList.push({ key: key, value: res.data[key] });
  //           });
  //         } else {
  //           res.data[key].network === this.selectedNetworkValue &&
  //             this.cryptoList.push(res.data[key]);
  //         }
  //       });
  //       this.filterList = this.cryptoList;
  //       console.log(this.filterList, 'filter listtt');
  //     });

  //     // this.walletFacade
  //     // .getCryptoPriceList()
  //     // .pipe(filter((crypto) => crypto.network === this.selectedNetworkValue))
  //     // .subscribe((res: any) => {
  //     //   console.log(res);
  //     //   // res.data.map((crypto: any) => {
  //     //   //   if (crypto.network === this.selectedNetworkValue)
  //     //   //     this.cryptoList.push(crypto);
  //     //   // });

  //     //   console.log(this.cryptoList, 'cryptoList');
  //     // });
  //     this.getUserCrypto();

  //     // this.walletFacade
  //     //   .getAllWallet()
  //     //   // .pipe(filter((crypto) => crypto.network === this.selectedNetworkValue))
  //     //   .subscribe((res) => {
  //     //     console.log(res, 'futur token List');
  //     //   });
  //   }

  //   getUserCrypto() {
  //     this.walletFacade.cryptoList$
  //       .pipe(takeUntil(this.isDestroyed$))
  //       .subscribe((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.userCrypto = data;
  //         console.log(this.userCrypto, 'userCrypto');
  //       });
  //   }

  //   // addToken() {
  //   //   this.isSubmited = true;
  //   //   this.isLodingBtn = true;
  //   //   this.formToken.enable({ onlySelf: true, emitEvent: false });
  //   //   this.walletFacade
  //   //     .addToken(
  //   //       this.token,
  //   //       this.formToken.get('symbol')?.value.toUpperCase(),
  //   //       this.formToken.get('decimal')?.value,
  //   //       this.formToken.get('tokenAdress')?.value,
  //   //       this.formToken.get('network')?.value.toUpperCase()
  //   //     )
  //   //     .subscribe(
  //   //       (response: any) => {
  //   //         if (response !== undefined) {
  //   //           this.formToken.reset('', { onlySelf: true, emitEvent: false });
  //   //           this.disabled = false;
  //   //           this.isLodingBtn = false;
  //   //           this.isSubmited = false;
  //   //           this.showAddBtn = false;
  //   //           this.formToken.reset('', { onlySelf: true, emitEvent: false });
  //   //           this.errorMsg = '';
  //   //           this.successMsg = 'addToken.token-added-successfully';
  //   //           this.walletStoreService.getCryptoList();
  //   //           this.router.navigate(['/home']);
  //   //         }
  //   //       },
  //   //       (error: any) => {
  //   //         if (
  //   //           (error.error = 'token already added') ||
  //   //           (error.error = 'not a token address')
  //   //         ) {
  //   //           this.errorMsg = 'addToken.token-already-added';
  //   //           this.successMsg = '';
  //   //           this.disabled = false;

  //   //           this.showAddBtn = false;
  //   //           this.isLodingBtn = false;
  //   //           // this.formToken.enable({ onlySelf: true, emitEvent: false });
  //   //           //
  //   //           // this.formToken.reset({ onlySelf: true, emitEvent: false });

  //   //           // this.formToken
  //   //           //
  //   //           //   .get('network')
  //   //           //
  //   //           //   ?.setValue(this.selectedBlockchain, { onlySelf: true });
  //   //         }
  //   //       }
  //   //     )d etre en ;
  //   // }
  //   // importToken(token: any) {
  //   //   this.listToken[
  //   //     this.listToken.map((res) => res.symbol).indexOf(token.symbol)
  //   //   ].isLoading = true;
  //   //   this.isLodingBtn = true;
  //   //   this.walletFacade
  //   //     .addToken(
  //   //       token.name,
  //   //       token.symbol,
  //   //       token.decimals,
  //   //       token.tokenAddress,
  //   //       token.network
  //   //     )
  //   //     .subscribe(
  //   //       (response: any) => {
  //   //         this.isLodingBtn = true;

  //   //         if (response !== undefined) {
  //   //           this.search = '';
  //   //           this.listToken[
  //   //             this.listToken.map((res) => res.symbol).indexOf(token.symbol)
  //   //           ].isLoading = false;
  //   //           this.walletStoreService.getCryptoList();
  //   //         }
  //   //       },

  //   //       (error: any) => {
  //   //         this.isLodingBtn = true;
  //   //         this.listToken[
  //   //           this.listToken.map((res) => res.symbol).indexOf(token.symbol)
  //   //         ].isLoading = false;
  //   //         if (
  //   //           (error.error = 'token already added') ||
  //   //           (error.error = 'not a token address')
  //   //         ) {
  //   //           this.errorAddTokenMsg = 'addToken.token-already-added';
  //   //           setTimeout(() => {
  //   //             this.errorAddTokenMsg = '';
  //   //           }, 3000);
  //   //         }
  //   //       }
  //   //     );
  //   // }
  // }
}
