import { Injectable } from '@angular/core';
import { FilesService } from '@app/core/services/files/files.Service';
import {
  loadKyc,
  loadKycLogout,
  loadUpdatedKyc
} from '@app/core/store/kyc-store/actions/kyc.actions';
import { KycState } from '@app/core/store/kyc-store/reducers/kyc.reducer';
import { selectKyc } from '@app/core/store/kyc-store/selectors/kyc.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class KycFacadeService {
  constructor(
    private store: Store<KycState>,
    private fileService: FilesService
  ) {}
  initKyc() {
    this.dispatchKyc();
  }
  public get kyc$() {
    return this.store.select(selectKyc);
  }
  dispatchLogoutKyc() {
    this.store.dispatch(loadKycLogout());
  }
  dispatchKyc() {
    this.store.dispatch(loadKyc());
  }
  dispatchUpdatedKyc() {
    this.store.dispatch(loadUpdatedKyc());
  }
  uploadPic(content: File) {
    return this.fileService.uploadPic(content);
  }
  uploadProofID(content: File) {
    return this.fileService.uploadProofID(content);
  }
  uploadProofDomicile(content: File) {
    return this.fileService.uploadProofDomicile(content);
  }

  getUserLegalPic(fileId: any) {
    return this.fileService.getUserLegalPic(fileId);
  }
  getListUserLegal() {
    return this.fileService.getListUserLegal();
  }
}
