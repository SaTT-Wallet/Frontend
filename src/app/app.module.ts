import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacebookModule } from 'ngx-facebook';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { BrowserModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@environments/environment';
import { HelpComponent } from './components/help/help.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { translateBrowserLoaderFactory } from '@core/loaders/translate-browser.loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpInterceptorService } from './http-interceptor.service';
import { ChartsModule } from 'ng2-charts';

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
    ChartsModule,
    AppRoutingModule,
    HttpClientModule,
    TransferHttpCacheModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState]
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
    /*   GoogleTagManagerModule.forRoot({
      id: environment.gmtId
    })*/
  ],
  exports:[TranslateModule], 
  providers: [{ provide: 'isBrowser', useValue: true }, {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {}
