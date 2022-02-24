import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CguRoutingModule } from './cgu-routing.module';
import { SharedModule } from '@shared/shared.module';
import { CguComponent } from './cgu.component';


@NgModule({
  declarations: [CguComponent],
  imports: [
    SharedModule,
    CguRoutingModule
  ]
})
export class CguModule { }
