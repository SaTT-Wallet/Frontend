import { Pipe, PipeTransform } from '@angular/core';
import {ExchangeRateService} from '../services/exchange-rate.service'
@Pipe({
  name: 'convertTo'
})
export class CryptoConverterPipe implements PipeTransform {

  constructor(private exchangeRateService: ExchangeRateService) {

  }
  transform(amount:number,sourceCryptoPrice:number,targetCurrency: string = 'USD', targetCryptoPrice?:number): number {
    if(!targetCryptoPrice && targetCurrency === 'USD') {
      return this.exchangeRateService.convertToUSD(amount, sourceCryptoPrice)
    }

    if(!targetCryptoPrice && targetCurrency !== 'USD') {
     return this.exchangeRateService.convertFromUSD(amount, sourceCryptoPrice)
    }

    return this.exchangeRateService.convertToCrypto(amount,sourceCryptoPrice,targetCryptoPrice || 0)
  }

}
