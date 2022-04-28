import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(private service: HttpService) {
    this.service.getPrices().subscribe(console.log)

   }

  private prices$ = this.service.getPrices()

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
