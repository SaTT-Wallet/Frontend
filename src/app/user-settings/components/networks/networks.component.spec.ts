import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworksComponent } from './networks.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import { UntypedFormBuilder } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

describe('NetworksComponent', () => {
  let component: NetworksComponent;
  let fixture: ComponentFixture<NetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworksComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot() ],
      providers :[ { provide: ToastrService, useValue: ToastrService },UntypedFormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
