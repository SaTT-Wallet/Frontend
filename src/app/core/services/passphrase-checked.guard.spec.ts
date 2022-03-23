import { TestBed } from '@angular/core/testing';

import { PassphraseCheckedGuard } from './passphrase-checked.guard';

describe('PassphraseCheckedGuard', () => {
  let guard: PassphraseCheckedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PassphraseCheckedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
