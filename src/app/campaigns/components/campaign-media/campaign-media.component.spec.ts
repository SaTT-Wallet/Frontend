import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignMediaComponent } from './campaign-media.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('CampaignMediaComponent', () => {
  let component: CampaignMediaComponent;
  let fixture: ComponentFixture<CampaignMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignMediaComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
