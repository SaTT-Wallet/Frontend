import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from './http.service';

export interface CryptoData {
  data: {
    [key:string]: {
      name: string,
      price: number,
      percent_change_24h: number,
      market_cap: number,
      volume_24h: number,
      circulating_supply: number,
      total_supply: number,
      max_supply: number,
      logo: string;
    }
  } 
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  // private prices$ = this.service.getPrices()
  public cryptoData!: CryptoData;
  private baseUrl = 'https://api-preprod2.satt-token.com:3015'
  constructor(private service: HttpService,private http:HttpClient) {
  //  this.getPrices().subscribe()
  }

  getPrices():Observable<CryptoData>{
    return this.service.getPrices()
      .pipe(
        tap((_cryptoData) => this.cryptoData = _cryptoData)
      )
  }

  convertToUSD(amount:number, symbol: string){
  if(this.cryptoData.data[symbol]) {
    return Number((amount * this.cryptoData?.data[symbol].price).toFixed(10))
  }
  return null
    
  }

  convertFromUSD(amount:number, symbol: string){
    if(this.cryptoData?.data[symbol]) {
      return Number((amount / this.cryptoData?.data[symbol].price).toFixed(10)) 
    }
    return null;
  }

  convertToCrypto(amount:number,sourceCryptoSymbol:string,targetCryptoSymbol:string){
    const sourceCryptoPrice = this.cryptoData.data[sourceCryptoSymbol]?.price
    const targetCryptoPrice = this.cryptoData.data[targetCryptoSymbol]?.price
    if(sourceCryptoPrice && targetCryptoPrice){

      const value = (sourceCryptoPrice / targetCryptoPrice) * amount
      return Number(value.toFixed(10))
    }

    return null
  }
}
