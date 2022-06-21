import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';

import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-social-registration',
  templateUrl: './social-registration.component.html',
  styleUrls: ['./social-registration.component.css']
})
export class SocialRegistrationComponent implements OnInit {
  private socialAccount$ = this.socialAccountFacadeService.socialAccount$;

  constructor(
    public router: Router,
    private accountFacadeService: AccountFacadeService,
    private socialAccountFacadeService: SocialAccountFacadeService
  ) {}

  ngOnInit(): void {
    this.accountFacadeService.initAccount();
    this.socialAccount$
      .pipe(
        tap((data) => {
          if (data === null) {
            this.socialAccountFacadeService.initSocialAccount();
          }
        })
      )
      .subscribe();
  }
}
