import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialConfigComponent } from './social-config.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProfileService } from '@core/services/profile/profile.service';
import {
  DEFAULT_LANGUAGE,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslatePipe,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE
} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { I18nCountrySelectModule } from 'ngx-i18n-country-select';

describe('SocialConfigComponent', () => {
  let component: SocialConfigComponent;
  let fixture: ComponentFixture<SocialConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialConfigComponent],
      imports: [
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
    fixture = TestBed.createComponent(SocialConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
