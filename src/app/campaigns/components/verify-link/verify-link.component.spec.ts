import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';

import { VerifyLinkComponent } from './verify-link.component';

describe('VerifyLinkComponent', () => {
  let component: VerifyLinkComponent;
  let fixture: ComponentFixture<VerifyLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyLinkComponent,TranslatePipe,CapitalizePhrasePipe],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
