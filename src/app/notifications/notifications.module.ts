import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NotificationComponent } from './notification.component';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ToastrModule } from 'ngx-toastr';
import { NgxTweetModule } from 'ngx-tweet';

@NgModule({
  declarations: [NotificationComponent],
  imports: [ShareButtonsModule, ShareIconsModule, SharedModule,NgxTweetModule, ToastrModule.forRoot()]
})
export class NotificationsModule {}
