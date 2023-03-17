import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
// import { ProfileService } from '@core/services/profile/profile.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-downald-jsonfile',
  templateUrl: './downald-jsonfile.component.html',
  styleUrls: ['./downald-jsonfile.component.css']
})
export class DownaldJSONFileComponent implements OnInit {
  formExportData: UntypedFormGroup;
  showSpinner: boolean = false;
  private isDestroyed = new Subject();

  constructor(
    public translate: TranslateService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.formExportData = new UntypedFormGroup({
      password: new UntypedFormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.tokenStorageService.setSecureWallet('visited-download', 'true');
  }

  confirmExport() {
    let password = this.formExportData.get('password')?.value;

    let fileName: string = 'keystore.json';
    this.showSpinner = true;
    // let exportType: string = 'export';

    if (this.formExportData.valid && isPlatformBrowser(this.platformId)) {
      this.profileSettingsFacade
        .exportProfileDataV2(password)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe(
          (data) => {
            const file = new Blob([JSON.stringify(data)], {
              type: 'application/octet-stream'
            });

            const href = URL.createObjectURL(file);
            const a = this.document.createElement('A');
            a.setAttribute('href', href);
            a.setAttribute('download', fileName);
            this.document.body.appendChild(a);
            a.click();
            this.document.body.removeChild(a);
            this.formExportData.reset();
            this.showSpinner = false;
            this.router.navigate(['/social-registration/activePass']);
          },
          (err) => {
            if (
              (err.error.code === 500 &&
                err.error.error ===
                  'Key derivation failed - possibly wrong password') ||
              (err.error.code === 401 && err.error.error === 'Wrong password')
            ) {
              this.formExportData
                .get('password')
                ?.setErrors({ checkPassword: true });
              this.showSpinner = false;
            }
          }
        );
    }
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
