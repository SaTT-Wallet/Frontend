import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-social-registration',
  templateUrl: './social-registration.component.html',
  styleUrls: ['./social-registration.component.css']
})
export class SocialRegistrationComponent implements OnInit {
  constructor(
    public router: Router,
    private accountFacadeService: AccountFacadeService,
    private socialAccountFacadeService: SocialAccountFacadeService
  ) {}

  ngOnInit(): void {
    this.accountFacadeService.initAccount();
    this.socialAccountFacadeService.initSocialAccount();
  }
}
