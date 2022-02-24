import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionDirective } from './option.directive';
import { ResetBtnDirective } from './reset-btn.directive';

type OptionType = string | number | null | { [key: string]: string | number };

export interface ResetBtnTplContext {
  $implicit: () => void;
  isControlEmpty: boolean;
}

export interface OptionTplContext {
  $implicit: IOption;
  onSelectedOptionChange: (event: Event) => void;
  value: OptionType;
  selected: boolean;
  index: number;
}

export interface IOption {
  value: OptionType;
  text?: string;
  iconUrl?: string;
  selectedIconUrl?: string;
  bgColor?: string; // will be applied when option is selected
}

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
  // queries: {
  // 	IOption: new ViewChild( "IOption" ),
  // },
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {
  @ContentChild(ResetBtnDirective, { static: true })
  resetBtnDir?: ResetBtnDirective;
  @ContentChild(OptionDirective, { static: true })
  optionDir?: OptionDirective;

  @ViewChildren('checkboxesWrapper')
  checkboxesWrapper?: QueryList<ElementRef>;

  @Input() multiOptions: boolean = false; // by default only one option is allowed
  @Input() options?: IOption[];
  controlValue: Set<IOption> | IOption = new Set();
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    //console.log("init select", this.options);
  }

  get resetBtnTpl(): TemplateRef<ResetBtnTplContext> {
    return this.resetBtnDir?.tpl as TemplateRef<ResetBtnTplContext>;
  }
  get resetBtnTplContext(): ResetBtnTplContext {
    return {
      $implicit: () => this.reset(),
      isControlEmpty: this.isControlEmpty()
    };
  }
  get optionTpl(): TemplateRef<OptionTplContext> {
    return this.optionDir?.tpl as TemplateRef<OptionTplContext>;
  }

  isControlEmpty(): boolean {
    if (this.multiOptions) {
      return (this.controlValue as Set<IOption>).size === 0;
    } else {
      return (this.controlValue as IOption).value === null;
    }
  }

  getOptionTplContext(option: IOption, index: number): OptionTplContext {
    return {
      $implicit: option,
      onSelectedOptionChange: (event) =>
        this.onSelectedOptionChange(option, event),
      value: option.value,
      selected: this.isOptionSelected(option),
      index: index
    };
  }

  writeValue(value: any): void {
    // console.log('before setting >> ', value);
    if (!value) {
      this.reset();
    }

    // TODO: write value when it's not empty
    //  else {
    //   if(this.multiOptions) {
    //     value.forEach((entry: any) => {
    //       (this.controlValue as Set<IOption>).add(entry)
    //     })
    //     this.cdRef.markForCheck();
    //   } else {
    //     this.controlValue = value
    //   }
    // }

    // console.log('after setting >> ', this.controlValue);
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

  onSelectedOptionChange(option: IOption, event: Event) {
    if (this.multiOptions) {
      if ((event.target as HTMLInputElement)?.checked) {
        (this.controlValue as Set<IOption>).add(option);
      } else if ((event.target as HTMLInputElement)?.checked === false) {
        (this.controlValue as Set<IOption>).delete(option);
      }

      this.onChange(
        [...(this.controlValue as Set<IOption>)].map((option) => option.value)
      );
    } else {
      if ((event.target as HTMLInputElement)?.checked) {
        this.controlValue = option;
      } else {
        this.controlValue = { value: null } as IOption;
      }

      this.onChange(this.controlValue.value);
    }
  }

  isOptionSelected(option: IOption): boolean {
    if (this.multiOptions) {
      return !![...(this.controlValue as Set<IOption>)].find(
        (op) => op.value === option.value
      );
    } else {
      return (this.controlValue as IOption).value === option.value;
    }
  }

  reset() {
    this.checkboxesWrapper?.forEach((element: ElementRef<HTMLDivElement>) => {
      element.nativeElement.querySelector('input')!.checked = false;
    });
    this.cdRef.markForCheck();
    if (this.multiOptions) {
      this.controlValue = new Set();
      this.onChange([]);
    } else {
      this.controlValue = { value: null };
      this.onChange(null);
    }
  }
}
