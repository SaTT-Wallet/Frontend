import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { DraftCampaignKitComponent } from './draft-campaign-kit.component';

describe('DraftCampaignKitComponent', () => {
  let component: DraftCampaignKitComponent;
  let fixture: ComponentFixture<DraftCampaignKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftCampaignKitComponent],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
      providers :[ { provide: ToastrService, useValue: ToastrService }  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftCampaignKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
