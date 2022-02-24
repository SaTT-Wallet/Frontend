import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizeTelegramAccountComponent } from './monetize-telegram-account.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

describe('MonetizeTelegramAccountComponent', () => {
  let component: MonetizeTelegramAccountComponent;
  let fixture: ComponentFixture<MonetizeTelegramAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonetizeTelegramAccountComponent],
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
    fixture = TestBed.createComponent(MonetizeTelegramAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
