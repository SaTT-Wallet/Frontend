import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getAllContacts() {
    return this.http.get(sattUrl + '/satt/contacts', {
      headers: this.tokenStorageService.getHeader()
    });
  }

  supportSaTT(MailContent: any) {
    return this.http.post(sattUrl + '/SaTT/Support', MailContent, {
      headers: this.tokenStorageService.getHeader()
    });
  }
}
