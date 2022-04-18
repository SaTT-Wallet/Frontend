import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomDropDownComponent } from './components/custom-dropdown/custom-dropdown.component';



@NgModule({
  declarations: [
    CustomDropDownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomDropDownComponent
  ]
})
export class AtayenUiModule { }
