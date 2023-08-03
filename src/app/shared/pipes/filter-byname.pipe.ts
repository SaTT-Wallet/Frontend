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
      let cond0 = (!!item.symbol &&
        item.symbol?.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
      false;
      let cond1 =
        (!!item.name &&
          item.name?.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
        false;
      let cond2 =
        (!!item.contract &&
          filter.indexOf('0x') >= 0 &&
          item.contract?.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
        false;
      let cond3 =
        (!!item.tokenAddress &&
          filter.indexOf('0x') >= 0 &&
          item.tokenAddress?.toLowerCase().indexOf(filter.toLowerCase()) !==
            -1) ||
        false;
        let cond4 =
        (!!item.cryptoBEP20?.contract &&
          filter.indexOf('0x') >= 0 &&
          item.cryptoBEP20.contract?.toLowerCase().indexOf(filter.toLowerCase()) !==
            -1) ||
        false;
        let cond5 =
        (!!item.cryptoPOLYGON?.contract &&
          filter.indexOf('0x') >= 0 &&
          item.cryptoPOLYGON.contract?.toLowerCase().indexOf(filter.toLowerCase()) !==
            -1) ||
        false;
      let cond = cond0 || cond1 || cond2 || cond3 || cond4 || cond5;
      return cond;
    });
  }
}
