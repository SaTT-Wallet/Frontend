import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordWalletValidationComponent } from './password-wallet-validation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

describe('PasswordWalletValidationComponent', () => {
  let component: PasswordWalletValidationComponent;
  let fixture: ComponentFixture<PasswordWalletValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordWalletValidationComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordWalletValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
