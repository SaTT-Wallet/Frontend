import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class SattvService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  convertsattV(address: any, pass: any) {
    let token = this.tokenStorageService.getToken();

    return this.http.post(sattUrl + '/bonus', {
      address: address,
      pass: pass,
      access_token: token
    });
  }
}
