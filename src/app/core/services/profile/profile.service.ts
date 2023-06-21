import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { IGetSocialNetworksResponse } from '@app/user-settings/components/social-networks/social-networks.component';
import { Observable } from 'rxjs';
import { IresponseCodeQr } from '@app/core/iresponse-code-qr';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getSocialNetworks() {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<IGetSocialNetworksResponse>(
      sattUrl + '/profile/socialAccounts',
      { headers: httpHeaders }
    );
  }
  // /profile/socialAccounts
  deleteOneSocialNetworksGoogle(id: string) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveGoogleChannel/' + id, {
      headers: header
    });
  }
  deleleteAllSocialNetworksTwitter() {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveTwitterChannels', {
      headers: header
    });
  }
  deleteOneSocialNetworksTwitter(id: string) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveTwitterChannel/' + id, {
      headers: header
    });
  }
  deleleteAllSocialNetworksGoogle() {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveGoogleChannels', {
      headers: header
    });
  }
  deleleteAllSocialNetworksFb() {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveFacebookchannels', {
      headers: header
    });
  }
  deleteOneSocialNetworksFb(id: string) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveFacebookChannel/' + id, {
      headers: header
    });
  }
  deleteAllSocialNetworksLinkedin() {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveLinkedInChannels', {
      headers: header
    });
  }
  deleteOneSocialNetworksLinkedin(organization: string,linkedinId:string) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(
      sattUrl + '/profile/remove/'+ linkedinId+'/linkedInChannel/'+ organization,
      {
        headers: header
      }
    );
  }

  deleteTiktokChannel(tiktokProfileId: string) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(
      sattUrl + '/profile/RemoveTiktokChannel/' + tiktokProfileId,
      {
        headers: header
      }
    );
  }
  deleteAllTiktokChannels() {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.delete(sattUrl + '/profile/RemoveTiktokChannels', {
      headers: header
    });
  }

  updateprofile(body: any) {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.put(sattUrl + '/profile/UpdateProfile', body, {
      headers: httpHeaders
    });
  }
  updateEmail(body: any) {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(sattUrl + '/profile/changeEmail', body, {
      headers: httpHeaders
    });
  }
  confirmChangeEmail(code: any) {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(
      sattUrl + '/profile/confirmChangeEmail',
      {
        code: code
      },
      {
        headers: httpHeaders
      }
    );
  }

  completeprofile(body: any) {
    return this.http.put(sattUrl + '/auth/updateLastStep', body);
  }

  exportProfileData(password: string) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { pass: password };
    return this.http.post(sattUrl + '/wallet/exportETH', body, {
      headers: headers
    });
  }

  exportProfileDataV2(password: string) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { pass: password };
    return this.http.post(sattUrl + '/wallet/exportETHV2', body, {
      headers: headers
    });
  }

  exportTronKeystore(password: string) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { pass: password };
    return this.http.post(sattUrl + '/wallet/exportTron', body, {
      headers: headers
    });
  }


  exportTronKeystoreV2(password: string) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { pass: password };
    return this.http.post(sattUrl + '/wallet/exportTronV2', body, {
      headers: headers
    });
  }

  exportProfileDataBTC(password: string) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { pass: password };
    return this.http.post(sattUrl + '/wallet/exportBtc', body, {
      headers: headers
    });
  }

  exportProfileDataBTCV2(password: string) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { pass: password };
    return this.http.post(sattUrl + '/wallet/exportBtcV2', body, {
      headers: headers
    });
  }

  getTiktokProfilPrivcay() {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    
    return this.http.get(sattUrl + '/profile/Tiktok/ProfilPrivacy', {
      headers: headers
    });
  }


  getUserProfilePic() {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(sattUrl + '/profile/picture', {
      responseType: 'blob',
      headers: headers
    });
  }

  // exportBtc(pass:any){
  //   let headers = new HttpHeaders({
  //     'Cache-Control': 'no-store',
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + this.tokenStorageService.getItem("access_token"),
  //   });
  //   let token=this.tokenStorageService.getToken();
  //   let body={pass:pass}
  //   return this.http.post(sattUrl + "/v3/exportbtc",body , { headers: headers }
  //   );

  // }

  //   exportMnemo(pass:any){
  //   let headers = new HttpHeaders({
  //     'Cache-Control': 'no-store',
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + this.tokenStorageService.getItem("access_token"),
  //   });
  //   let token=this.tokenStorageService.getToken();
  //   return this.http.get(sattUrl + "/v2/printseed/" + token + "/" + encodeURIComponent(pass),{ headers: headers });
  // }

  //   export(pass:any){
  //   let headers = new HttpHeaders({
  //     'Cache-Control': 'no-store',
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + this.tokenStorageService.getItem("access_token"),
  //   });
  //   let token=this.tokenStorageService.getToken();
  //   return this.http.get(sattUrl + "/v2/export/" + encodeURIComponent(pass) + "/" +token ,{ headers: headers });
  // }
  addInterests(body: any) {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      sattUrl + '/profile/AddUserIntersts',
      { interests: body },
      { headers: httpHeaders }
    );
  }
  getInterests() {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get(sattUrl + '/profile/UserIntersts', {
      headers: httpHeaders
    });
  }
  updateInterests(body: any) {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.put(
      sattUrl + '/profile/UpdateUserIntersts',
      { interests: body },
      { headers: httpHeaders }
    );
  }

  logoutRS(social: any) {
    return this.http.put(sattUrl + '/auth/disconnect/' + social, null);
  }

  deleteAccount(obj: any) {
    /*let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });*/
    return this.http.post(sattUrl + '/auth/purge', obj);
  }
  generateQRCode() {
    return this.http.get(sattUrl + '/auth/qrCode');
  }
  verifyQRCode(body: any): Observable<IresponseCodeQr> {
    return this.http.post<IresponseCodeQr>(
      sattUrl + '/auth/verifyQrCode',
      body
    );
  }

  socialStateGoogle(deactivate: any, channelId: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { channelId: channelId, deactivate: deactivate };
    return this.http.post(sattUrl + '/allowYoutube', body, { headers: header });
  }

  socialStateFacebook(deactivate: any, id: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { channelId: id, deactivate: deactivate };
    return this.http.post(sattUrl + '/allowFacebook', body, {
      headers: header
    });
  }

  socialStateTwitter(deactivate: any, twitter_id: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { twitter_id: twitter_id, deactivate: deactivate };
    return this.http.post(sattUrl + '/allowTwitter', body, { headers: header });
  }

  socialStateLinkedin(deactivate: any, organization: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let body = { organization: organization, deactivate: deactivate };
    return this.http.post(sattUrl + '/allowLinkedin', body, {
      headers: header
    });
  }
}
