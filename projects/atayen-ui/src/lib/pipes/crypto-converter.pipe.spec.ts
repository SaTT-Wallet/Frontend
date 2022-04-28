import { CryptoConverterPipe } from './crypto-converter.pipe';
import {ExchangeRateService} from '../services/exchange-rate.service'
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

describe('CryptoConverterPipe', () => {

  let pipe: CryptoConverterPipe;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  })
  it('create an instance', inject([ExchangeRateService],(exchangeRateService: ExchangeRateService) => {
    pipe = new CryptoConverterPipe(exchangeRateService);
    expect(pipe).toBeTruthy();
  }));

  it('should convert from crypto to usd', () => {
    let result = pipe.transform(10, 5);
    expect(result).toEqual(50)
  })
  
  it('should convert from usd to target crypto currency', () => {
    let result = pipe.transform(100,389.43,'BNB')
    expect(result).toEqual(0.2567855584)
  })

  it('should convert from crypto currency to target crypto currency', () => {
    let result = pipe.transform(100,389.43,'BNB')
    expect(result).toEqual(0.2567855584)
  })


});
