import { Injectable, Injector } from '@angular/core';
import { ProfileService } from '@app/core/services/profile/profile.service';
import {
  loadSocialAccountss,
  loadSocialAccountssLogout,
  loadUpdatedSocialAccountss
} from '@app/core/store/social-accounts/actions/social-accounts.actions';
import { socialAccountState } from '@app/core/store/social-accounts/reducers/social-accounts.reducer';
import { selectSocialAccount } from '@app/core/store/social-accounts/selectors/social-accounts.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class SocialAccountFacadeService {
  constructor(
    private injector: Injector,
    private store: Store<socialAccountState>,
    private profileService: ProfileService
  ) {}
  initSocialAccount() {
    this.dispatchSocialAccount();
  }
  public get socialAccount$() {
    //.pipe(filter((res) => res !== null));
    return this.store.select(selectSocialAccount);
  }
  dispatchSocialAccount() {
    this.store.dispatch(loadSocialAccountss());
  }
  dispatchUpdatedSocailAccount() {
    this.store.dispatch(loadUpdatedSocialAccountss());
  }
  dispatchLogoutSocialAccounts() {
    this.store.dispatch(loadSocialAccountssLogout());
  }
  /*-------------get-------- */
  getSocialNetworks() {
    return this.profileService.getSocialNetworks();
  }


  checkThreads() {
    return this.profileService.checkThreads();
  }

  addThreads() {
    return this.profileService.addThreads()
  }

  notification() {
    return this.profileService.notification();
  }
 
  
 
  
  /*-------delete-------- */
  deleteOneSocialNetworksGoogle(id: string) {
    return this.profileService.deleteOneSocialNetworksGoogle(id);
  }
  deleteOneSocialNetworksTwitter(id: string) {
    return this.profileService.deleteOneSocialNetworksTwitter(id);
  }
  deleteOneSocialNetworksFb(id: string) {
    return this.profileService.deleteOneSocialNetworksFb(id);
  }
  deleteOneSocialNetworksLinkedin(organization: string,linkedinId:string) {
    return this.profileService.deleteOneSocialNetworksLinkedin(organization,linkedinId);
  }
  deleteTiktokChannel(tiktokProfileId: string) {
    return this.profileService.deleteTiktokChannel(tiktokProfileId);
  }
  deleteThreadAccount(id: string) {
    return this.profileService.deleteThreadAccount(id);
  }
  deleteAllTiktokChannels() {
    return this.profileService.deleteAllTiktokChannels();
  }
  deleteAllSocialNetworksGoogle() {
    return this.profileService.deleleteAllSocialNetworksGoogle();
  }
  deleteAllSocialNetworksFb() {
    return this.profileService.deleleteAllSocialNetworksFb();
  }
  deleteAllSocialNetworksLinkedin() {
    return this.profileService.deleteAllSocialNetworksLinkedin();
  }
  deleteAllSocialNetworksTwitter() {
    return this.profileService.deleleteAllSocialNetworksTwitter();
  }
}
