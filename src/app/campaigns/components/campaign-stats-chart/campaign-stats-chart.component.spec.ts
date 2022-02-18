import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignStatsChartComponent } from './campaign-stats-chart.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';

describe('CampaignStatsChartComponent', () => {
  let component: CampaignStatsChartComponent;
  let fixture: ComponentFixture<CampaignStatsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignStatsChartComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignStatsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
