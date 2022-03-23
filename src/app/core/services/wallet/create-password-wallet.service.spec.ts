import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Type} from '@angular/core';
import {CreatePasswordWalletService} from './create-password-wallet.service';

describe('CreatePasswordWalletService', () => {
    let service: CreatePasswordWalletService;

    let httpMock:HttpTestingController;
    let httpClient:HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers:[CreatePasswordWalletService]
        });
        service = TestBed.inject(CreatePasswordWalletService);
        httpMock =TestBed.get(HttpTestingController as Type<HttpTestingController>);
        httpClient=TestBed.inject(HttpClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
