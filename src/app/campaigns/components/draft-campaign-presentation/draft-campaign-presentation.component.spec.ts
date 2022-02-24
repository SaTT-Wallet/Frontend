import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DraftCampaignService } from '@app/campaigns/services/draft-campaign.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { DraftCampaignPresentationComponent } from './draft-campaign-presentation.component';

describe('DraftCampaignPresentationComponent', () => {
  let component: DraftCampaignPresentationComponent;
  let fixture: ComponentFixture<DraftCampaignPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraftCampaignPresentationComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        DraftCampaignService,
        { provide: ToastrService, useValue: ToastrService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftCampaignPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
