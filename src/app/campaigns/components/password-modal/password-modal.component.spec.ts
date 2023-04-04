import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PasswordModalComponent } from './password-modal.component';
import {ToastrService} from 'ngx-toastr';
import { CapitalizePhrasePipe } from '@shared/pipes/capitalize-phrase.pipe';

describe('PasswordModalComponent', () => {
  let component: PasswordModalComponent;
  let fixture: ComponentFixture<PasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordModalComponent,CapitalizePhrasePipe],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
      providers :[ { provide: ToastrService, useValue: ToastrService },UntypedFormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
