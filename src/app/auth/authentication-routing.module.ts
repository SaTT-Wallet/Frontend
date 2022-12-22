import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { AuthenticationComponent } from '@auth/components/authentication/authentication.component';
import { RegistrationComponent } from '@auth/components/registration/registration.component';
import { ResetPasswordComponent } from '@auth/components/reset-password/reset-password.component';

const authRoute: Route[] = [
  { path: 'login', component: AuthenticationComponent,  canActivate: [AuthService] },
  { path: 'registration', component: RegistrationComponent },
  { path: 'resetpassword', component: ResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(authRoute)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
