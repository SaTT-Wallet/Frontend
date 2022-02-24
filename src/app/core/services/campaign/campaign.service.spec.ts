import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Type} from '@angular/core';
import { CampaignHttpApiService } from './campaign.service';
import { RouterTestingModule } from '@angular/router/testing';
import {TokenStorageService} from "@core/services/tokenStorage/token-storage-service.service";

describe('CampaignService', () => {
    let service: CampaignHttpApiService;
    let httpMock:HttpTestingController;
    let httpClient:HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule,RouterTestingModule ],
        });
        service = TestBed.inject(CampaignHttpApiService);
        httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
        httpClient=TestBed.inject(HttpClient);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
