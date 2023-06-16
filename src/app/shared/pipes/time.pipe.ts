import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: any): string {
    const currentDate = new Date();
    const endDate = new Date(value);

    const diffInMs = endDate.getTime() - currentDate.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHrs = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHrs / 24);

    if (diffInDays > 0) {
        return `${diffInDays} day(s) left`;
    } else if (diffInHrs > 0) {
        return `${diffInHrs} hour(s) left`;
    } else if (diffInMins > 0) {
        return `${diffInMins} minute(s) left`;
    } else if (diffInSecs > 0) {
        return `${diffInSecs} second(s) left`;
    } else {
        return `Time's up`;
    }
}

}
