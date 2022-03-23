import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CampaignsEffects } from './campaign-details.effects';

describe('CampaignsEffects', () => {
  let actions$: Observable<any>;
  let effects: CampaignsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignsEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.inject(CampaignsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
