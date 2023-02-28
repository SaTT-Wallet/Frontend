import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';
import { ConvertToWeiPipe } from '@shared/pipes/convert-to-wei.pipe';

import { CampaignDetailComponent } from './campaign-detail.component';

describe('CampaignInfoComponent', () => {
  let component: CampaignDetailComponent;
  let fixture: ComponentFixture<CampaignDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CampaignDetailComponent,
        CapitalizePhrasePipe,
        TranslatePipe
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
