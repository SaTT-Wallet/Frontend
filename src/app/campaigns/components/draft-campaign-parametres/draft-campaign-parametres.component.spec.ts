import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DraftCampaignService } from '@app/campaigns/services/draft-campaign.service';
import { TranslateModule } from '@ngx-translate/core';

import { DraftCampaignParametresComponent } from './draft-campaign-parametres.component';

describe('DraftCampaignParametresComponent', () => {
  let component: DraftCampaignParametresComponent;
  let fixture: ComponentFixture<DraftCampaignParametresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraftCampaignParametresComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [DraftCampaignService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftCampaignParametresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
