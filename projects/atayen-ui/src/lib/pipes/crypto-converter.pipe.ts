import { Injectable, Pipe, PipeTransform } from '@angular/core';
import {ExchangeRateService} from '../services/exchange-rate.service'

@Pipe({
  name: 'convertTo'
})
export class CryptoConverterPipe implements PipeTransform {

  constructor(private exchangeRateService: ExchangeRateService) {
    this.exchangeRateService.getPrices().subscribe(console.log)
  }
  transform(amount:number,sourceCurrencySymbol:string,targetCurrencySymbol?:string): number | null {
    
    if(!targetCurrencySymbol) {
      return this.exchangeRateService.convertToUSD(amount, sourceCurrencySymbol) as number;
    }
    
    if(sourceCurrencySymbol === 'USD' && targetCurrencySymbol) {
      return this.exchangeRateService.convertFromUSD(amount, targetCurrencySymbol)
    }
      
    if(sourceCurrencySymbol !== 'USD' && targetCurrencySymbol){
      return this.exchangeRateService.convertToCrypto(amount,sourceCurrencySymbol,targetCurrencySymbol)
    }
    
    return null;
  }

}
