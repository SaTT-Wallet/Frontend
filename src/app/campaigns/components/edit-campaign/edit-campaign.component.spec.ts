import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TagInputModule } from 'ngx-chips';
import { NgxEditorModule } from 'ngx-editor';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';

import { EditCampaignComponent } from './edit-campaign.component';

describe('CompanyCreationFormComponent', () => {
  let component: EditCampaignComponent;
  let fixture: ComponentFixture<EditCampaignComponent>;
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
    ) => {}
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCampaignComponent, CapitalizePhrasePipe],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        NgMultiSelectDropDownModule,
        NgxEditorModule,
        MatSnackBarModule
      ],
      providers: [{ provide: ToastrService, useValue: toastrService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
