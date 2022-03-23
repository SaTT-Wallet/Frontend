import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassWalletComponent } from './pass-wallet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

describe('PassWalletComponent', () => {
  let component: PassWalletComponent;
  let fixture: ComponentFixture<PassWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassWalletComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
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
    fixture = TestBed.createComponent(PassWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
