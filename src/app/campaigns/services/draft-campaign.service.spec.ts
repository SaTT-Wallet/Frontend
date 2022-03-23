import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DraftCampaignService } from './draft-campaign.service';

describe('DraftCampaignService', () => {
  let service: DraftCampaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,RouterTestingModule],
      providers: [DraftCampaignService],
      
    });
    service = TestBed.inject(DraftCampaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
