import {
  Injectable,
  Pipe,
  PipeTransform,
  Inject,
  LOCALE_ID
} from '@angular/core';
import { formatNumber } from '@angular/common';
import { Big } from 'big.js';

/**
 * @name showNumbersRule
 * @desc This pipe apply a rule to show numbers
 */
@Pipe({
  name: 'showNumbersRule'
})
@Injectable({
  providedIn: 'root'
})
export class ShowNumbersRule implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public locale: string) {}
  /**
   * Implementation of the PipeTransform's transform method.
   * @param value
   */
  transform(value: string, modeCryptoList?: boolean): string {
    if (value) {
      const bigValue = isNaN(+value) ? new Big(0) : new Big(value);
      if (bigValue.div(1).toNumber() === 0) {
        return '0';
      } else {
        const numberRules = [
          { range: [0, 0.1], precision: 8 },
          { range: [0.1, 1.9], precision: 6 },
          { range: [2, 9.9999], precision: 4 },
          { range: [10, 9999.99], precision: 2 },
          { range: [10000, Infinity], precision: 2 }
        ];
        for (const rule of numberRules) {
          if(rule.range[0] === 10000) {
            if(bigValue.gte(rule.range[0])) {
              if(modeCryptoList) return this.handleFixedValue(bigValue, rule.precision)
              return this.handleFormattedValue(bigValue, '0.0-2')
            }
          } else {
            if(bigValue.gte(rule.range[0]) && bigValue.lte(rule.range[1])) {
              if(rule.range[0] === 10) {
                if(modeCryptoList) {
                  return this.handleFixedValue(bigValue, rule.precision)
                } else return this.handleFormattedValue(bigValue, '0.0-2')
              } else {
                if(modeCryptoList) {
                  return this.handleFixedValue(bigValue, rule.precision)
                } else return this.handleFormattedValue(bigValue, '0.0-2')
                
              }
            }
          }
        }
      }
    }
    return value;
  }



  handleFixedValue(bigValue: any, precision: number): string {
    const valueToReturn = bigValue.toFixed(precision);
    return valueToReturn;
  }
  
  handleFormattedValue(bigValue: any, format: string): string {
    const valueToReturn = formatNumber(bigValue, this.locale,format);
    return valueToReturn;
  }
}
