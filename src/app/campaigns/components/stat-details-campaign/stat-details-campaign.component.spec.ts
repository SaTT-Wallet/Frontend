import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatDetailsCampaignComponent } from './stat-details-campaign.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('StatDetailsCampaignComponent', () => {
  let component: StatDetailsCampaignComponent;
  let fixture: ComponentFixture<StatDetailsCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatDetailsCampaignComponent ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatDetailsCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
