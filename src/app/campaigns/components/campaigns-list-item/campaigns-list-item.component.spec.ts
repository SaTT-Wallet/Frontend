import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsListItemComponent } from './campaigns-list-item.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore
} from "@ngx-translate/core";
import {IndividualConfig, ToastrService} from "ngx-toastr";

describe('CampaignsListItemComponent', () => {
  let component: CampaignsListItemComponent;
  let fixture: ComponentFixture<CampaignsListItemComponent>;
  const toastrService = {
    success: (
        message?: string,
        title?: string,
        override?: Partial<IndividualConfig>
    ) => {},
    error: (
        message?: string,
        title?: string,
        override?: Partial<IndividualConfig>
    ) => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsListItemComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })
      ],
      providers: [TranslateService, TranslateStore, { provide: ToastrService, useValue: toastrService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
