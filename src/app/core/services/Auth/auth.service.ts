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
  ) {
    if (this.tokenStorageService.getToken()) {
      this.setIsAuthenticated(true);
    }
  }

  setIsAuthenticated(isAuth: boolean) {
    this.isAuthenticatedSubject.next(isAuth);
  }

  resetPassword(email: any): Observable<any> {
    return this.http.post(
      sattUrl + '/auth/passlost',
      { mail: email, lang: this.tokenStorageService.getLocalLang() },
    );
  }

  confirmCode(email: any, code: any, type: any): Observable<IresponseCode> {
    return this.http.post<IresponseCode>(
      sattUrl + '/auth/confirmCode',
      { email: email, code: code, type: type },
    );
  }
  confirmResetPassword(data: any) {
    return this.http.post(`${sattUrl}/auth/passrecover`, data);
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      sattUrl + '/auth/signin/mail',
      {
        username: username,
        password: password
      }
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
      }
    );
  }

  verifyAccount(): Observable<IresponseAccount> {
    return this.http.get<IresponseAccount>(sattUrl + '/profile/account');
  }

  updatePassword(oldpass: any, newpass: any) {
    return this.http.post(
      sattUrl + '/auth/changePassword',
      {
        oldpass: oldpass,
        newpass: newpass
      }
    );
  }

  sendConfirmationMail(email: string) {
    return this.http.post(sattUrl + '/auth/resend/confirmationToken', {
      email: email,
      lang: this.tokenStorageService.getLocalLang()
    });
  }
  
  onBoarding() {
    return this.http.get(sattUrl + '/profile/onBoarding');
  }
 
  imagespuzzle() {
    return this.http.get(sattUrl + '/auth/captcha');
  }

  verifyimagespuzzle(send: any) {
    return this.http.post(sattUrl + '/auth/verifyCaptcha', send);
  }

  canActivate() {
    if (!this.tokenStorageService.getIsAuth()) {
      return true;
    }
    
    this.router.navigate(['']);
    return false;
  }

  setVisitSignUpStep(body: { userId: string; visitedStep: string }) {
    return this.http.post(sattUrl + '/auth/setVisitSignUpStep', body);
  }
}
