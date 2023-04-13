import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpProvider, IpcProvider, WebsocketProvider, AbstractProvider } from 'web3-core';
import { Web3Provider } from '@ethersproject/providers';
import Web3 from 'web3';


@Injectable({
  providedIn: 'root'
})
export class MetaMaskService {
  account!: string;
  window: any
  public isWalletConnected!: boolean;


  public ethereum!: any;


  errorMessage!: string;
  web3: any;
  constructor(private http: HttpClient) {
    this.checkWalletConnected();
    this.connectWallet()
    const { ethereum } = <any>window
    this.ethereum = ethereum
  }


  async connectWallet() {

    try {
      const web3 = new Web3(this.ethereum);
      const currentProvider = web3?.currentProvider as (HttpProvider & { _readableState?: any }) | (IpcProvider & { _readableState?: any }) | (WebsocketProvider & { _readableState?: any }) | (AbstractProvider & { _readableState?: any });

      const isMetaMaskConnected = typeof this.ethereum !== 'undefined' && this.ethereum.isMetaMask;
      if (!isMetaMaskConnected) {
        throw new Error('MetaMask is not connected');
      }
      const provider = currentProvider;
      delete currentProvider?.['_readableState']?.['pipes'];

      if (currentProvider && (currentProvider as any).isMetaMask) {
        await this.ethereum.enable();
        await (currentProvider as unknown as Web3Provider).send("eth_requestAccounts", []);
      }
      this.isWalletConnected = true;
      return provider
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Error connecting to MetaMask';
      return this.errorMessage
    }

  }

