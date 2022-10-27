import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from '../notifications/notification.component';
import { ProfileComponent } from '../user-settings/components/profile/profile.component';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { LegalKYCComponent } from '../user-settings/components/legal-kyc/legal-kyc.component';
import { SecurityComponent } from '../user-settings/components/security/security.component';
import { InfoComponent } from '../user-settings/components/info/info.component';
import { NetworksComponent } from '../user-settings/components/networks/networks.component';
import { PasswordModalComponent } from '../campaigns/components/password-modal/password-modal.component';
import { InterestsComponent } from '../user-settings/components/interests/interests.component';
import { ProAccountComponent } from '../user-settings/components/pro-account/pro-account.component';
import { SocialNetworksComponent } from '../user-settings/components/social-networks/social-networks.component';
import { AddTokenComponent } from '@app/wallet/components/add-token/add-token.component';
import { LayoutComponent } from './layout.component';
import { ResetPasswordComponent } from '@app/auth/components/reset-password/reset-password.component';
import { TransactionsHistoryComponent } from '@app/transactions-history/transactions-history.component';
import { AideCampagneComponent } from '@app/faq/aide-campagne.component';

// import { FarmPostsComponent } from "@app/components/farm-posts/farm-posts.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../campaigns/campaigns.module').then((m) => m.CampaignsModule)
      },
      {
        path: 'wallet',
        loadChildren: () =>
          import('../wallet/wallet.module').then((m) => m.WalletModule)
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../user-settings/user-settings.module').then(
            (m) => m.UserSettingsModule
          )
      },
      {
        path: 'TransactionsHistory',
        component: TransactionsHistoryComponent,
        loadChildren: () =>
          import('../transactions-history/transactions-history.module').then(
            (m) => m.TransactionsHistoryModule
          )
      },

      {
        path: 'notification',
        component: NotificationComponent,
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../notifications/notifications.module').then(
            (m) => m.NotificationsModule
          )
      },

      {
        path: 'FAQ',
        component: AideCampagneComponent,
        loadChildren: () => import('../faq/faq.module').then((m) => m.FaqModule)
      },
      {
        path: 'resetpassword',
        component: ResetPasswordComponent
      },
      {
        path: 'check-password',
        component: PasswordModalComponent,
        canActivate: [AuthGuardService]
      },
      { path: 'help', component: AideCampagneComponent },

      { path: 'home', redirectTo: 'ad-pools', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
