import { NgModule } from '@angular/core';
import { SocialRegistrationComponent } from './social-registration.component';
import { SocialRegistrationRoutingModule } from './social-registration-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { HeaderSocialRegistartionComponent } from './components/header-social-registartion/header-social-registartion.component';
import { FooterSocialRegistartionComponent } from './components/footer-social-registartion/footer-social-registartion.component';
import { MonetizeFacebookAccountComponent } from './components/monetize-facebook-account/monetize-facebook-account.component';
import { MonetizeTelegramAccountComponent } from './components/monetize-telegram-account/monetize-telegram-account.component';
import { MonetizeGoogleAccountComponent } from './components/monetize-google-account/monetize-google-account.component';
import { MonetizeStepsComponent } from './components/monetize-steps/monetize-steps.component';
import { LeftComponentComponent } from './components/left-component/left-component.component';
import { ActivationMailComponent } from './components/activation-mail/activation-mail.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { DownaldJSONFileComponent } from './components/downald-jsonfile/downald-jsonfile.component';
import { MonetizeTwitterAccountComponent } from './components/monetize-twitter-account/monetize-twitter-account.component';
import { PassWalletComponent } from './components/pass-wallet/pass-wallet.component';
import { PasswordWalletActivatedComponent } from './components/password-wallet-activated/password-wallet-activated.component';
import { PasswordWalletValidationComponent } from './components/password-wallet-validation/password-wallet-validation.component';
import { SocialConfigComponent } from './components/social-config/social-config.component';
import { PassPhraseComponent } from './components/pass-phrase/pass-phrase.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MonetizeLinkedinAccountComponent } from './components/monetize-linkedin-account/monetize-linkedin-account.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/social-accounts.reducer';
import * as fromSocialNetworks from './state/social-accounts.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SocialAccountsEffects } from './state/social-accounts.effects';
import { MoonBoySocialMediasComponent } from './components/left-component/moon-boy-social-medias/moon-boy-social-medias.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SocialRegistrationComponent,
    HeaderSocialRegistartionComponent,
    FooterSocialRegistartionComponent,
    MonetizeFacebookAccountComponent,
    MonetizeTelegramAccountComponent,
    MonetizeGoogleAccountComponent,
    MonetizeStepsComponent,
    LeftComponentComponent,
    PasswordWalletValidationComponent,
    DownaldJSONFileComponent,
    PasswordWalletActivatedComponent,
    PassWalletComponent,
    CompleteProfileComponent,
    SocialConfigComponent,
    MonetizeTwitterAccountComponent,
    ActivationMailComponent,
    PassPhraseComponent,
    MonetizeLinkedinAccountComponent,
    MoonBoySocialMediasComponent
  ],
  imports: [
    SharedModule,
    SocialRegistrationRoutingModule,
    DragDropModule,
    TranslateModule,
    StoreModule.forFeature(
      fromSocialNetworks.visitedPagesFeatureKey,
      fromSocialNetworks.reducer
    ),
    EffectsModule.forFeature([SocialAccountsEffects])
  ]
})
export class SocialRegistrationModule {}
