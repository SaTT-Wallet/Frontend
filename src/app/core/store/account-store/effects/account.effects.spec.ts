import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { AccountEffects } from './account.effects';

describe('AccountEffects', () => {
  let actions$: Observable<any>;
  let effects: AccountEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.inject(AccountEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
