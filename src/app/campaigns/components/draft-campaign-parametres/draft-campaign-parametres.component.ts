/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Editor } from 'ngx-editor';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import { Campaign } from '@app/models/campaign.model';
import { TranslateService } from '@ngx-translate/core';
import { arrayCountries } from '@app/config/atn.config';
import {
  DOCUMENT,
  formatDate,
  isPlatformBrowser,
  getLocaleId
} from '@angular/common';
import {
  IDropdownSettings,
  MultiSelectComponent
} from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
import { HasElementRef } from '@angular/material/core/common-behaviors/color';

@Component({
  selector: 'app-draft-campaign-parametres',
  templateUrl: './draft-campaign-parametres.component.html',
  styleUrls: ['./draft-campaign-parametres.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraftCampaignParametresComponent implements OnInit {
  @Input() id = '';

  @Input() draftData = new Campaign();

  @Input() notValidParam: any;
  @Output() validFormParam = new EventEmitter();

  @Output() saveFormStatus = new EventEmitter();

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 20,
    allowSearchFilter: true
  };
  form = new FormGroup({});
  editor = new Editor();
  showOptions: boolean = false;
  selectedAttributes: any;
  countriesListObj: any = arrayCountries;
  dropdownList: any;
  startDay: any;
  today: number = Number(new Date());
  private isDestroyed = new Subject();
  InterestList: any;
  check = false;
  selectedTags: string[] = [];
  maxTags = 0;
  @ViewChild('countries', { static: false }) countries?: any;
  @Input() isActive = false;

  constructor(
    private service: DraftCampaignService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    public translate: TranslateService
  ) {
    this.InterestList = [
      { name: 'Animals' },
      { name: 'Beauty' },
      { name: 'Creative hobbies' },
      { name: 'Decoration' },
      { name: 'Environement' },
      { name: 'Finance' },
      { name: 'Kitchen' },
      { name: 'Games' },
      { name: 'Health' },
      { name: 'Movies' },
      { name: 'Music' },
      { name: 'Parties' },
      { name: 'Photography' },
      { name: 'Reading' },
      { name: 'Social Networking' },
      { name: 'Sport' },
      { name: 'Technlogies' },
      { name: 'Theatre' },
      { name: 'Travel' }
    ];
    this.InterestList.forEach((item: any) => {
      item.checked = false;
    });

    this.form = new FormGroup(
      {
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl('', Validators.required),
        tags: new FormControl([], Validators.required),
        targetedCountries: new FormControl('', Validators.required)
      },
      [DateValidator]
    );

    //tri
    // this.countriesListObj = this.countriesListObj.sort(function (
    //   a: any,
    //   b: any
    // ) {
    //   return a.name.localeCompare(b.name);
    // });
    this.dropdownList = this.countriesListObj.map((elem: any, index: any) => {
      elem.item_text = elem.name;
      elem.item_id = index;
      elem.code = elem.code;

      return elem;
    });
  }

  get startDate() {
    return this.form.get('startDate') as FormControl;
  }

  get endDate() {
    return this.form.get('endDate') as FormControl;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.countries?.toggleSelectAll();
      var elements = this.document.getElementsByClassName('selected-item');
      var allCountriesElement: HTMLElement;
      allCountriesElement = elements[0] as HTMLElement;
      // allCountriesElement.innerHTML = 'fefzefzefzef';
      // let elem = this.document.getElementsByClassName('dropdown-btn')[0]  as HTMLElement
      // console.log(elem)
      //  elem.removeChild(elem.lastChild);
    }, 1000);
  }

  ngOnInit(): void {
    let day: any;
    let month: any;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      day = '0' + dd;
    } else {
      day = dd;
    }
    if (mm < 10) {
      month = '0' + mm;
    } else {
      month = mm;
    }
    let minDate = yyyy + '-' + month + '-' + day;
    let minStartDate = this.document.getElementById('minStartDate');
    let minEndDate = this.document.getElementById('minEndDate');
    if (minStartDate) minStartDate.setAttribute('min', minDate);
    if (minEndDate) minEndDate.setAttribute('min', minDate);

    this.saveForm();
    this.emitFormStatus();
    this.checkCountriesTags(this.form.value);

    this.form.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          if (this.form.valid) {
            this.validFormParam.emit(true);
          } else {
            this.validFormParam.emit(false);
          }
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe();
  }
  onItemSelect(item: any) {}
  onSelectAll(items: any) {}
  ngOnChanges(changes: SimpleChanges) {
    this.InterestList.forEach((tag: any) => {
      if (this.draftData.tags.indexOf(tag.name) >= 0) {
        tag.checked = true;
        this.selectedTags.push(tag.name);
      }
    });
    this.maxTags = this.selectedTags.length;
    let today = new Date();
    let start: any;
    if (this.draftData.startDate) {
      start = new Date(this.draftData.startDate);
    }

    if (changes.draftData && changes.draftData.currentValue.id) {
      this.populateForm(this.draftData);
      if (
        this.draftData.startDate === '' ||
        this.draftData.startDate === undefined ||
        start < today
      ) {
        const today = new Date();
        this.draftData.startDate = today;

        this.form.get('startDate')?.setValue(today);
      }
      if (
        this.draftData.endDate === '' ||
        this.draftData.endDate === undefined
      ) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 5);
        this.draftData.endDate = tomorrow;
        this.form.get('endDate')?.setValue(tomorrow);
      }
    }
  }

  saveForm() {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          if (this.draftData.id) {
            this.checkCountriesTags(values);
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
          }
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe();
  }

  emitFormStatus() {
    this.service.saveStatus
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((status: string) => {
        this.saveFormStatus.emit(status);
      });
  }

  populateForm(data: Campaign) {
    this.form.patchValue(
      {
        startDate: data.startDate,
        endDate: data.endDate,
        tags: data.tags,
        targetedCountries: data.targetedCountries
      },
      { emitEvent: false, onlySelf: true }
    );
  }

  //TODO: refactor this method to better solution or implement our own lib
  checkCountriesTags(values: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (values.targetedCountries.length === this.dropdownList.length) {
        var elements = this.document.getElementsByClassName('selected-item');
        var allCountriesElement: HTMLElement;
        if (elements.length > 0) {
          allCountriesElement = elements[0] as HTMLElement;
          allCountriesElement.innerHTML = 'All countries';
          for (let i = 1; i < elements.length; i++) {
            let element = elements[i] as HTMLElement;
            element.childNodes[0].nodeValue =
              values.targetedCountries[i].item_text;
            element.style.display = 'none';
            if (element.innerText === '+230') {
              element.style.display = 'none';
            }
          }
        }
        elements = this.document.getElementsByClassName('ng-star-inserted');
        if (elements.length > 0) {
          for (let i = 1; i < elements.length; i++) {
            let element = elements[i] as HTMLElement;
            if (element.innerText === '+230') {
              element.style.display = 'none';
            }
          }
        }
      } else {
        var elements = this.document.getElementsByClassName('selected-item');
        if (elements.length > 0) {
          for (let i = 0; i < elements.length; i++) {
            let element = elements[i] as HTMLElement;
            element.childNodes[0].nodeValue = !!values.targetedCountries[i]
              .item_text
              ? values.targetedCountries[i].item_text
              : values.targetedCountries[i];
            element.style.display = 'block';
          }
        }
      }
    }
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }

  toggleTag(tagname: string, index: number) {
    if (!this.InterestList[index].checked) {
      if (this.maxTags < 3) {
        this.InterestList[index].checked = true;
        this.selectedTags.push(tagname);
        this.maxTags++;
      }
    } else {
      this.InterestList[index].checked = false;
      this.maxTags--;
    }
    this.selectedTags = this.InterestList.filter((res: any) => res.checked).map(
      (res: any) => res.name
    );
    this.form.setValue({ ...this.form.value, tags: this.selectedTags });
  }
}

export function DateValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  let startDate = new Date(control.get('startDate')?.value);
  let endDate = new Date(control.get('endDate')?.value);

  let c = new Date();
  if (startDate.setHours(0, 0, 0, 0) < c.setHours(0, 0, 0, 0)) {
    return {
      invaineFrom: true
    };
  }
  if (endDate.setHours(0, 0, 0, 0) < c.setHours(0, 0, 0, 0)) {
    return {
      invaineTo: true
    };
  }
  if (startDate > endDate) {
    return {
      dates: true
    };
  }
  return {};
}
