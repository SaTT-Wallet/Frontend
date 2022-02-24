import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NotificationComponent } from './notification.component';



@NgModule({
  declarations: [ NotificationComponent],
  imports: [
    SharedModule
  ]
})
export class NotificationsModule { }
