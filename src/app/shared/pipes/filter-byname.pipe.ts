import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByname',
  pure: false
})
export class FilterBynamePipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(
      (item) => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    );
  }
}
