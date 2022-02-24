import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DraftCampaignStoreService } from './draft-campaign-store.service';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormatDataService } from '@app/campaigns/services/format-data.service';
import { CampaignsStoreService } from '@app/campaigns/services/campaigns-store.service';

describe('DraftCampaignStoreService', () => {
  let service: DraftCampaignStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        CampaignHttpApiService,
        CampaignsStoreService,
        DomSanitizer,
        FormatDataService
      ]
    });
    service = TestBed.inject(DraftCampaignStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
