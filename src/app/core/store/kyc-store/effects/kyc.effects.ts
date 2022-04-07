import { Injectable } from '@angular/core';
import { KycFacadeService } from '@app/core/facades/kyc-facade/kyc-facade.service';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import {
  loadKyc,
  loadKycFailure,
  loadKycLogout,
  loadKycSuccess,
  loadUpdatedKyc
} from '../actions/kyc.actions';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FilesService } from '@app/core/services/files/files.Service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { Router } from '@angular/router';
@Injectable()
export class KycEffects {
  constructor(
    private actions$: Actions,
    private kycFacadeService: KycFacadeService,
    private filesService: FilesService,
    private tokenStorageService: TokenStorageService,
    public router: Router
  ) {}
  loadKyc$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadKyc, loadUpdatedKyc),
      concatLatestFrom(() => this.kycFacadeService.kyc$),
      mergeMap(([action, kyc]) => {
        if (kyc === null || action.type === loadUpdatedKyc.type) {
          return this.filesService.getListUserLegal().pipe(
            map((data: any) => {
              if (
                data.message === 'jwt expired' ||
                data.name === 'JsonWebTokenError'
              ) {
                let error: any = {};
                error.error = data.message;
                this.tokenStorageService.signOut();
                this.router.navigate(['/auth/login']);
                return loadKycLogout();
              }
              return loadKycSuccess({ data: data.data });
            }),
            catchError((error) => of(loadKycFailure(error)))
          );
        }
        return of(loadKycSuccess({ data: kyc }));
      })
    );
  });
}
