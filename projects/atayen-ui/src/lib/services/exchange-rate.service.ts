import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor() { }

  convertToUSD(amount:number, price:number ){
    return amount * price 
  }

  convertFromUSD(amount:number, price:number){
    return Number((amount / price).toFixed(10)) 
  }

  convertToCrypto(amount:number,sourceCryptoPrice:number,targetCryptoPrice:number){
    const value = (sourceCryptoPrice / targetCryptoPrice) * amount
    return Number(value.toFixed(11))
  }
}
