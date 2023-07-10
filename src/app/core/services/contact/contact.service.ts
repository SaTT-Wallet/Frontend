import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(
    private http: HttpClient,
  ) {}

  

  supportSaTT(MailContent: any) {
    return this.http.post(sattUrl + '/profile/SaTTSupport', MailContent);
  }
}
