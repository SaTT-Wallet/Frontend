import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { CampaignHttpApiService } from './campaign/campaign.service';
import { EButtonActions } from '@app/core/enums';
import { catchError, retry, share, switchMap, map, tap } from 'rxjs/operators';
import { IBlockchainActionEvent } from '@app/models/blockchain-action-event.interface';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  errorMessage: string = '';
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
        let idProm = event.data.prom.hash;
        let hash = event.data.prom.campaignHash;

        if (event.action === EButtonActions.GET_MY_GAINS) {
          return this.campaignService
            .recoverEarnings(password, idProm, hash)
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
              catchError((error: HttpErrorResponse) => {
                if (
                  error.error.error ===
                  'Key derivation failed - possibly wrong password'
                ) {
                  this.errorMessage = 'Wrong password';
                } else {
                  this.errorMessage = error.error.error;
                }
                return of(null);
              }),
              tap(() => {
                this.participationListService
                  .loadNextPage({}, true, { campaignId: '', state: '' })
                  .subscribe();
              }),
              retry(1),
              catchError(() => {
                return of(null);
              }),
              map((response: any) => {
                if (response && response.message === 'success') {
                  return { ...response, action: event.action };
                } else {
                  let data = { error: this.errorMessage };
                  return { ...data, action: event.action };
                }
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
