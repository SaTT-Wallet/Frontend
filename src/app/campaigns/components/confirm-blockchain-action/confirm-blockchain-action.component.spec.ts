import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBlockchainActionComponent } from './confirm-blockchain-action.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BlockchainActionsService} from "@core/services/blockchain-actions.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CapitalizePhrasePipe} from "@shared/pipes/capitalize-phrase.pipe";

describe('ConfirmBlockchainActionComponent', () => {
  let component: ConfirmBlockchainActionComponent;
  let fixture: ComponentFixture<ConfirmBlockchainActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmBlockchainActionComponent , CapitalizePhrasePipe],
      imports: [HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })],
      providers: [BlockchainActionsService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBlockchainActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
