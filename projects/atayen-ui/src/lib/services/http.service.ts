import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptoData } from './exchange-rate.service';

@Injectable({providedIn: 'root'})
export class HttpService {
    constructor(private http:HttpClient) { }


    private baseUrl = 'https://api-preprod2.satt-token.com:3015'

    getPrices(): Observable<CryptoData>{
        return this.http.get<CryptoData>(`${this.baseUrl}/wallet/cryptoDetails`)
    }
    
}