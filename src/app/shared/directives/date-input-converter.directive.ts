import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * By default input type=date take a string with format 'yyyy-dd-mm', and to be able for our application
 * to read/write values to input we need to convert to/from this format.
 * This directive will wrap the native html5 input date and allow us to take advantage of angular forms.
 * Example usage: <input type=date [formControl]="birthDate" />
 */
@Directive({
  selector: 'input[type=date][ngModel], input[type=date][formControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputConverterDirective),
      multi: true
    }
  ]
})
export class DateInputConverterDirective implements ControlValueAccessor {
  @HostListener('blur', []) onTouched: any = () => {};
  @HostListener('input', ['$event']) onChange: any = () => {};

  private valueType: 'value' | 'valueAsDate' = 'value';

  constructor(private renderer?: Renderer2, private elementRef?: ElementRef) {}

  writeValue(value: Date | string): void {
    this.valueType = typeof value === 'string' ? 'value' : 'valueAsDate';
    if (!this.renderer || !this.elementRef) {
      return;
    }
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      this.valueType,
      value
    );
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = (event: any) => fn(event.target[this.valueType]);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
