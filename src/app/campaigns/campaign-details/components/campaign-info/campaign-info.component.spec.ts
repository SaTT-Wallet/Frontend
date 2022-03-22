import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignInfoComponent } from './campaign-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';

describe('CampaignInfoComponent', () => {
  let component: CampaignInfoComponent;
  let fixture: ComponentFixture<CampaignInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CampaignInfoComponent,
        CapitalizePhrasePipe,
        ConvertFromWei
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        FormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
