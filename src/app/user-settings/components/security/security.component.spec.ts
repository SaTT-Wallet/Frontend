import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot() ],
      providers :[ { provide: ToastrService, useValue: ToastrService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
