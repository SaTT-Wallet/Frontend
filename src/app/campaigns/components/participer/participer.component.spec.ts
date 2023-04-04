import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticiperComponent } from './participer.component';
import {UntypedFormBuilder} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('ParticiperComponent', () => {
  let component: ParticiperComponent;
  let fixture: ComponentFixture<ParticiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticiperComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
      providers: [UntypedFormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
