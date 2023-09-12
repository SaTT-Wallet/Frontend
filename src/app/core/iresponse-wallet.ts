export interface IResponseWallet {
  code: number;
  data: {
    address: string;
    bnb_balance: string;
    btc_balance: number;
    ether_balance: string;
    satt_balance: string;
    tronAddress: string;
    version: number;
    err: string;
    totalBalance: string;
  };
  message?: string;
  error?: string;
}
