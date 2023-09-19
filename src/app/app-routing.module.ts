import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CguComponent } from './cgu/cgu.component';
import { CryptoDataGuard } from './core/services/crypto-data.guard';
import { CryptoMarketCapComponent } from './wallet/components/crypto-market-cap/crypto-market-cap.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: 'crypto-market-cap',
    component: CryptoMarketCapComponent,
    canActivate: [CryptoDataGuard], 
  },
  {
    path: 'cgu',
    component: CguComponent,
    loadChildren: () => import('./cgu/cgu.module').then((m) => m.CguModule)
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    loadChildren: () =>
      import('./privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      )
  },
  { path: 'maintenance', component: MaintenanceComponent },
  {
    path: 'error',
    component: ServerErrorComponent
  },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule)
    //canActivateChild:
  },
  {
    path: 'social-registration',
    loadChildren: () =>
      import('./social-accounts/social-registration.module').then(
        (m) => m.SocialRegistrationModule
      )
  },
  { path: 'home', redirectTo: '', pathMatch: 'prefix' },
  {
    path: '404',
    component: PageNotFoundComponent,
    canActivate: [AuthGuardService]
  },
  { path: '**', redirectTo: '/404' }
  // {
  //   path: "resetpassword",
  //   component: ResetPasswordComponent,
  //   canActivate: [IsConnectedService],0x0751e599b09b372e9090ba687199bdcf87168fed
  // },
  // { path: 'contact2', component: ContactPageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      enableTracing: false, // set it true only in dev mode
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
