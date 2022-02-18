import { TestBed } from '@angular/core/testing';
import { SattVService } from './satt-v.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Type} from '@angular/core';


describe('SattVService', () => {
  let service: SattVService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers:[SattVService]
    });
    // service = TestBed.inject(SattVService);
    httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
    httpClient=TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(SattVService).toBeTruthy();
  });
});
