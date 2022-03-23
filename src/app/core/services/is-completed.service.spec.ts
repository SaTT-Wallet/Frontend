import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IsCompletedService } from './is-completed.service';

describe('IsCompletedService', () => {
  let service: IsCompletedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, HttpClientTestingModule,RouterTestingModule,]
    });
    service = TestBed.inject(IsCompletedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
