import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizeTwitterAccountComponent } from './monetize-twitter-account.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

describe('MonetizeTwitterAccountComponent', () => {
  let component: MonetizeTwitterAccountComponent;
  let fixture: ComponentFixture<MonetizeTwitterAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonetizeTwitterAccountComponent],
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
    fixture = TestBed.createComponent(MonetizeTwitterAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
