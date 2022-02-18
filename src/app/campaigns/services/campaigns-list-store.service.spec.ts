import { TestBed } from '@angular/core/testing';

import { CampaignsListStoreService } from './campaigns-list-store.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('CampaignsListStoreService', () => {
  let service: CampaignsListStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CampaignsListStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
