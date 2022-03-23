import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  BlockchainActionsService,
  ITransactionStatus
} from '@core/services/blockchain-actions.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-link',
  templateUrl: './verify-link.component.html',
  styleUrls: ['./verify-link.component.css']
})
export class VerifyLinkComponent implements OnDestroy {
  campaignId = this.route.snapshot.queryParamMap.get('campaign_id') || '';

  isDestroyedSubject = new Subject();
  trnxStatus$ = this.service.trnxStatus$;
  from: any;
  constructor(
    private service: BlockchainActionsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.trnxStatus$
      .pipe(
        filter((e: ITransactionStatus) => e.status !== null),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((e: ITransactionStatus) => {
        this.router.navigate(['home/transactions'], {
          queryParams: { status: e.status, id: this.campaignId }
        });
      });
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next('');
    this.isDestroyedSubject.unsubscribe();
  }

  goToCampaign() {
    this.router.navigate(['/home/campaign', this.campaignId], {
      queryParams: { page: 'campaign' }
    });
  }
}
