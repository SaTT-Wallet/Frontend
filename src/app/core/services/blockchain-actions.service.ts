import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { CampaignHttpApiService } from './campaign/campaign.service';
import { EButtonActions } from '@app/core/enums';
import { catchError, retry, share, switchMap, map, tap } from 'rxjs/operators';
import { IBlockchainActionEvent } from '@app/models/blockchain-action-event.interface';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
// import { data } from 'jquery';

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
    private participationListService: ParticipationListStoreService,
    private localStorageService: TokenStorageService
  ) {}

  onActionButtonClick(e: IBlockchainActionEvent<any, EButtonActions>) {
    this.actionButtonClickSubject.next(e);
    this.localStorageService.setItem('data', JSON.stringify(e));
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
        let idProm = event.data.prom?.hash
          ? event.data.prom.hash
          : JSON.parse(this.localStorageService.getItem('data') as string).data
              .prom.hash;
        let hash = event.data.prom?.campaignHash
          ? event.data.prom.campaignHash
          : JSON.parse(this.localStorageService.getItem('data') as string).data
              .prom.campaignHash;

        let action = event.action
          ? event.action
          : JSON.parse(this.localStorageService.getItem('data') as string)
              .action;

        if (action === EButtonActions.GET_MY_GAINS) {
          return this.campaignService
            .recoverEarnings(password, idProm, hash)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                if (
                  error.error.error ===
                  "You didn't exceed the limits timing to harvest again"
                ) {
                  this.errorMessage =
                    'Harvest will be available only 24 hours after the link validation from the Ad Pool manager';
                } else if (
                  error.error.error ===
                  "You didn't exceed the limits timing to harvest between 24H"
                ) {
                  this.errorMessage =
                    'Harvest will be available only 24 hours after the last get gains';
                } else if (
                  error.error.error ===
                    'Returned error: insufficient funds for gas * price + value' ||
                  error.error.error ===
                    'Contract validate error : account does not exist'
                ) {
                  this.errorMessage =
                    'Returned error: insufficient funds for gas * price + value';
                } else if (
                  error.error.error ===
                  'Key derivation failed - possibly wrong password'
                ) {
                  this.errorMessage = 'Wrong password';
                } else if (
                  error.error.error ===
                    'Returned error: insufficient funds for gas * price + value' ||
                  error.error.error ===
                    'Contract validate error : account does not exist'
                ) {
                  this.errorMessage =
                    'Returned error: insufficient funds for gas * price + value';
                }
                return of(null);
              }),
              map((response: any) => {
                if (response && response.message === 'success') {
                  return { ...response, action: event.action };
                } else {
                  let data = { error: this.errorMessage };
                  return { ...data, action: event.action };
                }
                //if(response.error==='You didn't exceed the limits timing to harvest again')
              })
            );
        }
        if (action === EButtonActions.VALIDATE_LINK) {
          if(event.data.fromNotification) {
            return this.campaignService
            .validateLinks(event.data.prom, password, event.data.campaignId, true)
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
          return this.campaignService
            .validateLinks(event.data.prom, password, event.data.campaignId, false)
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
