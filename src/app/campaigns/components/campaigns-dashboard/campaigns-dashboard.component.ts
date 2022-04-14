import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CampaignsDashboardService } from '@campaigns/services/campaigns-dashboard.service';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-campaigns-dashboard',
  templateUrl: './campaigns-dashboard.component.html',
  styleUrls: ['./campaigns-dashboard.component.scss']
})
export class CampaignsDashboardComponent implements OnInit {
  titlee = '';
  private isDestroyed = new Subject();
  @Input() title = 'page title';

  requestedPathUrlChanges$ = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd),
    map((e: NavigationEnd) => e.url),
    startWith(this.router.url)
  );

  constructor(
    private router: Router,
    private service: CampaignsDashboardService
  ) {}

  ngOnInit(): void {
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
