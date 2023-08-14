import { NgModule } from '@angular/core';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { SharedModule } from '@shared/shared.module';
import { InfoComponent } from './components/info/info.component';
import { InterestsComponent } from './components/interests/interests.component';
import { LegalKYCComponent } from './components/legal-kyc/legal-kyc.component';
import { NetworksComponent } from './components/networks/networks.component';
import { ProAccountComponent } from './components/pro-account/pro-account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SecurityComponent } from './components/security/security.component';
import { SocialMediaLinkAccountComponent } from './components/social-media-link-account/social-media-link-account.component';
import { SocialNetworksComponent } from './components/social-networks/social-networks.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { EffectsModule } from '@ngrx/effects';
import { ProfilePicEffects } from './store/effects/profile-pic.effects';
import { Store, StoreModule } from '@ngrx/store';
import * as fromProfilePic from '@user-settings/store/reducers/profile-pic.reducer';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
@NgModule({
  declarations: [
    ProfileComponent,
    InterestsComponent,
    ProAccountComponent,
    SocialMediaLinkAccountComponent,
    LegalKYCComponent,
    SecurityComponent,
    InfoComponent,
    NetworksComponent,
    SocialNetworksComponent,
    CustomToastComponent
  ],
  imports: [
    SharedModule,
    MatSnackBarModule,
    UserSettingsRoutingModule,
    NgxIntlTelInputModule,
    EffectsModule.forFeature([ProfilePicEffects]),
    StoreModule.forFeature(
      fromProfilePic.profilePicFeatureKey,
      fromProfilePic.reducer
    )
  ]
})
export class UserSettingsModule {}
