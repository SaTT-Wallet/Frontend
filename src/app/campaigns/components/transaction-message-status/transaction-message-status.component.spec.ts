import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMessageStatusComponent } from './transaction-message-status.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CapitalizePhrasePipe} from "@shared/pipes/capitalize-phrase.pipe";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('TransactionMessageStatusComponent', () => {
  let component: TransactionMessageStatusComponent;
  let fixture: ComponentFixture<TransactionMessageStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionMessageStatusComponent, CapitalizePhrasePipe ],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMessageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
