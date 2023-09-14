import { NgModule } from '@angular/core';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterBarComponent
  ],
  imports: [SharedModule, LayoutRoutingModule, HttpClientModule],

  providers: [
    //{ provide: LOCALE_ID, useValue: "fr-FR" },
    //{ provide: LOCALE_ID, useValue: 'de-DE' },
  ]
})
export class LayoutModule {}
