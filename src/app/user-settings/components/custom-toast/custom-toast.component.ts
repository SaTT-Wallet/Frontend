import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-toast',
  template: `
    <div class="custom-toast">
      <img class="toast-icon" [src]="data.icon" alt="Icon">
      <span class="toast-message">Error<br/>{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .custom-toast {
      background-color: white; /* Background color */
      color: black; /* Text color */
      display: flex;
      align-items: center;
      border: none; /* Remove the border */
    }

    .custom-toast .toast-icon {
      margin-right: 8px;
      height: 24px;
      width: 24px;
    }

    .toast-message {
      color: black !important;
      font-size: small
    }
    
  `]
})
export class CustomToastComponent  {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

 

}
