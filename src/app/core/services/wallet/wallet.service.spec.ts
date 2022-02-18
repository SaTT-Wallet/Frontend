import { TestBed } from '@angular/core/testing';
import { WalletService } from './wallet.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Type} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('WalletService', () => {
  let service: WalletService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,RouterTestingModule ],
      providers:[WalletService]
    });
    service = TestBed.inject(WalletService);
    httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
    httpClient=TestBed.inject(HttpClient);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
