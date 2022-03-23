import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  fetchtransactions(address?: any, token?: any) {
    return this.http.get(`${sattUrl}/txs/:address/:token`, {
      headers: this.tokenStorageService.getHeader()
    });
  }
}
