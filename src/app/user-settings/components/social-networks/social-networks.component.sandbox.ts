import {  HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ProfileService } from "@core/services/profile/profile.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { sandboxOf } from "angular-playground";
import { of } from "rxjs";
import { SocialNetworksComponent } from "./social-networks.component";

class MockProfileService {
  getSocialNetworks() {
    return of({});
  }
}

export default sandboxOf(SocialNetworksComponent, {
  imports: [
    NgbModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    TranslateModule.forRoot()
  ],
  providers: [{ provide: ProfileService, useClass: MockProfileService }],
}).add("default", {
  template: `<app-social-networks></app-social-networks>`,
});

