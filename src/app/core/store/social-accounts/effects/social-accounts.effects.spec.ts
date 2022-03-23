import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SocialAccountsEffects } from './social-accounts.effects';

describe('SocialAccountsEffects', () => {
  let actions$: Observable<any>;
  let effects: SocialAccountsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialAccountsEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.inject(SocialAccountsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
