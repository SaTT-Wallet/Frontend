import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { IresponseAccount } from '@app/core/iresponse-account';
import { IresponseCode } from '@app/core/iresponse-code-qr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  setIsAuthenticated(isAuth: boolean) {
    this.isAuthenticatedSubject.next(isAuth);
  }

  resetPassword(email: any): Observable<any> {
    return this.http.post(
      sattUrl +
        '/auth/passlost'
      ,
      { mail: email ,
      lang:  this.tokenStorageService.getLocalLang()},
      { headers: this.tokenStorageService.getHeader() }
    );
  }
  
  confirmCode(email: any, code: any, type: any): Observable<IresponseCode> {
    return this.http.post<IresponseCode>(
      sattUrl + '/auth/confirmCode',
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
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      sattUrl + '/auth/signin/mail',
      {
        username: username,
        password: password
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  register(
    email: any,
    password: any,
    newsLetter: any
    //*** */
  ): Observable<any> {
    return this.http.post(
      sattUrl + '/auth/signup/mail',
      {
        username: email,
        password: password,
        newsLetter: newsLetter,
        lang: this.tokenStorageService.getLocalLang()
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
    return this.http.get<IresponseAccount>(sattUrl + '/profile/account', {
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
    return this.http.post(sattUrl + '/auth/resend/confirmationToken', {
      email: email,
      lang: this.tokenStorageService.getLocalLang()
    });
  }
  onBoarding() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(sattUrl + '/onBoarding', { headers: httpHeaders });
  }
  // checkPass(pass: any) {
  //   let httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Cache-Control': 'no-store',
  //     Authorization: 'Bearer ' + this.tokenStorageService.getToken()
  //   });
  //   return this.http.post(sattUrl + '/check/pass', pass, {
  //     headers: httpHeaders
  //   });
  // }
  imagespuzzle() {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(sattUrl + '/auth/captcha', {
      headers: httpHeaders
    });
  }

  verifyimagespuzzle(send: any) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(sattUrl + '/auth/verifyCaptcha', send, {
      headers: httpHeaders
    });
  }

  canActivate() {
    if (!this.tokenStorageService.getIsAuth()) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}
