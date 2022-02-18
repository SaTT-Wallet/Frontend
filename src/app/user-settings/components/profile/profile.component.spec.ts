import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {
  DEFAULT_LANGUAGE,
  MissingTranslationHandler,
  TranslateCompiler, TranslateFakeLoader,
  TranslateLoader, TranslateModule,
  TranslateParser,
  TranslateService,
  TranslateStore, USE_DEFAULT_LANG, USE_EXTEND, USE_STORE
} from '@ngx-translate/core';

describe('ProfilComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
