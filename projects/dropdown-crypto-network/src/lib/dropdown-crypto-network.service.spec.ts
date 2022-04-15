import { TestBed } from '@angular/core/testing';

import { DropdownCryptoNetworkService } from './dropdown-crypto-network.service';

describe('DropdownCryptoNetworkService', () => {
  let service: DropdownCryptoNetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropdownCryptoNetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
