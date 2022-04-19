import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomDropDownComponent } from './components/custom-dropdown/custom-dropdown.component';
import { FormatDigitsPipe } from './pipes/format-digits.pipe';



@NgModule({
  declarations: [
    CustomDropDownComponent,
    FormatDigitsPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomDropDownComponent,
    FormatDigitsPipe
  ]
})
export class AtayenUiModule { }
