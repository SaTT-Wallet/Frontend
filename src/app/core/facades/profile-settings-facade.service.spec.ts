import { TestBed } from '@angular/core/testing';

import { ProfileSettingsFacadeService } from './profile-settings-facade.service';

describe('ProfileSettingsFacadeService', () => {
  let service: ProfileSettingsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileSettingsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
