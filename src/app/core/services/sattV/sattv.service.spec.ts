import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SattvService } from './sattv.service';

describe('SattvService', () => {
  let service: SattvService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot() ],
      
    })
    .compileComponents();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({});
  //  service = TestBed.inject(SattvService);
  });
  
  it('should be created', () => {
    expect(SattvService).toBeTruthy();
  });
});
