import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NotificationComponent } from './notification.component';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';

@NgModule({
  declarations: [NotificationComponent],
  imports: [ShareButtonsModule, ShareIconsModule, SharedModule]
})
export class NotificationsModule {}
