import { Injectable, OnDestroy } from '@angular/core';
import { of, Subject, timer } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  retry,
  share,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Campaign } from '@app/models/campaign.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { DraftCampaignStoreService } from '@core/services/draft-campaign-store.service';
import { FormatDataService } from '@campaigns/services/format-data.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';

enum FormStatus {
  Saving = 'saving',
  Saved = 'saved',
  Idle = '',
  Error = 'error'
}

@Injectable()
export class DraftCampaignService implements OnDestroy {
  private editFormChangesSubject = new Subject();
  private editkitFormChangesSubject = new Subject();
  private saveFormStatusSubject = new Subject<string>();
  private isDestroyed = new Subject();
  private isSaveFormStarted = false;

  constructor(
    private service: CampaignHttpApiService,
    private formatData: FormatDataService,
    private draftStore: DraftCampaignStoreService,
    private campaignsStore: CampaignsStoreService
  ) {
    this.saveForm().pipe(takeUntil(this.isDestroyed)).subscribe();
    this.emitSaveFormStatus(FormStatus.Saving)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe();
    this.saveKitForm().pipe(takeUntil(this.isDestroyed)).subscribe();
  }

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.complete();
  }

  get saveStatus() {
    return this.saveFormStatusSubject.asObservable();
  }

  get isSavingStarted() {
    return this.isSaveFormStarted;
  }

  set isSavingStarted(value) {
    this.isSaveFormStarted = true;
  }

  autoSaveFormOnValueChanges(data: any) {
    this.editFormChangesSubject.next(data);
  }
  autoSavekitFormOnValueChanges(data: any) {
    this.editkitFormChangesSubject.next(data);
  }
  setSaveFormStatus(status: string) {
    this.saveFormStatusSubject.next(status);
  }

  private saveForm() {
    return this.editFormChangesSubject.pipe(
      tap((_) => {
        if (!this.isSaveFormStarted) {
          this.isSaveFormStarted = true;
        }
      }),
      map((values: any) => {
        //console.log(values.formData);
        const formData = this.formatData.manipulateDataBeforeSend({
          ...values.formData
        });
        return { formData, id: values.id };
      }),
      switchMap((values: any) => {
        return this.service.updateOneById(values.formData, values.id).pipe(
          tap((res) => {
            this.campaignsStore.initCampaignStore(values.id);
          })
        );
      }),
      retry(3),
      catchError((error) => {
        return of(null);
      }),
      exhaustMap((response) => {
        // console.log(response)
        if (response.success === 'updated') {
          this.draftStore.setStore(new Campaign(response.updatedCampaign));
          this.campaignsStore.updateDraftCampaign(
            new Campaign(response.updatedCampaign)
          );
          return of(response);
        }

        return of(null);
      }),
      catchError((error) => {
        return of(null);
      }),
      switchMap((response) => {
        // console.log(response)
        if (response.success === 'updated') {
          return timer(4000).pipe(
            switchMap((timer) => this.emitSaveFormStatus(FormStatus.Saved))
          );
        }

        return this.emitSaveFormStatus(FormStatus.Error);
      }),
      takeUntil(this.isDestroyed)
    );
  }

  private saveKitForm() {
    return this.editkitFormChangesSubject.pipe(
      tap((_) => {
        if (!this.isSaveFormStarted) {
          this.isSaveFormStarted = true;
        }
      }),
      switchMap((values: any) => {
        return this.service.modifytKit(values.kits, values.id);
      }),
      catchError((error) => {
        return of(null);
      }),
      switchMap((response) => {
        if (response) {
          return timer(4000).pipe(
            switchMap((timer) => this.emitSaveFormStatus(FormStatus.Saved))
          );
        }

        return this.emitSaveFormStatus(FormStatus.Error);
      }),
      takeUntil(this.isDestroyed)
    );
  }

  private emitSaveFormStatus(status: any) {
    return of(status).pipe(tap((_) => this.setSaveFormStatus(status)));
  }
}
