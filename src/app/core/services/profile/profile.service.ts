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
    return this.http.get<IGetSocialNetworksResponse>(
      sattUrl + '/profile/socialAccounts'
    );
  }
  // /profile/socialAccounts
  deleteOneSocialNetworksGoogle(id: string) {
    return this.http.delete(sattUrl + '/profile/RemoveGoogleChannel/' + id);
  }
  deleleteAllSocialNetworksTwitter() {
    return this.http.delete(sattUrl + '/profile/RemoveTwitterChannels');
  }
  deleteOneSocialNetworksTwitter(id: string) {
    return this.http.delete(sattUrl + '/profile/RemoveTwitterChannel/' + id);
  }
  deleleteAllSocialNetworksGoogle() {
    return this.http.delete(sattUrl + '/profile/RemoveGoogleChannels');
  }
  deleleteAllSocialNetworksFb() {
    return this.http.delete(sattUrl + '/profile/RemoveFacebookchannels');
  }
  deleteOneSocialNetworksFb(id: string) {
    return this.http.delete(sattUrl + '/profile/RemoveFacebookChannel/' + id);
  }
  deleteAllSocialNetworksLinkedin() {
    return this.http.delete(sattUrl + '/profile/RemoveLinkedInChannels');
  }
  deleteOneSocialNetworksLinkedin(organization: string,linkedinId:string) {
    return this.http.delete(
      sattUrl + '/profile/remove/'+ linkedinId+'/linkedInChannel/'+ organization
      
    );
  }

  deleteTiktokChannel(tiktokProfileId: string) {
    return this.http.delete(
      sattUrl + '/profile/RemoveTiktokChannel/' + tiktokProfileId
      
    );
  }
  deleteAllTiktokChannels() {
    return this.http.delete(sattUrl + '/profile/RemoveTiktokChannels');
  }

  updateprofile(body: any) {
    return this.http.put(sattUrl + '/profile/UpdateProfile', body);
  }
  updateEmail(body: any) {
    return this.http.post(sattUrl + '/profile/changeEmail', body);
  }
  confirmChangeEmail(code: any) {
    return this.http.post(
      sattUrl + '/profile/confirmChangeEmail',
      {
        code: code
      }
    );
  }

  completeprofile(body: any) {
    return this.http.put(sattUrl + '/auth/updateLastStep', body);
  }


  getTiktokProfilPrivcay() {
    return this.http.get(sattUrl + '/profile/Tiktok/ProfilPrivacy');
  }


  getUserProfilePic() {
    return this.http.get(sattUrl + '/profile/picture', {
      responseType: 'blob',
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
    return this.http.post(
      sattUrl + '/profile/AddUserIntersts',
      { interests: body }
    );
  }
  getInterests() {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get(sattUrl + '/profile/UserIntersts');
  }
  updateInterests(body: any) {
    return this.http.put(
      sattUrl + '/profile/UpdateUserIntersts',
      { interests: body }
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
