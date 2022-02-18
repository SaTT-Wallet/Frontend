import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { InfoComponent } from './components/info/info.component';
import { InterestsComponent } from './components/interests/interests.component';
import { LegalKYCComponent } from './components/legal-kyc/legal-kyc.component';
import { NetworksComponent } from './components/networks/networks.component';
import { ProAccountComponent } from './components/pro-account/pro-account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SecurityComponent } from './components/security/security.component';
import { SocialNetworksComponent } from './components/social-networks/social-networks.component';

const routes: Routes = [
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "social-networks",
    component: SocialNetworksComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "Legal_KYC",
    component: LegalKYCComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "security",
    component: SecurityComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "edit",
    component: InfoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "networks",
    component: NetworksComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "interests",
    component: InterestsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "pro",
    component: ProAccountComponent,
    canActivate: [AuthGuardService],
  },
  { path: "", redirectTo: "profile", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
