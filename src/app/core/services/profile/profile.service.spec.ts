import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Type} from '@angular/core';
import {HttpClient} from '@angular/common/http';

describe('ProfileService', () => {
    let service: ProfileService;
    let httpMock:HttpTestingController;
    let httpClient:HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers:[ProfileService]
        });
        service = TestBed.inject(ProfileService);
        httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
        httpClient=TestBed.inject(HttpClient);
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
