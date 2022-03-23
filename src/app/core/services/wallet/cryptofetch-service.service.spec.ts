import { TestBed } from '@angular/core/testing';
import { CryptofetchServiceService } from './cryptofetch-service.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Type} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('CryptofetchServiceService', () => {
  let service: CryptofetchServiceService;

  let httpMock:HttpTestingController;
  let httpClient:HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule , RouterTestingModule],
      providers:[CryptofetchServiceService]
    });
    service = TestBed.inject(CryptofetchServiceService);
    httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
    httpClient=TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
