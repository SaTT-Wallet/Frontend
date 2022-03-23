import { TestBed } from '@angular/core/testing';

import { AccountFacadeService } from './account-facade.service';

describe('AccountFacadeService', () => {
  let service: AccountFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
