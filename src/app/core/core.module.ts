import { AsyncPipe, registerLocaleData, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { SharedModule } from '@app/shared/shared.module';
import { environment } from '@environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig
} from 'angularx-social-login';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/Auth/auth.service';
import { ContactService } from './services/contact/contact.service';
import { ContactMessageService } from './services/contactmessage/contact-message.service';
import { FilesService } from './services/files/files.Service';
import { NotificationService } from './services/notification/notification.service';
import { ProfileService } from './services/profile/profile.service';
import { TokenStorageService } from './services/tokenStorage/token-storage-service.service';
import localeFr from '@angular/common/locales/fr';
import { EffectsModule } from '@ngrx/effects';
import { AccountEffects } from './store/account-store/effects/account.effects';
import { StoreModule } from '@ngrx/store';
import * as fromAccountReducers from './store/account-store/reducers/account.reducer';
import { ProfilePicEffects } from '@user-settings/store/effects/profile-pic.effects';
import * as fromProfilePic from '@user-settings/store/reducers/profile-pic.reducer';
import { profilePicFeatureKey } from '@user-settings/store/reducers/profile-pic.reducer';
import { accountFeatureKey } from './store/account-store/reducers/account.reducer';
registerLocaleData(localeFr);
import * as fromWallet from '@wallet/store/reducers/wallet.reducer';
import * as fromCryptolist from '@wallet/store/reducers/crypto-list.reducer';
import * as fromSocialAccounts from './store/social-accounts/reducers/social-accounts.reducer';
import * as fromKycReducers from './store/kyc-store/reducers/kyc.reducer';

import { WalletEffects } from '@wallet/store/effects/wallet.effects';
import { CryptoListEffects } from '@app/wallet/store/effects/crypto-list.effects';
import { SocialAccountsEffects } from './store/social-accounts/effects/social-accounts.effects';
import { KycEffects } from './store/kyc-store/effects/kyc.effects';
@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 60,
      space: -5,
      outerStrokeWidth: 5,
      outerStrokeColor: '#00CC9E',
      innerStrokeColor: '#e7e8ea',
      innerStrokeWidth: 5,
      animationDuration: 300,
      imageHeight: 110,
      imageWidth: 110,
      showImage: true,
      showBackground: false,
      responsive: false,
      outerStrokeLinecap: 'square',
      showInnerStroke: true,
      backgroundStrokeWidth: 0
    }),
    ToastrModule.forRoot(),
    TranslateModule,
    /*  StoreModule.forFeature(
      fromAccountReducers.accountFeatureKey,
      fromAccountReducers.reducer
    ),*/
    EffectsModule.forFeature([AccountEffects]),
    EffectsModule.forFeature([ProfilePicEffects]),
    EffectsModule.forFeature([SocialAccountsEffects]),
    EffectsModule.forFeature([WalletEffects]),
    EffectsModule.forFeature([CryptoListEffects]),
    EffectsModule.forFeature([KycEffects]),

    StoreModule.forFeature(profilePicFeatureKey, fromProfilePic.reducer),
    StoreModule.forFeature(accountFeatureKey, fromAccountReducers.reducer),
    StoreModule.forFeature(fromWallet.walletFeatureKey, fromWallet.reducer),
    StoreModule.forFeature(
      fromSocialAccounts.socialAccountsFeatureKey,
      fromSocialAccounts.reducer
    ),
    StoreModule.forFeature(
      fromKycReducers.kycFeatureKey,
      fromKycReducers.reducer
    ),
    StoreModule.forFeature(
      fromCryptolist.cryptoListFeatureKey,
      fromCryptolist.reducer
    ),
    CommonModule
  ],
  exports: [
    SharedModule,
    NgCircleProgressModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    ToastrModule,
    TranslateModule
  ],

  providers: [
    TranslateService,
    CookieService,
    ToastrService,
    AuthService,
    TokenStorageService,
    AuthGuardService,
    NotificationService,
    AsyncPipe,
    ContactService,
    FilesService,
    ContactMessageService,
    ProfileService,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2097234380575759')
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '867479742068-s5btemgej3kg2uohmj48ppphhqnrl864.apps.googleusercontent.com'
            )
          },
          { provide: LOCALE_ID, useValue: 'fr-FR' },
          CookieService
        ]
      } as SocialAuthServiceConfig
    }
    //{ provide: LOCALE_ID, useValue: "fr" },
    //{ provide: LOCALE_ID, useValue: 'de-DE' },
  ]
})
export class CoreModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './src/assets/i18n/', '.json');
}
