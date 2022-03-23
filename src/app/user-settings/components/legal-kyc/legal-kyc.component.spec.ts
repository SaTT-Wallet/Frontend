import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalKYCComponent } from './legal-kyc.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('LegalKYCComponent', () => {
  let component: LegalKYCComponent;
  let fixture: ComponentFixture<LegalKYCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalKYCComponent ],
      imports: [HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalKYCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
