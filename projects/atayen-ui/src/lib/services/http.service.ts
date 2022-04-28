import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HttpService {
    constructor(private http:HttpClient) { }


    private baseUrl = 'https://api-preprod2.satt-token.com:3015'

    getPrices(){
        return this.http.get(`${this.baseUrl}/wallet/cryptoDetails`)
    }
    
}