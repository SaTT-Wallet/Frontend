import { TestBed } from '@angular/core/testing';

import { LocalStorageRefService } from './local-storage-ref-service.service';

describe('LocalStorageRefService', () => {
  let service: LocalStorageRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageRefService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
