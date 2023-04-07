import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderSocialRegistartionComponent } from './components/header-social-registartion/header-social-registartion.component';
import { FooterSocialRegistartionComponent } from './components/footer-social-registartion/footer-social-registartion.component';
import { MonetizeFacebookAccountComponent } from './components/monetize-facebook-account/monetize-facebook-account.component';
import { MonetizeStepsComponent } from './components/monetize-steps/monetize-steps.component';
import { SocialRegistrationComponent } from './social-registration.component';
import { LeftComponentComponent } from './components/left-component/left-component.component';
import { PasswordWalletValidationComponent } from './components/password-wallet-validation/password-wallet-validation.component';
import { DownaldJSONFileComponent } from './components/downald-jsonfile/downald-jsonfile.component';
import { MonetizeGoogleAccountComponent } from './components/monetize-google-account/monetize-google-account.component';
import { PasswordWalletActivatedComponent } from './components/password-wallet-activated/password-wallet-activated.component';
import { SocialConfigComponent } from './components/social-config/social-config.component';
import { PassWalletComponent } from './components/pass-wallet/pass-wallet.component';
import { IsCompletedService } from '@core/services/is-completed.service';
import { HasIdWalletService } from '@core/services/has-id-wallet.service';
import { PassWalletCheckedGuard } from '@app/core/services/create-wallet.auth';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { checkStepsService } from '../core/services/checkSteps.service';
import { MonetizeTwitterAccountComponent } from './components/monetize-twitter-account/monetize-twitter-account.component';
import { ActivationMailComponent } from './components/activation-mail/activation-mail.component';
import { PassPhraseComponent } from './components/pass-phrase/pass-phrase.component';
import { MonetizeLinkedinAccountComponent } from './components/monetize-linkedin-account/monetize-linkedin-account.component';
import { MonetizeTiktokAccountComponent } from './components/monetize-tiktok-account/monetize-tiktok-account.component';
//import { MonetizeTiktokAccountComponent } from './components/monetize-tiktok-account/monetize-tiktok-account.component';

const routes: Routes = [
  {
    path: '',
    component: SocialRegistrationComponent,
    children: [
      {
        path: 'monetize-facebook',
        component: MonetizeFacebookAccountComponent,
        canActivate: [HasIdWalletService, checkStepsService]
      },
      // {
      //   path: "monetize-telegram",
      //   component: MonetizeTelegramAccountComponent,
      //   canActivate: [HasIdWalletService,checkStepsService],
      // },
      {
        path: 'monetize-google',
        component: MonetizeGoogleAccountComponent,
        canActivate: [HasIdWalletService, checkStepsService]
      },
      {
        path: 'monetize-twitter',
        component: MonetizeTwitterAccountComponent,
        canActivate: [HasIdWalletService, checkStepsService]
      },
      {
        path: 'monetize-tiktok',
        component: MonetizeTiktokAccountComponent,
        canActivate: [HasIdWalletService, checkStepsService]
      },
      {
        path: 'monetize-linkedin',
        component: MonetizeLinkedinAccountComponent,
        canActivate: [HasIdWalletService, checkStepsService]
      },
      {
        path: 'activePass',
        component: PasswordWalletActivatedComponent,
        canActivate: [checkStepsService]
      },
      {
        path: 'headerSocialRegistartion',
        component: HeaderSocialRegistartionComponent,
        canActivate: [HasIdWalletService]
      },
      {
        path: 'leftComponent',
        component: LeftComponentComponent,
        canActivate: [HasIdWalletService]
      },
      {
        path: 'FooterComponent',
        component: FooterSocialRegistartionComponent,
        canActivate: [HasIdWalletService]
      },
      {
        path: 'transactionPassword',
        component: PasswordWalletValidationComponent,
        canActivate: [HasIdWalletService, checkStepsService]
      },
      {
        path: 'downloadjson',
        component: DownaldJSONFileComponent,
        canActivate: [checkStepsService]
      },
      {
        path: 'monetizeSteps',
        component: MonetizeStepsComponent,
        canActivate: [HasIdWalletService]
      },
      {
        path: 'socialConfig',
        component: SocialConfigComponent,
        canActivate: [HasIdWalletService, checkStepsService]
      },
      {
        path: 'password_wallet',
        component: PassWalletComponent,
        canActivate: [
          HasIdWalletService,
          checkStepsService,
          PassWalletCheckedGuard
        ]
      },
      {
        path: 'completeProfile',
        component: CompleteProfileComponent,
        canActivate: [IsCompletedService]
      },
      {
        path: 'activation-mail',
        component: ActivationMailComponent,
        canActivate: [checkStepsService]
      },
      /*{
        path: 'pass-phrase',
        component: PassPhraseComponent
        //canActivate: [checkStepsService]
      }*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialRegistrationRoutingModule {}
