import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTokenComponent } from './add-token.component';
import {RouterTestingModule} from "@angular/router/testing";
import {RouterModule} from "@angular/router";
import {WalletService} from "@core/services/wallet/wallet.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('AddTokenComponent', () => {
  let component: AddTokenComponent;
  let fixture: ComponentFixture<AddTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTokenComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })],
      providers: [WalletService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
