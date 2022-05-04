import { CryptoConverterPipe } from './crypto-converter.pipe';
import {CryptoData, ExchangeRateService} from '../services/exchange-rate.service'
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CryptoConverterPipe', () => {

  let pipe: CryptoConverterPipe;


  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule,
          HttpClientTestingModule
        ],
      });

      const dummyCryptoData: CryptoData = {
        data: {
          'BNB': {
            name: 'BNB',
            price: 399.7564537866204,
            percent_change_24h: -1.22927092,
            market_cap: 65271024363.09679,
            volume_24h: 2138948537.9572053,
            circulating_supply: 163276974.63,
            total_supply: 163276974.63,
            max_supply: 165116760,
            logo: ''
          },
          'ETH': {
            name: 'ETH',
            price: 3000,
            percent_change_24h: -1.22927092,
            market_cap: 65271024363.09679,
            volume_24h: 2138948537.9572053,
            circulating_supply: 163276974.63,
            total_supply: 163276974.63,
            max_supply: 165116760,
            logo: ''
          }
        }
      }

      jest.mock('../services/exchange-rate.service');
    
      ExchangeRateService.prototype.cryptoData = dummyCryptoData;

  })
  it('create an instance', inject([ExchangeRateService],(exchangeRateService: ExchangeRateService) => {
    
    pipe = new CryptoConverterPipe(exchangeRateService);
    console.log(exchangeRateService);
    
    expect(pipe).toBeTruthy();
  }));

  it('should convert from crypto to usd', () => {
    let result = pipe.transform(10,'BNB');
    expect(result).toEqual(3997.5645378662)
  })
  
  it('should convert from usd to target crypto currency', () => {
    let result = pipe.transform(100,'USD','BNB')
    expect(result).toEqual(0.2501523091)

    result = pipe.transform(100,'USD','BN')
    expect(result).toEqual(null)
    
  })
  
  it('should convert from crypto currency to target crypto currency', () => {
    let result = pipe.transform(100,'ETH','BNB')
    expect(result).toEqual(750.4569273574)

    result = pipe.transform(100,'ETH','BN')
    expect(result).toEqual(null)
  })


});
