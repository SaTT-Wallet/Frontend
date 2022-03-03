import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { IresponseAccount } from '@app/core/iresponse-account';
import { IresponseAuth } from '@app/core/iresponse-auth';
import { IresponseCode } from '@app/core/iresponse-code-qr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  resetPassword(email: any): Observable<any> {
    return this.http.post(
      sattUrl +
        '/v2/auth/passlost?lang=' +
        this.tokenStorageService.getLocalLang(),
      { mail: email },
      { headers: this.tokenStorageService.getHeader() }
    );
  }
  confirmCode(email: any, code: any, type: any): Observable<IresponseCode> {
    return this.http.post<IresponseCode>(
      sattUrl + '/confirmCode',
      { email: email, code: code, type: type },
      {}
    );
  }
  resetPasswordWithCode(email: any, newpass: any) {
    return this.http.post(
      sattUrl + '/v2/auth/passrecover',
      {
        email: email,
        newpass: newpass
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }
  confirmResetPassword(data: any) {
    return this.http.post(`${sattUrl}/auth/passrecover`, data, {
      headers: this.tokenStorageService.getHeader()
    });
  }
  login(
    username: string,
    password: string,
    noredirect: string
  ): Observable<IresponseAuth> {
    return this.http.post<IresponseAuth>(
      sattUrl + '/auth/email',
      {
        username: username,
        password: password,
        noredirect: noredirect
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  register(
    email: any,
    password: any,
    password_confirmation: any,
    noredirect: any,
    newsLetter: any
    //*** */
  ): Observable<any> {
    return this.http.post(
      sattUrl +
        '/v2/auth/signup?lang=' +
        this.tokenStorageService.getLocalLang(),
      {
        username: email,
        password: password,
        newsLetter: newsLetter
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  verifyAccount(): Observable<IresponseAccount> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<IresponseAccount>(sattUrl + '/auth/account', {
      headers: httpHeaders
    });
  }

  updatePassword(oldpass: any, newpass: any, id: any) {
    return this.http.post(
      sattUrl + '/auth/passchange',
      {
        oldpass: oldpass,
        newpass: newpass,
        id: id
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  sendConfirmationMail(email: string) {
    return this.http.post(
      sattUrl + '/v2/resend-confirmation-token/' + email,
      email
    );
  }
  onBoarding() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(sattUrl + '/onBoarding', { headers: httpHeaders });
  }

  checkPass(pass: any) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(sattUrl + '/check/pass', pass, {
      headers: httpHeaders
    });
  }
  imagespuzzle() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get('https://api.satt-token.com:3014/captcha', {
      headers: httpHeaders
    });
  }

  verifyimagespuzzle(send: any) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(
      'https://api.satt-token.com:3014/verifyCaptcha',
      send,
      {
        headers: httpHeaders
      }
    );
  }

  canActivate() {
    if (!this.tokenStorageService.getIsAuth()) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}
