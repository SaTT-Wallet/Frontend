import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DraftCampaignService } from '@app/campaigns/services/draft-campaign.service';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';

import { RemunerationComponent } from './remuneration.component';

describe('RemunerationComponent', () => {
  let component: RemunerationComponent;
  let fixture: ComponentFixture<RemunerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemunerationComponent, CapitalizePhrasePipe],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [DraftCampaignService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemunerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
