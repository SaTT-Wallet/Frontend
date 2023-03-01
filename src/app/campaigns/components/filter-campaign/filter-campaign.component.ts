import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { values } from 'lodash';

@Component({
  selector: 'app-flat-select',
  templateUrl: './filter-campaign.component.html',
  styleUrls: ['./filter-campaign.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlatSelectComponent),
      multi: true
    }
  ]
})
export class FlatSelectComponent implements OnInit, ControlValueAccessor {
  @ViewChild('checkboxLabel') checkboxLabel?: ElementRef;
  @ViewChildren('checkboxes') checkboxes?: QueryList<ElementRef>;

  @Input() options: any = '';
  @Input() inputCheckBoxId: string = '';
  @Input() isDropdownOpen: boolean = false;
  @Input() multiOptions: boolean = false; // by default only one option is allowed

  @Input() filterRemaining: boolean = false;
  @Input() multiOptionsCond: boolean = false;
  @Input() filterParticipation: boolean = false;

  @Output() onReset: EventEmitter<any> = new EventEmitter<any>();
  selectedOption: any = '';
  selectedOptions: { [key: string]: boolean | null } = {};
  selectedOptionsCondtion = [];
  //selectedOptionsCondtion: Set<string | number> = new Set<string | number>();
  setAll: boolean = true;
  onChange!: (_: any) => {};
  onTouched!: () => {};

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }



  /**
   * Implementation of ControlValueAccessor interface
   * @param value
   */
  writeValue(value: any): void {
    if (this.multiOptions) {
      this.selectedOptions = {};
      this.checkboxes?.forEach((element) => {
       this.renderer.setProperty(element.nativeElement,'checked',false) //.checked = false;
      });
    } else if (this.multiOptionsCond) {
      this.selectedOptionsCondtion = [];
      // this.selectedOptionsCondtion = new Set();
      this.checkboxes?.forEach((element) => {
        //element.nativeElement.checked = false;
        this.renderer.setProperty(element.nativeElement,'checked',false)
      });
    } else {
      this.selectedOption = value;
    }
  }

  /**
   * Implementation of ControlValueAccessor interface
   * @param fn
   */
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  /**
   * Implementation of ControlValueAccessor interface
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Sets the selected values and update the selected option
   * @param option
   */
  changeSelectedOptions(event: any, option: any) {
    if (this.multiOptions) {
      if (event.target.checked) {
        this.selectedOptions[option.value] = option.value;
      } else {
        delete this.selectedOptions[option.value];
      }
      this.onChange(this.selectedOptions);
    }
    // else if(this.multiOptionsCond){
    //   this.selectedOptionsCondtion[option.value] = this.selectedOptionsCondtion[option.value];
    //   this.onChange(this.selectedOptionsCondtion);

    //   this.selectedOptionsCondtion.delete('all')
    //   if(option.value==="all"){
    //     this.selectedOptionsCondtion.add('add');
    //   }
    //   if(this.selectedOptionsCondtion.has('all')){
    //    this.selectedOptionsCondtion.delete("finished");
    //    this.selectedOptionsCondtion.delete("draft");
    //    this.selectedOptionsCondtion.delete("active");
    //  //  this.selectedOptionsCondtion[option.value] = this.selectedOptionsCondtion[option.value];

    //    }else{
    //     this.selectedOptionsCondtion.delete('all');
    //     //this.selectedOptionsCondtion[option.value] = !this.selectedOptionsCondtion[option.value];

    //    }
    //    console.log('this.selectedOptionsCondtion.values(', this.selectedOptionsCondtion.entries())
    //   this.onChange([...this.selectedOptionsCondtion.values()]);
    //  }
    else {
      // this.isDropdownOpen = false;
      this.selectedOption = option.value;
      this.onChange(this.selectedOption);
    }
  }

  /**
   * Returns true if no option is selected.
   * @Returns boolean
   */
  showDefaultMessage(): boolean {
    return (
      Object.values(this.selectedOptions).filter((option) => option).length ===
      0
    );
  }

  /**
   * Returns option text when it's provided as array of objects in component params.
   * @param value
   * @returns string
   */
  getOptionText(value: string): string {
    return (
      this.options.filter((object: any) => object.value === value)[0]?.text ||
      ''
    );
  }

  resetFilter() {
    this.onReset.emit();
    this.setAll = true;
    // this.selectedOptionsCondtion=[]
    // this.onChange(this.selectedOptionsCondtion);
  }

  trackByValue(index: any, option: any) {
    return option?.value;
  }
}
