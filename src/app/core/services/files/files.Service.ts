import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  typeProof = '';
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  uploadPic(content: File) {
    let formData = new FormData();
    formData.append('file', content);

    return this.http.post(sattUrl + '/profile/picture', formData, {
      reportProgress: true,
      observe: 'events',
      headers: {
        Authorization: 'Bearer ' + this.tokenStorageService.getToken(),
        'Cache-Control': 'no-store'
      }
    });
  }
  uploadProofID(content: File) {
    let userId = this.tokenStorageService.getIdUser();
    let type = 'proofId';
    let file = new FormData();
    file.append('file', content);
    file.append('type', type);
    file.append('typeProof', this.typeProof);
    return this.http.post(sattUrl + '/profile/userLegal', file, {
      reportProgress: true,
      observe: 'events',
      headers: {
        Authorization: 'Bearer ' + this.tokenStorageService.getToken(),
        'ATN-Node': '0' + userId
      }
    });
  }
  uploadProofDomicile(content: File) {
    let userId = this.tokenStorageService.getIdUser();
    let type = 'proofDomicile';
    let file = new FormData();
    file.append('file', content);
    file.append('type', type);
    file.append('typeProof', this.typeProof);
    return this.http.post(sattUrl + '/profile/userLegal', file, {
      reportProgress: true,
      observe: 'events',
      headers: {
        Authorization: 'Bearer ' + this.tokenStorageService.getToken(),
        'ATN-Node': '0' + userId
      }
    });
  }

  getUserLegalPic(fileId: any) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(sattUrl + `/profile/userLegal/${fileId}`, {
      responseType: 'blob',
      headers: headers
    });
  }
  getListUserLegal() {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(sattUrl + '/profile/userLegal', { headers: headers });
  }
}