  public checkWalletConnected = async () => {

    try {
      if (!this.ethereum) { this.isWalletConnected = false; return alert(" Please install meta mask ") }
      const accounts = await this.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        this.isWalletConnected = false;

      } else this.isWalletConnected = true;
      return accounts;
    }
    catch (e) {
      throw new Error("No ethereum object found");
    }
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {
//   HttpProvider,
//   IpcProvider,
//   WebsocketProvider,
//   AbstractProvider
// } from 'web3-core';
// import { Web3Provider } from '@ethersproject/providers';
// import Web3 from 'web3';
// import { ethers } from 'ethers';

// @Injectable({
//   providedIn: 'root'
// })
// export class MetaMaskService {
//   account!: string;
//   window: any;
//   public ethereum!: any;
//   errorMessage!: string;
//   web3: any;
//   public isWalletConnected: boolean = false; // Added isWalletConnected property

//   constructor(private http: HttpClient) {
//     this.connectWallet();
//     const { ethereum } = <any>window;
//     this.ethereum = ethereum;
//   }

//   // public connectWallet = async () => {
//   //   try {
//   //     await window.ethereum.request({ method: 'eth_requestAccounts' });
//   //     const provider = new ethers.providers.Web3Provider(window.ethereum);
//   //     this.isWalletConnected = true;
//   //     return provider;
//   //   } catch (error) {
//   //     console.error(error);
//   //     this.errorMessage = 'Error connecting to MetaMask';
//   //     return this.errorMessage;
//   //   }
//   // };

//   // public checkWalletConnected = async () => {
//   //   try {
//   //     if (!window.ethereum) {
//   //       return alert(' Please install MetaMask ');
//   //     }
//   //     const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//   //     return accounts;
//   //   } catch (e) {
//   //     throw new Error('No ethereum object found');
//   //   }
//   // };


//   public connectWallet = async () => {
//     try {
//       const web3 = new Web3(this.ethereum);

//       const currentProvider = web3?.currentProvider as
//         | (HttpProvider & { _readableState?: any })
//         | (IpcProvider & { _readableState?: any })
//         | (WebsocketProvider & { _readableState?: any })
//         | (AbstractProvider & { _readableState?: any });

//       const isMetaMaskConnected =
//         typeof this.ethereum !== 'undefined' && this.ethereum.isMetaMask;
//       if (!isMetaMaskConnected) {
//         throw new Error('MetaMask is not connected');
//       }
//       const provider = currentProvider;

//       delete currentProvider?.['_readableState']?.['pipes'];

//       if (currentProvider && (currentProvider as any).isMetaMask) {
//         await this.ethereum.enable();
//         await (currentProvider as unknown as Web3Provider).send(
//           'eth_requestAccounts',
//           []
//         );
//       }
//       this.isWalletConnected = true;
//       return provider;
//     } catch (error) {
//       console.error(error);
//       this.errorMessage = 'Error connecting to MetaMask';
//       return this.errorMessage;
//     }
//   };

//   public checkWalletConnected = async () => {
//     try {
//       if (!this.ethereum) {
//         return alert(' Please install MetaMask ');
//       }
//       const accounts = await this.ethereum.request({ method: 'eth_accounts' });
//       return accounts;
//     } catch (e) {
//       throw new Error('No ethereum object found');
//     }
//   };
// }




// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { HttpProvider, IpcProvider, WebsocketProvider, AbstractProvider } from 'web3-core';
// import { Web3Provider } from '@ethersproject/providers';
// import Web3 from 'web3';

// @Injectable({
//   providedIn: 'root'
// })
// export class MetaMaskService {
//   account!: string;
//   window: any
//   public ethereum!: any;
//   errorMessage!: string;
//   web3: any;

//   constructor(private http: HttpClient) {

//     // this.connect()
//     this.connectWallet()
//     const { ethereum } = <any>window
//     this.ethereum = ethereum
//   }

//   public connectWallet = async () => {

//     try {
//       if (!this.ethereum) return alert(" Please install meta mask");
//       const web3 = new Web3Provider(this.ethereum);
//       const res = JSON.stringify(web3)
//       console.log(res)

//       const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
//     }
//     catch (e) {
//       throw new Error("No ethereum object found")
//     }
//   }

//   public checkWalletConnected = async () => {

//     try {
//       if (!this.ethereum) { return alert(" Please install meta mask ") }
//       const accounts = await this.ethereum.request({ method: 'eth_accounts' });
//       return accounts;
//     }
//     catch (e) {
//       throw new Error("No ethereum object found");
//     }
//   }
// }

// async connect() {

//   try {
//     const web3 = new Web3(this.ethereum);

//     const currentProvider = web3?.currentProvider as (HttpProvider & { _readableState?: any }) | (IpcProvider & { _readableState?: any }) | (WebsocketProvider & { _readableState?: any }) | (AbstractProvider & { _readableState?: any });

//     const isMetaMaskConnected = typeof this.ethereum !== 'undefined' && this.ethereum.isMetaMask;
//     if (!isMetaMaskConnected) {
//       throw new Error('MetaMask is not connected');
//     }
//     const provider = currentProvider;

//     delete currentProvider?.['_readableState']?.['pipes'];

//     if (currentProvider && (currentProvider as any).isMetaMask) {
//       await this.ethereum.enable();
//       await (currentProvider as unknown as Web3Provider).send("eth_requestAccounts", []);
//     }
//     return provider
//   } catch (error) {
//     console.error(error);
//     this.errorMessage = 'Error connecting to MetaMask';
//     return this.errorMessage
//   }

// }

/////////////////////////////////////////////////////////

// async connect() {
//   debugger

//   try {
//     const web3 = new Web3(this.ethereum);

//     const currentProvider = web3?.currentProvider as (HttpProvider & { _readableState?: any }) | (IpcProvider & { _readableState?: any }) | (WebsocketProvider & { _readableState?: any }) | (AbstractProvider & { _readableState?: any });

//     const isMetaMaskConnected = typeof this.ethereum !== 'undefined' && this.ethereum.isMetaMask;
//     if (!isMetaMaskConnected) {
//       throw new Error('MetaMask is not connected');
//     }
//     const provider = currentProvider;

//     delete currentProvider?.['_readableState']?.['pipes'];

//     if (currentProvider && (currentProvider as any).isMetaMask) {
//       await this.ethereum.enable();
//       await (currentProvider as unknown as Web3Provider).send("eth_requestAccounts", []);
//     }
//     return provider
//   } catch (error) {
//     console.error(error);
//     this.errorMessage = 'Error connecting to MetaMask';
//     return this.errorMessage
//   }

// }
