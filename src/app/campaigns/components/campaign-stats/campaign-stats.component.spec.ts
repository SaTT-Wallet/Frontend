import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignStatsComponent } from './campaign-stats.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';

describe('CampaignStatsComponent', () => {
  let component: CampaignStatsComponent;
  let fixture: ComponentFixture<CampaignStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignStatsComponent,CapitalizePhrasePipe,ConvertFromWei],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
