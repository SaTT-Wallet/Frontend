import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';
import { ConvertToWeiPipe } from '@shared/pipes/convert-to-wei.pipe';
import { ConvertFromWei } from '@shared/pipes/wei-to-sa-tt.pipe';

import { CampaignDetailGainsComponent } from './campaign-detail-gains.component';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

describe('CampaignDetailGainsComponent', () => {
  let component: CampaignDetailGainsComponent;
  let fixture: ComponentFixture<CampaignDetailGainsComponent>;
  const toastrService = {
    success: (
      message?: string,
      title?: string,
      override?: Partial<IndividualConfig>
    ) => {},
    error: (
      message?: string,
      title?: string,
      override?: Partial<IndividualConfig>
    ) => {}
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CampaignDetailGainsComponent,
        ConvertToWeiPipe,
        ConvertFromWei
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        ConvertToWeiPipe,
        ConvertFromWei,
        { provide: ToastrService, useValue: toastrService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDetailGainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
