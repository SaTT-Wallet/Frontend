import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

import { CryptoData, ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  let httpMock: HttpTestingController;

  beforeEach(async() => {
   TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ExchangeRateService
      ]
    })
  
  });

  beforeEach( 
    inject([ExchangeRateService, HttpTestingController], 
      (_service:ExchangeRateService, _httpMock:HttpTestingController) => { 
    service = _service;
    httpMock = _httpMock;
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', (done) => {
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
        }
      }
    }
    
    service.getPrices().subscribe((airports:any) => {
      // console.log(airports)
      expect(airports.data['BNB'].price).toEqual(399.7564537866204)
      done()
    });
    
    const req = httpMock.expectOne(`https://api-preprod2.satt-token.com:3015/wallet/cryptoDetails`);
    
    req.flush(dummyCryptoData);
  });

  it('should return value in usd', (done) => {
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
        }
      }
    }

    service.getPrices().subscribe(() => {
      let result = service.convertToUSD(1,'BNB')
      expect(result).toEqual(399.7564537866)

      result = service.convertToUSD(1,'ETH')
      expect(result).toEqual(null)
      done()
    });
    
    const req = httpMock.expectOne(`https://api-preprod2.satt-token.com:3015/wallet/cryptoDetails`);
    
    req.flush(dummyCryptoData);
  });

  it('should convert from usd to crypto', (done) => {

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
        }
      }
    }

    service.getPrices().subscribe(() => {
      let result = service.convertFromUSD(100,'BNB')
      expect(result).toEqual(0.2501523091)

      result = service.convertFromUSD(100,'DOG')

      expect(result).toEqual(null)


      done()
    });
    
    const req = httpMock.expectOne(`https://api-preprod2.satt-token.com:3015/wallet/cryptoDetails`);
    
    req.flush(dummyCryptoData);
   
  });

  it('should convert the value to target currency', (done) => {

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

    service.getPrices().subscribe(() => {
      let result = service.convertToCrypto(10, 'BNB', 'ETH')
      expect(result).toEqual(1.3325215126)
   
      result = service.convertToCrypto(10, 'ETH', 'BNB')
      expect(result).toEqual(75.0456927357)

       result = service.convertToCrypto(10,'BNB','JOT')
       expect(result).toEqual(null)


      done()
    });
    
    const req = httpMock.expectOne(`https://api-preprod2.satt-token.com:3015/wallet/cryptoDetails`);
    
    req.flush(dummyCryptoData);

   
  });
  
 
});
