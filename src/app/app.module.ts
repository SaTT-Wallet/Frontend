import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacebookModule } from 'ngx-facebook';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule, httpTranslateLoader } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@environments/environment';
import { HelpComponent } from './components/help/help.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ServerErrorComponent,
    MaintenanceComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'satt-token-atayen' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FacebookModule.forRoot(),
    CoreModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true // Pauses recording actions and state changes when the extension window is not open
    })
  ],
  providers: [{ provide: 'isBrowser', useValue: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
