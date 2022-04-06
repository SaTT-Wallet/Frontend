import { TestBed } from '@angular/core/testing';

import { KycFacadeService } from './kyc-facade.service';

describe('KycFacadeService', () => {
  let service: KycFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
