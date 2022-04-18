import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownCryptoNetworkComponent } from './dropdown-crypto-network.component';



@NgModule({
  declarations: [
    DropdownCryptoNetworkComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownCryptoNetworkComponent
  ]
})
export class DropdownCryptoNetworkModule { }
