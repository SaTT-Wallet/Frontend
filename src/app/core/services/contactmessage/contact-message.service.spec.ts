import { TestBed } from '@angular/core/testing';
import { ContactMessageService } from './contact-message.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Type} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('ContactMessageService', () => {
  let service: ContactMessageService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,RouterTestingModule ],
      providers:[ContactMessageService]
    });
    service = TestBed.inject(ContactMessageService);
    httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
    httpClient=TestBed.inject(HttpClient);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
