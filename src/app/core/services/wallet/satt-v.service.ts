import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { sattUrl } from '@config/atn.config';

@Injectable({
  providedIn: 'root'
})
export class SattVService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}
  url: string = sattUrl + '/api/v1';
  token = this.tokenStorageService.getToken();
  
}
