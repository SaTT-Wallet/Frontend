import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AideCampagneComponent } from './aide-campagne.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import * as $ from "jquery";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
describe('AideCampagneComponent', () => {
  let component: AideCampagneComponent;
  let fixture: ComponentFixture<AideCampagneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AideCampagneComponent ],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot() ,Ng2SearchPipeModule],
    
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AideCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
