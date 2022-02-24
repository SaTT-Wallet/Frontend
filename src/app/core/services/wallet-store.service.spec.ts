import { TestBed } from '@angular/core/testing';

import { WalletStoreService } from './wallet-store.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('WalletStoreService', () => {
  let service: WalletStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, HttpClientTestingModule,RouterTestingModule ],
    });
    service = TestBed.inject(WalletStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
