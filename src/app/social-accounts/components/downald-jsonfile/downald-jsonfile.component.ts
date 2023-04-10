import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
// import { ProfileService } from '@core/services/profile/profile.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-downald-jsonfile',
  templateUrl: './downald-jsonfile.component.html',
  styleUrls: ['./downald-jsonfile.component.css']
})
export class DownaldJSONFileComponent implements OnInit {
  formExportData: UntypedFormGroup;
  showSpinner: boolean = false;
  errorMessagecode: string = "";
  successMsg: string = "";
  codeExportKeyStore!:number;
  keystoreData:any;
  private isDestroyed = new Subject();

  constructor(
    public translate: TranslateService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private walletFacade: WalletFacadeService,
    
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.formExportData = new UntypedFormGroup({
      password: new UntypedFormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.resendCode();
    this.tokenStorageService.setSecureWallet('visited-download', 'true');
  }

  onCodeCompleted(event: any) {
    this.keystoreData = '';
    this.codeExportKeyStore = Number(event);
    this.checkCodeVerification();
  }

  resendCode() {
    this.walletFacade.getExportCode("eth", "2")
      .pipe(
        catchError((HttpError: HttpErrorResponse) => {
          return of(HttpError.error);
        }),
      )
      .subscribe()
  }



  exportKeyStore() {
    let fileName = '';
    const file = new Blob([JSON.stringify(this.keystoreData)], {
      type: 'application/octet-stream'
    });
    const href = URL.createObjectURL(file);
    const a = this.document.createElement('A');
    a.setAttribute('href', href);
    a.setAttribute('download','keystore.json');
    this.document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      this.router.navigate(['/social-registration/activePass']);
    }, 1000)
    
  }




  checkCodeVerification() {
    this.walletFacade.exportKeyStore("eth", "2", this.codeExportKeyStore)
    .pipe(
      catchError((HttpError: HttpErrorResponse) => {
        return of(HttpError.error);
      }),
    )
    .subscribe((res:any) => {
      if(res.message === "code wrong") {
        this.errorMessagecode = "code incorrect"
      } else if(res.message === "code expired") {
        this.errorMessagecode = "code expired"
      } else {
        if(res.data === true) {
          this.errorMessagecode = "code correct"
          this.keystoreData = res.message;
        }
      }
    })
  
  }  

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
