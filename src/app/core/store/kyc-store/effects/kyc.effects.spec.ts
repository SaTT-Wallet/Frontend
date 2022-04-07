import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { KycEffects } from './kyc.effects';

describe('KycEffects', () => {
  let actions$: Observable<any>;
  let effects: KycEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KycEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.inject(KycEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
