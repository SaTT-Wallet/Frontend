import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDetailsContainerComponent } from './campaign-details-container.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CampaignsStoreService } from '@app/campaigns/services/campaigns-store.service';

describe('CampaignDetailsContainerComponent', () => {
  let component: CampaignDetailsContainerComponent;
  let fixture: ComponentFixture<CampaignDetailsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignDetailsContainerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [CampaignsStoreService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
