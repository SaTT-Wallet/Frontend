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

  socialStateGoogle(deactivate: any, channelId: any) {
    return this.profileService.socialStateGoogle(deactivate, channelId);
  }
  socialStateFacebook(deactivate: any, id: any) {
    return this.profileService.socialStateFacebook(deactivate, id);
  }
  socialStateLinkedin(deactivate: any, organization: any) {
    return this.profileService.socialStateLinkedin(deactivate, organization);
  }
  socialStateTwitter(deactivate: any, twitter_id: any) {
    return this.profileService.socialStateTwitter(deactivate, twitter_id);
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
  deleteOneSocialNetworksLinkedin(organization: string) {
    return this.profileService.deleteOneSocialNetworksLinkedin(organization);
  }
  deleteTiktokChannel(tiktokProfileId: string) {
    return this.profileService.deleteTiktokChannel(tiktokProfileId);
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
