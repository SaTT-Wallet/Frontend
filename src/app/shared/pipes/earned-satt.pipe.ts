import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'earnedSatt'
})
export class EarnedSattPipe implements PipeTransform {

  transform(value: number): string {
    if (!value || value === 0) return "0";

    return ""
  }

}
