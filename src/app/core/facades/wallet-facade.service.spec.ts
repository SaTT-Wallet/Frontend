import { TestBed } from '@angular/core/testing';

import { WalletFacadeService } from './wallet-facade.service';

describe('WalletFacadeService', () => {
  let service: WalletFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
