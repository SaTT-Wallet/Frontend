import Big from "big.js";

export class CryptoBalance {

    name = '';
    symbol = '';
    balance: string | Big = '0';
    pricePerUnitInUSD = '';
    price: any;
    quantity: any;

    constructor(data?: any) {
        this.name = data?.name || '';
        this.symbol = data?.symbol || '';
        this.balance = isNaN(data?.quantity) ? '0' : new Big(data?.quantity).toString();
        this.pricePerUnitInUSD = isNaN(data?.price) ? '0' : new Big(data?.price).toString();
    }
}
