import { TestBed } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Type} from '@angular/core';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let httpMock :HttpTestingController;
  let httpClient:HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers:[TransactionsService]
    });
    service = TestBed.inject(TransactionsService);
    httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
    httpClient=TestBed.inject(HttpClient);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
