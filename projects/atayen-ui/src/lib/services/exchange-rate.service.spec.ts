import { TestBed } from '@angular/core/testing';

import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return value in usd', () => {

   const result = service.convertToUSD(50,397.08)
   expect(result).toEqual(19854)
  });

  it('should convert from usd to crypto', () => {

   const result = service.convertFromUSD(100,392.0884402439951)
   expect(result).toEqual(0.2550444995)
  });

  it('should convert the value to target currency', () => {
   let result = service.convertToCrypto(10, 2953.837573145851, 39925.98163987281)
   expect(result).toEqual(0.73982841544)
   
   result = service.convertToCrypto(10,395.5785409966289,2953.837573145851)
    expect(result).toEqual(1.33920207595)

   result = service.convertToCrypto(10,98.69987331652021,0.6680541454125344)
    expect(result).toEqual(1477.4232596906)
  });
  
 
});
