import { TestBed } from '@angular/core/testing';

import { CampaignsDashboardService } from './campaigns-dashboard.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('CampaignsDashboardService', () => {
  let service: CampaignsDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CampaignsDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
