import { Injectable, Injector } from '@angular/core';
import { AuthService } from '@core/services/Auth/auth.service';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { Observable } from 'rxjs';
// import ts from 'typescript/lib/tsserverlibrary';
// import convertTypeAcquisition = ts.server.convertTypeAcquisition;
@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {
  // authentication service attribute
  private _authService?: AuthService;
  // authentication store service attribute
  private _authStoreService?: AuthStoreService;

  public get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }

  public get authStoreService(): AuthStoreService {
    if (!this._authStoreService) {
      this._authStoreService = this.injector.get(AuthStoreService);
    }
    return this._authStoreService;
  }

  constructor(private injector: Injector) {}
  resetPassword(email: any): Observable<any> {
    return this.authService.resetPassword(email);
  }
  confirmCode(email: any, code: any, type: any): Observable<any> {
    return this.authService.confirmCode(email, code, type);
  }

  confirmResetPassword(data: any) {
    return this.authService.confirmResetPassword(data);
  }
  login(username: string, password: string): Observable<any> {
    return this.authService.login(username, password);
  }

  register(email: any, password: any, newsLetter: any): Observable<any> {
    return this.authService.register(email, password, newsLetter);
  }

  verifyAccount() {
    return this.authService.verifyAccount();
  }

  updatePassword(oldpass: any, newpass: any) {
    return this.authService.updatePassword(oldpass, newpass);
  }

  sendConfirmationMail(email: string) {
    return this.authService.sendConfirmationMail(email);
  }
  onBoarding() {
    return this.authService.onBoarding();
  }

  getImagePuzzle() {
    return this.authService.imagespuzzle();
  }

  verifyimagespuzzle(send: any) {
    return this.authService.verifyimagespuzzle(send);
  }
}
