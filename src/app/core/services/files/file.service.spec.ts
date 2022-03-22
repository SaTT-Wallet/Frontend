import { TestBed } from '@angular/core/testing';

import { FilesService } from './files.Service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Type} from '@angular/core';
import {HttpClient} from '@angular/common/http';

describe('FilesService', () => {
    let service: FilesService;
    let httpMock:HttpTestingController;
    let httpClient:HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers:[FilesService]
        });
        service = TestBed.inject(FilesService);
        httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
        httpClient=TestBed.inject(HttpClient);
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
