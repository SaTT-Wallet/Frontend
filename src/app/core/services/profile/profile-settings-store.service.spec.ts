import { TestBed } from '@angular/core/testing';

import { ProfileSettingsStoreService } from './profile-settings-store.service';

describe('ProfileSettingsStoreService', () => {
  let service: ProfileSettingsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileSettingsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
