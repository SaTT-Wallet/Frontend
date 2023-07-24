/* eslint-disable prettier/prettier */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { CampaignsDashboardService } from '@campaigns/services/campaigns-dashboard.service';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '../../../core/services/tokenStorage/token-storage-service.service';
import { sattUrl } from '@config/atn.config';
import { WalletService } from '@app/core/services/wallet/wallet.service';
import { data } from 'jquery';

@Component({
  selector: 'app-campaigns-dashboard',
  templateUrl: './campaigns-dashboard.component.html',
  styleUrls: ['./campaigns-dashboard.component.scss']
})
export class CampaignsDashboardComponent implements OnInit {
  isNewUser: any;
  titlee = '';
  private isDestroyed = new Subject();
  @Input() title = 'page title';

  requestedPathUrlChanges$ = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd),
    map((e: NavigationEnd) => e.url),
    startWith(this.router.url)
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private walletService: WalletService,
    private service: CampaignsDashboardService,
    private tokenStorageService: TokenStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.tokenStorageService.getIsAuth()) {
      this.isNewUser = 'true';
    } else if (this.tokenStorageService.getNewUserV2() == null) {
      this.isNewUser = 'true';
    } else {
      this.isNewUser = this.tokenStorageService.getNewUserV2();
    }
    this.requestedPathUrlChanges$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((url: string) => {
        this.service.requestedPathUrl(url);
        this.title = url.split('/').slice(-1)[0];
      });
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
