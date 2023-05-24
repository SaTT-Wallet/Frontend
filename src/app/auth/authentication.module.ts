import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from '@app/auth/authentication-routing.module';
import { CountdownModule } from 'ngx-countdown';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { HeaderAuthComponent } from '@app/auth/components/header-auth/header-auth.component';
import { SlideControlComponent } from '@app/slide-control/slide-control.component';
import { SharedModule } from '@app/shared/shared.module';
import { RegistrationComponent } from '@app/auth/components/registration/registration.component';
import { AuthenticationComponent } from '@app/auth/components/authentication/authentication.component';
import { ResetPasswordComponent } from '@app/auth/components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    RegistrationComponent,
    AuthenticationComponent,
    ResetPasswordComponent,
    HeaderAuthComponent,
    SlideControlComponent
  ],
  imports: [
    SharedModule,
    AuthenticationRoutingModule,
    CountdownModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    CustomFormsModule
  ]
})
export class AuthenticationModule {}
