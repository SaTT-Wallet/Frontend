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
    });
  }
  uploadProofID(content: File) {
    let type = 'proofId';
    let file = new FormData();
    file.append('file', content);
    file.append('type', type);
    file.append('typeProof', this.typeProof);
    return this.http.post(sattUrl + '/profile/add/Legalprofile', file, {
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadProofDomicile(content: File) {
    let type = 'proofDomicile';
    let file = new FormData();
    file.append('file', content);
    file.append('type', type);
    file.append('typeProof', this.typeProof);
    return this.http.post(sattUrl + '/profile/add/Legalprofile', file, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getUserLegalPic(fileId: any) {
    return this.http.get(sattUrl + `/profile/legalUserUpload/${fileId}`, {
      responseType: 'blob'
    });
  }
  getListUserLegal() {
    return this.http.get(sattUrl + '/profile/UserLegal');
  }
}
