import { NgModule } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthenticationRoutingModule } from '@app/auth/authentication-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/services/Auth/auth.service';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { ContactService } from '@core/services/contact/contact.service';
import { FilesService } from '@core/services/files/files.Service';
import { ContactMessageService } from '@core/services/contactmessage/contact-message.service';
import { ProfileService } from '@core/services/profile/profile.service';
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
  ],

  providers: [
    CookieService,
    TranslateService,
    ToastrService,
    AuthService,
    TokenStorageService,
    AuthGuardService,
    AsyncPipe,
    ContactService,
    FilesService,
    ContactMessageService,
    ProfileService
    // {provide: LocationStrategy, useClass: HashLocationStrategy},
        // {provide: LocationStrategy, useClass: HashLocationStrategy},

    //{ provide: LOCALE_ID, useValue: "fr" },
    //{ provide: LOCALE_ID, useValue: 'de-DE' },
  ]
})
export class AuthenticationModule {}
