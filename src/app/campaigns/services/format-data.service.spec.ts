import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FormatDataService } from './format-data.service';

describe('FormatDataService', () => {
  let service: FormatDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
    });
    service = TestBed.inject(FormatDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
