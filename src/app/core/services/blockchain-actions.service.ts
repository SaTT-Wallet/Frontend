import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { CampaignHttpApiService } from './campaign/campaign.service';
import { EButtonActions } from '@app/core/enums';
import { catchError, retry, share, switchMap, map, tap } from 'rxjs/operators';
import { IsCompletedService } from './is-completed.service';
import { IBlockchainActionEvent } from '@app/models/blockchain-action-event.interface';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';

export interface ITransactionStatus {
  status: 'succeeded' | 'failed' | null;
  transactionHash?: string;
  message: string;
  action?: EButtonActions;
}

@Injectable({
  providedIn: 'root'
})
export class BlockchainActionsService {
  private actionButtonClickSubject = new BehaviorSubject<
    IBlockchainActionEvent<any, EButtonActions>
  >({
    data: {},
    action: EButtonActions.UNKNOWN
  });
  readonly actionButtonClick$ = this.actionButtonClickSubject.asObservable();

  private confirmButtonSubject = new Subject<string>();
  readonly confirmButtonClick$ = this.confirmButtonSubject.asObservable();

  initialTrnxStatus: ITransactionStatus = {
    status: null,
    message: ''
  };

  private trnxStatusBehaviorSubject = new BehaviorSubject<ITransactionStatus>(
    this.initialTrnxStatus
  );
  readonly trnxStatus$ = this.trnxStatusBehaviorSubject.asObservable();

  constructor(
    private campaignService: CampaignHttpApiService,
    private participationListService: ParticipationListStoreService
  ) {}

  onActionButtonClick(e: IBlockchainActionEvent<any, EButtonActions>) {
    this.actionButtonClickSubject.next(e);
  }

  onConfirmButtonClick(password: string) {
    this.confirmButtonSubject.next(password);
  }

  performAction() {
    return combineLatest([
      this.actionButtonClick$,
      this.confirmButtonClick$
    ]).pipe(
      switchMap(([event, password]) => {
        let promHash = event.data.prom.hash
          ? event.data.prom.hash
          : event.data.prom.id;
        let idCampaign = event.data.prom.id_campaign
          ? event.data.prom.id_campaign
          : event.data.prom.campaignHash;

        if (event.action === EButtonActions.GET_MY_GAINS) {
          return this.campaignService
            .recoverEarnings(
              promHash,
              password,
              event.data.bounty,

              idCampaign
            )
            .pipe(
              map((response: any) => {
                return { ...response, action: event.action };
              })
            );
        }
        if (event.action === EButtonActions.VALIDATE_LINK) {
          return this.campaignService
            .validateLinks(event.data.prom, password, event.data.campaignId)
            .pipe(
              tap(() => {
                this.participationListService
                  .loadNextPage({}, true, { campaignId: '', state: '' })
                  .subscribe();
              }),
              retry(1),
              catchError((err) => {
                return of(null);
              }),
              map((response: any) => {
                return { ...response, action: event.action };
              })
            );
        }

        // TODO: add other blockchain actions here like for example launch campaign, participate

        return of(EButtonActions.UNKNOWN);
      }),
      share()
    );
  }

  setTrnxStatus(trnxStatus: ITransactionStatus) {
    this.trnxStatusBehaviorSubject.next(trnxStatus);
  }

  resetTrnxStatus() {
    this.trnxStatusBehaviorSubject.next(this.initialTrnxStatus);
  }

  // recoverEarnings(data: any) {
  //   return this.campaignService.recoverEarnings(data.idProm, data.password);
  // }

  // validateLink(data: any) {
  //   return this.campaignService.validateLinks(
  //     data.prom,
  //     data.password,
  //     data.id
  //   );
  // }
}
