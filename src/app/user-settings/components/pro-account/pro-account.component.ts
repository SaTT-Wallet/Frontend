import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from '@core/services/profile/profile.service';
import { Router } from '@angular/router';
import { User } from '@app/models/User';
import { arrayCountries } from '@config/atn.config';
import { ToastrService } from 'ngx-toastr';
import { AuthStoreService } from '@core/services/Auth/auth-store.service';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { Subject } from 'rxjs';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { filter, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-pro-account',
  templateUrl: './pro-account.component.html',
  styleUrls: ['./pro-account.component.css']
})
export class ProAccountComponent implements OnInit, OnDestroy {
  errorMessage = '';
  formCompany: UntypedFormGroup;

  show: boolean = false;

  entreprise: boolean = false;
  user!: User;
  organisation: any;
  nameOrganisation: any;
  closeResult: string = '';
  urlPic: any;
  isLink: string = '';
  showSpinner!: boolean;
  countriesListObj: Array<{ code: string; name: string }>;
  selectedCountryValue: string = '';
  selectedCountryCode: string = '';
  item: any;
  private account$ = this.accountFacadeService.account$;
  private onDestoy$ = new Subject();
  constructor(
    private accountFacadeService: AccountFacadeService,
    public translate: TranslateService,
    private profileSettingsFacade: ProfileSettingsFacadeService
  ) {
    this.formCompany = new UntypedFormGroup({
      organisation: new UntypedFormControl(null, Validators.required),
      ntva: new UntypedFormControl(null, Validators.required)
    });
    const countryList = arrayCountries;
    this.countriesListObj = countryList.sort(function (a: any, b: any) {
      return a.name?.localeCompare(b.name);
    });
    this.item = {
      isocode: 'de'
    };
  }
  selectedCountry(name: string, codeCountry: string) {
    this.selectedCountryValue = name;

    // this.formCompany.get('country')?.setValue(codeCountry)
  }
  ngOnInit(): void {
    this.getDetails();
  }
  getDetails() {
    this.showSpinner = true;
    this.account$
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$)
      )
      .subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.showSpinner = false;
          this.user = new User(response);
          arrayCountries.forEach((item) => {
            if (item.code === this.user.country) {
              this.selectedCountryValue = item.name;
            }
          });
          // this.birthday = moment(this.user.birthday).format('DD-MM-YYYY')
        }
      });
  }
  addCompany() {
    this.showSpinner = true;
    let data_profile = {
      organisation: this.formCompany.get('organisation')?.value,
      NTVA: this.formCompany.get('ntva')?.value,
      isEntreprise: true
    };
    if (this.formCompany.valid) {
      this.profileSettingsFacade
        .updateProfile(data_profile)
        .pipe(takeUntil(this.onDestoy$))
        .subscribe((response: any) => {
          this.showSpinner = false;
          //this.router.navigate(['settings']);
          this.ngOnInit();
        });
    }
  }
  trackByCountriesCode(index: number, country: any): string {
    return country.code;
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
}
