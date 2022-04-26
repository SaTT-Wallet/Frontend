import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor() { }

  convertToUSD(amount:number, price:number ){
    return amount * price 
  }

  
}
