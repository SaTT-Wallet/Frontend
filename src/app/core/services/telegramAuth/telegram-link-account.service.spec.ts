import { TestBed } from '@angular/core/testing';

import { TelegramLinkAccountService } from './telegram-link-account.service';

describe('TelegramLinkAccountService', () => {
  let service: TelegramLinkAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelegramLinkAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
