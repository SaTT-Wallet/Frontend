import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(value: any): string {
    const currentDate = new Date();
    const endDate = new Date(value);

    const diffInMs = endDate.getTime() - currentDate.getTime();

    const timeUnits = [
      {
        name: 'AllCampains.campaign_ends_in_days',
        milliseconds: 24 * 60 * 60 * 1000
      },
      {
        name: 'AllCampains.campaign_ends_in_hours',
        milliseconds: 60 * 60 * 1000
      },
      { name: 'AllCampains.campaign_ends_in_minutes', milliseconds: 60 * 1000 },
      { name: 'AllCampains.campaign_ends_in_seconds', milliseconds: 1000 }
    ];

    for (const unit of timeUnits) {
      const timeDiff = Math.floor(diffInMs / unit.milliseconds);
    
      if (timeDiff > 0) {
        return `${timeDiff} ${this.translate.instant(unit.name)}${
          timeDiff > 1 ? 's' : ''
        } ${this.translate.instant('time.left')}`;
      }
    }

    return this.translate.instant('AllCampains.times_up');
  }
}
