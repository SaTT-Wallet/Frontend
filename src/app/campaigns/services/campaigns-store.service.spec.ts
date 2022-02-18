import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {Type} from '@angular/core';

import { CampaignsStoreService } from './campaigns-store.service';
import {RouterTestingModule} from "@angular/router/testing";

describe('CampaignsStoreService', () => {
  let service: CampaignsStoreService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers:[CampaignsStoreService]
      
    });
    service = TestBed.inject(CampaignsStoreService);
    httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
    httpClient=TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
