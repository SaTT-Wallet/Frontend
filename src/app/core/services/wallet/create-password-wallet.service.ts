import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sattUrl } from '@app/config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class CreatePasswordWalletService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}
  createPasswordWallet(pass: string): Observable<any> {
    return this.http.post(
      sattUrl + '/wallet/create/v2',
      {
        pass: pass
      }
    );
  }
  getPassPhrase() {
    return this.http.get(sattUrl + '/wallet/getMnemo');
  }

  checkPassPhraseOrdered(mnemo: string): Observable<any> {
    return this.http.post(
      sattUrl + '/wallet/verifyMnemo',
      { mnemo }
     
    );
  }
}
