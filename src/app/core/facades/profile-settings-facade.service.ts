import { Injectable, Injector } from '@angular/core';
import { FilesService } from '@core/services/files/files.Service';
import { ProfileService } from '@core/services/profile/profile.service';
import { TelegramLinkAccountService } from '@core/services/telegramAuth/telegram-link-account.service';
import { ProfileSettingsStoreService } from '@core/services/profile/profile-settings-store.service';
import { Store } from '@ngrx/store';
import {
  clearProfilePicStore,
  loadProfilePics
} from '@user-settings/store/actions/profile-pic.actions';
import { selectProfilePic } from '@user-settings/store/selectors/profile-pic.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsFacadeService {
  constructor(
    private injector: Injector,
    private store: Store<ProfileSettingsFacadeService>
  ) {}

  // file service attribute
  private _fileService?: FilesService;
  public get fileService(): FilesService {
    if (!this._fileService) {
      this._fileService = this.injector.get(FilesService);
    }
    return this._fileService;
  }

  // profile service attribute
  private _profileService?: ProfileService;
  public get profileService(): ProfileService {
    if (!this._profileService) {
      this._profileService = this.injector.get(ProfileService);
    }
    return this._profileService;
  }

  // profile settings store  service attribute

  private _profileSettingsStoreService?: ProfileSettingsStoreService;
  public get profileSettingsStoreService(): ProfileSettingsStoreService {
    if (!this._profileSettingsStoreService) {
      this._profileSettingsStoreService = this.injector.get(
        ProfileSettingsStoreService
      );
    }
    return this._profileSettingsStoreService;
  }

  // telegramLinkAccount  service attribute

  private _telegramLinkAccountService?: TelegramLinkAccountService;
  public get telegramLinkAccountService(): TelegramLinkAccountService {
    if (!this._telegramLinkAccountService) {
      this._telegramLinkAccountService = this.injector.get(
        TelegramLinkAccountService
      );
    }
    return this._telegramLinkAccountService;
  }

  // profile pic state
  get profilePic$() {
    return this.store.select(selectProfilePic);
    /*
    return this.profileSettingsStoreService.profilePic$;
*/
  }

  // profile service functions

  getSocialNetworks() {
    return this.profileService.getSocialNetworks();
  }

  deleteOneSocialNetworksGoogle(id: string) {
    return this.profileService.deleteOneSocialNetworksGoogle(id);
  }

  deleteAllSocialNetworksTwitter() {
    return this.profileService.deleleteAllSocialNetworksTwitter();
  }

  deleteOneSocialNetworksTwitter(id: string) {
    return this.profileService.deleteOneSocialNetworksTwitter(id);
  }

  deleteAllSocialNetworksGoogle() {
    return this.profileService.deleleteAllSocialNetworksGoogle();
  }
  deleteAllSocialNetworksFb() {
    return this.profileService.deleleteAllSocialNetworksFb();
  }
  deleteOneSocialNetworksFb(id: string) {
    return this.profileService.deleteOneSocialNetworksFb(id);
  }
  deleteAllSocialNetworksLinkedin() {
    return this.profileService.deleteAllSocialNetworksLinkedin();
  }
  deleteOneSocialNetworksLinkedin(organization: string,linkedinId: string) {
    return this.profileService.deleteOneSocialNetworksLinkedin(organization,linkedinId);
  }
  updateProfile(body: any) {
    return this.profileService.updateprofile(body);
  }
  updateEmail(body: any) {
    return this.profileService.updateEmail(body);
  }
  confirmChangeEmail(code: any) {
    return this.profileService.confirmChangeEmail(code);
  }

  completeProfile(body: any) {
    return this.profileService.completeprofile(body);
  }

  getUserProfilePic() {
    return this.profileSettingsStoreService.getProfilePic();
  }

  loadUserProfilePic() {
    /*
    this.profileSettingsStoreService.loadProfilePic();
*/
    this.store.dispatch(loadProfilePics());
  }

  addInterests(body: any) {
    return this.profileService.addInterests(body);
  }
  getInterests() {
    return this.profileService.getInterests();
  }
  updateInterests(body: any) {
    return this.profileService.updateInterests(body);
  }

  logoutRS(social: any) {
    return this.profileService.logoutRS(social);
  }

  deleteAccount(obj: any) {
    return this.profileService.deleteAccount(obj);
  }
  generateQRCode() {
    return this.profileService.generateQRCode();
  }
  verifyQRCode(body: any) {
    return this.profileService.verifyQRCode(body);
  }

  // file service functions

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

  // telegramLinkAccount service functions

  initTelegramAuthentication() {
    this.telegramLinkAccountService.init();
  }

  
 
  clearProfilePicStore() {
    this.store.dispatch(clearProfilePicStore());
  }



  
}
