import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ActivationMailComponent } from './activation-mail.component';

describe('ActivationMailComponent', () => {
  let component: ActivationMailComponent;
  let fixture: ComponentFixture<ActivationMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivationMailComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
