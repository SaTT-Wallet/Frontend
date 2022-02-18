import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AideCampagneComponent } from './aide-campagne.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [AideCampagneComponent],
  imports: [
    SharedModule,
  ]
})
export class FaqModule { }
