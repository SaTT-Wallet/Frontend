import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsHistoryComponent } from './transactions-history.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateLoader, TranslateModule,
  TranslateParser,
  TranslateService,
  TranslateStore, USE_DEFAULT_LANG
} from '@ngx-translate/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

describe('TransactionsHistoryComponent', () => {
  let component: TransactionsHistoryComponent;
  let fixture: ComponentFixture<TransactionsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsHistoryComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot(), NgxPaginationModule ],
      providers: [UntypedFormBuilder]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
