/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Editor } from 'ngx-editor';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import { Campaign } from '@app/models/campaign.model';
import { TranslateService } from '@ngx-translate/core';
import { arrayCountries } from '@app/config/atn.config';
import { DOCUMENT, formatDate, isPlatformBrowser } from '@angular/common';
import {
  IDropdownSettings,
  MultiSelectComponent
} from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';

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
  @ViewChild('countries', { static: false }) countries: any;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: this.translate.instant('selectAll'),
    unSelectAllText: this.translate.instant('unSelectAll'),
    itemsShowLimit: 20,
    allowSearchFilter: true
  };
  form = new UntypedFormGroup({});
  editor = new Editor();
  showOptions: boolean = false;
  selectedAttributes = [];
  countriesListObj: any = arrayCountries;
  dropdownList: any;
  startDay: any;
  today: number = Number(new Date());
  private isDestroyed = new Subject();
  InterestList: any;
  check = false;
  selectedTags: string[] = [];
  maxTags = 0;
  @ViewChild('countries', { static: false }) countriesDropDown?: any;
  @Input() isActive = false;

  constructor(
    private service: DraftCampaignService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    public translate: TranslateService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private refChangeDetect: ChangeDetectorRef
  ) {
    this.InterestList = [
      { name: this.translate.instant('Animals') },
      { name: this.translate.instant('Beauty') },
      { name: this.translate.instant('creativeHobbies') },
      { name: this.translate.instant('Decoration') },
      { name: this.translate.instant('Environment') },
      { name: this.translate.instant('Finance') },
      { name: this.translate.instant('Kitchen') },
      { name: this.translate.instant('Games') },
      { name: this.translate.instant('Health') },
      { name: this.translate.instant('Movies') },
      { name: this.translate.instant('Music') },
      { name: this.translate.instant('Parties') },
      { name: this.translate.instant('Photography') },
      { name: this.translate.instant('Reading') },
      { name: this.translate.instant('socialNetworking') },
      { name: this.translate.instant('Sport') },
      { name: this.translate.instant('Technologies') },
      { name: this.translate.instant('Theatre') },
      { name: this.translate.instant('Travel') }
    ];
    this.InterestList.forEach((item: any) => {
      item.checked = false;
    });

    this.form = new UntypedFormGroup(
      {
        startDate: new UntypedFormControl('', Validators.required),
        endDate: new UntypedFormControl('', [Validators.required]),
        tags: new UntypedFormControl([], Validators.required)
      },
      
      
    );

    // Wait for the form controls to have values
this.form.controls.startDate.valueChanges.pipe(take(1)).subscribe(() => {
  this.form.controls.endDate.setValidators([Validators.required, endDateGreaterThanStartDateValidator(this.form)]);
});

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
    return this.form.get('startDate') as UntypedFormControl;
  }

  get endDate() {
    return this.form.get('endDate') as UntypedFormControl;
  }

  
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.draftData.targetedCountries.length === 0) {
        this.countries?.toggleSelectAll();
      }
      // var elements = this.document.getElementsByClassName('selected-item');
      // var allCountriesElement: HTMLElement;
      // allCountriesElement = elements[0] as HTMLElement;
      // allCountriesElement.innerHTML = 'fefzefzefzef';
      // let elem = this.document.getElementsByClassName(
      //   'dropdown-btn'
      // )[0] as HTMLElement;
      // console.log('elem', elem);
      //  elem.removeChild(elem.lastChild);
    }, 1000);
  }
  
  ngOnInit(): void {
    let today = new Date();
    let formattedDate = this.formatDate(today);

    let minStartDate = this.elRef.nativeElement.querySelector('#minStartDate');
    let minEndDate = this.elRef.nativeElement.querySelector('#minEndDate');

    if (minStartDate) {
      this.renderer.setAttribute(minStartDate, 'min', formattedDate);
    }
    if (minEndDate) {
      this.renderer.setAttribute(minEndDate, 'min', formattedDate);
    }

    this.saveForm();
    this.emitFormStatus();
  }
 
  formatDate(date: Date): string {
    let day = ('0' + date.getDate()).slice(-2); // adds leading zero if necessary
    let month = ('0' + (date.getMonth() + 1)).slice(-2); // adds leading zero if necessary
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  /** 
   * 
   *  SAVE END AND START DATE OF CAMPAIGN
   * 
   */


  // SELECT DATE

  changeDate(event:any, type: string) {
    this.checkValidForm()
  }


  ngOnChanges(changes: SimpleChanges) {
    this.selectedTags = this.InterestList
    .filter((tag:any) => this.draftData.tags.includes(tag.name))
    .map((tag: any) => {
      tag.checked = true;
      return tag.name;
    });
    let today = new Date();
    let start: any;
    if (this.draftData.startDate) {
      start = new Date(this.draftData.startDate);
      this.draftData.startDate = start;
    }
    if (this.draftData.endDate) {
      let end = new Date(this.draftData.endDate);
      this.draftData.endDate = end;
    }
    if (!this.draftData.startDate || !this.draftData.endDate) {
      let today = new Date();
      let end = new Date();
      today.setHours(today.getHours() + 2);
      this.draftData.startDate = today;
      end.setHours(today.getHours() + 48);
      this.draftData.endDate = end;
    }
    if (changes.draftData && changes.draftData.currentValue.id) {
      this.checkValidForm()
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


  /***
   * 
   *     FORMS UTILS
   * 
   * 
   */

  // SAVE FORM

  saveForm() {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          if (this.draftData.id) {
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
           this.checkValidForm()
          }
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe();
  }


  // EMIT FORM STATUS

  emitFormStatus() {
    this.service.saveStatus
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((status: string) => {
        this.saveFormStatus.emit(status);
      });
  }


  // POPULATE FORM

  populateForm(data: Campaign) {
    this.form.patchValue(
      {
        startDate: data.startDate,
        endDate: data.endDate,
        tags: data.tags
      },
      { emitEvent: false, onlySelf: true }
    );
    if (data.targetedCountries[0] === 'All countries') {
      this.selectedAttributes = this.dropdownList;
    } else {
      this.selectedAttributes = this.dropdownList.filter((item: any) =>
        data.targetedCountries.includes(item.item_text)
      );
    }
    setTimeout(() => {
      this.checkCountriesTags(this.selectedAttributes);
    }, 1000);

    //TODO populate tags and selected countries
  }

  

  

  /**
   * 
   *            CHECK
   *            VALID PARAMS
   * 
   * 
   * 
   */
    checkValidForm() {
      const isValidForm = this.form.get('endDate')?.errors === null && this.form.value.tags.length > 0 && this.selectedAttributes.length > 0;
      this.validFormParam.emit(isValidForm)
    }



  /** 
   * 
   *  INTEREST LIST FUNCTIONS
   * 
   */


  // SELECT INTEREST

  toggleTag(index: number) {
    const maxSelectedTags = 3;
    const isTagCurrentlyChecked = this.InterestList[index].checked;
    const countCheckedTags = this.form.get('tags')?.value.length;
    if (!isTagCurrentlyChecked && countCheckedTags < maxSelectedTags) {
      this.InterestList[index].checked = true;
    } else if (isTagCurrentlyChecked) {
      this.InterestList[index].checked = false;
    }
    this.selectedTags = this.InterestList.filter((tag:any) => tag.checked).map((tag:any) => tag.name);
    this.saveTags(this.selectedTags);
  }
  


  // SAVE INTERESTS

  saveTags(tags: string[]) {
    this.form.setValue({ ...this.form.value, tags: tags });
    if (this.draftData.id) {
      this.service.autoSaveFormOnValueChanges({
        formData: { ...this.form.value, tags },
        id: this.id
      });
      this.checkValidForm();
    }
  }

  // CHECK INTEREST FOR CSS RULES 

  checkInterest(index: number) {
    return this.selectedTags.some(element => element === this.InterestList[index].name);
  }




   /** 
   * 
   *  COUNTRIES LIST FUNCTIONS
   * 
   */


  // SELECT COUNTRIES

  toggleCountries(countries: MultiSelectComponent) {
    const targetedCountries = countries.selectedItems.map((item: any) => {
      return { item_id: item.id, item_text: item.text };
    });
    this.selectedAttributes = this.dropdownList.filter((item: any) =>
      targetedCountries
        .map((elem: any) => elem.item_text)
        .includes(item.item_text)
    );

    setTimeout(() => {
      this.checkCountriesTags(targetedCountries);
    }, 1000);
    this.saveCountries(targetedCountries);
  }


  // PUT COUNTRIES SELECTED ON THE INPUT

  checkCountriesTags(values: any) {
    if (!isPlatformBrowser(this.platformId)) return;  
    const selectedItemElements = Array.from(this.document.getElementsByClassName('selected-item') as HTMLCollectionOf<HTMLElement>);
    const ngStarInsertedElements = Array.from(this.document.getElementsByClassName('ng-star-inserted') as HTMLCollectionOf<HTMLElement>);
    if (values?.length === this.dropdownList.length) {
        selectedItemElements[0].innerHTML = this.translate.instant('allCountries');
        selectedItemElements.slice(1).forEach((element, i) => {
            element.childNodes[0].nodeValue = values[i].item_text;
            element.style.display = (element.innerText === '+230') ? 'none' : 'none';
        });
        ngStarInsertedElements.slice(1).forEach(element => {
            element.style.display = (element.innerText === '+230') ? 'none' : 'none';
        });
    } else {
        selectedItemElements.forEach((element, i) => {
            element.childNodes[0].nodeValue = !!values[i]?.item_text ? values[i].item_text : values[i];
            element.style.display = 'block';
        });
    }
  }

  // SAVE COUNTRIES

  saveCountries(targetedCountries: any) {
    if (this.draftData.id) {
      this.service.autoSaveFormOnValueChanges({
        formData: { ...this.form.value, targetedCountries },
        id: this.id
      });
      this.checkValidForm();
    }
  }



  // COMPONENT WILL DESTROY 

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
  
}




/** 
   * 
   *  DATE VALIDATOR
   * 
   */
function endDateGreaterThanStartDateValidator(formGroup: UntypedFormGroup): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const startDateControl = formGroup.get('startDate');
    const endDateControl = formGroup.get('endDate');
    if (startDateControl && endDateControl) {
      const startDateValue = startDateControl.value;
      const endDateValue = endDateControl.value;
      if (startDateValue && endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);
        if (endDate <= startDate) {
          return { endDateLessThanStartDate: true };
        }
      }
    }
    return null;
  };
}