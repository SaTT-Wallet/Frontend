import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Type} from '@angular/core';
import {ContactService} from './contact.service';

describe('ContactService', () => {
    let service: ContactService;
    let httpMock:HttpTestingController;
    let httpClient:HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers:[ContactService]
        });
        service = TestBed.inject(ContactService);
        httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
        httpClient=TestBed.inject(HttpClient);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
