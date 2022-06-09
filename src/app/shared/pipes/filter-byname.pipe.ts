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
    return items.filter((item) => {
      let cond1 =
        (!!item.name &&
          item.name?.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
        false;
      let cond2 =
        (!!item.contract &&
          item.contract?.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
        false;
      let cond3 =
        (!!item.tokenAddress &&
          item.tokenAddress?.toLowerCase().indexOf(filter.toLowerCase()) !==
            -1) ||
        false;
      let cond = cond1 || cond2 || cond3;
      return cond;
    });
  }
}
