import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Custom dropdown filter form control Component.
 * Use this component to integrate custom form control
 * for your filter, you can declared as a normal FormControl
 * and give it the options you want to filter on.
 * By default multi option selection is set to false,
 * activate multi option selection by setting multiOptions to true.
 */
@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true
    }
  ]
})
export class CustomDropdownComponent implements OnInit, ControlValueAccessor {
  @ViewChild('checkboxLabel') checkboxLabel?: ElementRef;
  @ViewChildren('checkboxes') checkboxes?: QueryList<ElementRef>;

  @Input() options: any = '';
  @Input() inputCheckBoxId: string = '';
  @Input() isDropdownOpen: boolean = false;
  @Input() multiOptions: boolean = false; // by default only one option is allowed

  selectedOption: any = '';
  selectedOptions: { [key: string]: boolean | null } = {};

  onChange!: (_: any) => {};
  onTouched!: () => {};

  constructor() {}

  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }

  /**
   * Close dropdown after option selected
   */
  onCheckboxChange() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Implementation of ControlValueAccessor interface
   * @param value
   */
  writeValue(value: any): void {
    if (this.multiOptions) {
      this.selectedOptions = {};
      this.checkboxes?.forEach((element) => {
        element.nativeElement.checked = false;
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
  changeSelectedOptions(option: any) {
    if (this.multiOptions) {
      this.selectedOptions[option.value] = !this.selectedOptions[option.value];
    } else {
      this.selectedOptions = {};
      this.selectedOptions[option.value] = !this.selectedOptions[option.value];
      this.isDropdownOpen = false;
      this.selectedOption = option;
    }

    this.onChange(this.selectedOptions);
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
}
