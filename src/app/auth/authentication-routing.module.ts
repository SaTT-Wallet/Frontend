import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthenticationComponent } from '@auth/components/authentication/authentication.component';
import { RegistrationComponent } from '@auth/components/registration/registration.component';
import { ResetPasswordComponent } from '@auth/components/reset-password/reset-password.component';

const authRoute: Route[] = [
  { path: 'login', component: AuthenticationComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'resetpassword', component: ResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(authRoute)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
