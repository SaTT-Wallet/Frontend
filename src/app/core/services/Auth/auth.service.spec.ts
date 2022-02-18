import { TestBed } from '@angular/core/testing';
import { HttpClient } from "@angular/common/http";
import { AuthService } from './auth.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
describe('AuthService', () => {
  let service: AuthService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers:[AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
    httpClient=TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
