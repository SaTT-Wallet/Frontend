import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaLinkAccountComponent } from './social-media-link-account.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('SocialMediaLinkAccountComponent', () => {
  let component: SocialMediaLinkAccountComponent;
  let fixture: ComponentFixture<SocialMediaLinkAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaLinkAccountComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot() ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaLinkAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
