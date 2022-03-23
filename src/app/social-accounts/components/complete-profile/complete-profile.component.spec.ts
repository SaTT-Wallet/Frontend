import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfileComponent } from './complete-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CompleteProfileComponent', () => {
  let component: CompleteProfileComponent;
  let fixture: ComponentFixture<CompleteProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteProfileComponent],

      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
