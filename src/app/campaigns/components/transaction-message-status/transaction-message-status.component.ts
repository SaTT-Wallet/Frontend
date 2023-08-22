import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BlockchainActionsService,
  ITransactionStatus
} from '@core/services/blockchain-actions.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { Page } from '@app/models/page.model';

import { Subject } from 'rxjs';
import { filter, takeUntil,map } from 'rxjs/operators';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { EButtonActions } from '@app/core/enums';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { ParticipationListStoreService } from '@app/campaigns/services/participation-list-store.service';
import { Participation } from '@app/models/participation.model';
import _ from 'lodash';
@Component({
  selector: 'app-transaction-message-status',
  templateUrl: './transaction-message-status.component.html',
  styleUrls: ['./transaction-message-status.component.scss']
})
export class TransactionMessageStatusComponent implements OnInit {
  idFromUrl = this.route.snapshot.queryParamMap.get('id');
  isDestroyed = new Subject();

  campaignId = this.campaignsStoreService.campaign.id || this.idFromUrl;
  transactionHash = '';
  isSuccessful: boolean | null = null;
  isFailure: boolean | null = null;
  isDestroyedSubject = new Subject();
  networkWallet: any;
  id: any;
  listLinks: Participation[] = [];
  text: any;
  constructor(
    private service: BlockchainActionsService,
    private router: Router,
    private campaignsStoreService: CampaignsStoreService,
    private route: ActivatedRoute,
    private CampaignService: CampaignHttpApiService,
    private tokenStorageService: TokenStorageService,
    public ParticipationListService: ParticipationListStoreService

  ) {}

  ngOnInit(): void {


    this.ParticipationListService.list$
      .pipe(
        map((pages: Page<Participation>[]) =>
          _.flatten(pages.map((page: Page<Participation>) => page.items))
        ),
        takeUntil(this.isDestroyed)
      )
      .subscribe((links: Participation[]) => {
        this.listLinks = links;
      });



    this.CampaignService.getOneById(this.campaignId as string)
      .pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((data: any) => {
        this.networkWallet = data.data.token.type;
        this.tokenStorageService.setItem('network', this.networkWallet);
      });
    this.service.trnxStatus$
      .pipe(
        filter((e: ITransactionStatus) => e.status !== null),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((e: ITransactionStatus) => {
        if (e.status === 'succeeded') {
          this.isSuccessful = true;
          this.transactionHash = e.transactionHash || '';
          if (e.action === EButtonActions.GET_MY_GAINS) {
            this.text = 'recovergains';
          }
          if (e.action === EButtonActions.VALIDATE_LINK) {
            this.text = 'linkaccepted';
          }
        } else if (e.status === 'failed') {
          this.isFailure = true;
        } else {
          if (!!this.campaignId) {
            this.router.navigate(['home/campaign', this.campaignId]);
          } else {
            this.router.navigate(['home/ad-pools']);
          }
        }
        this.service.resetTrnxStatus();
      });
    if (this.isSuccessful === null && this.isFailure === null) {
      if (!!this.campaignId) {
        this.router.navigate(['home/campaign', this.campaignId]);
      } else {
        this.router.navigate(['home/ad-pools']);
      }
    }
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next('');
    this.isDestroyedSubject.unsubscribe();
  }

  redirectTo(path: any[]): void {
    this.router.navigate(path);
  }
  goToCampaign() {
    this.router.navigate(['home/campaign', this.campaignId]);
    // .then(() => {
    //     window.location.reload();
    //   })
  }
}
