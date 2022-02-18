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
      let valueToReturn: any;
      let bigValue = new Big(value);
      if (bigValue.div(1).toNumber() === 0) {
        return '0';
      } else if (bigValue.gte(0) && bigValue.lte(0.1)) {
        valueToReturn = bigValue.toFixed(8);
        if (valueToReturn % 1 !== 0) {
          return parseFloat(valueToReturn + '') + '';
        }
        return valueToReturn;
      } else if (bigValue.gte(0.1) && bigValue.lte(1.9)) {
        valueToReturn = bigValue.toFixed(6);
        if (valueToReturn % 1 !== 0) {
          return parseFloat(valueToReturn + '') + '';
        }
        return bigValue.toFixed(6);
      } else if (bigValue.gte(2) && bigValue.lte(9.9999)) {
        valueToReturn = bigValue.toFixed(4);
        if (valueToReturn % 1 !== 0) {
          return parseFloat(valueToReturn + '') + '';
        }
        return bigValue.toFixed(4);
      } else if (bigValue.gte(10) && bigValue.lte(9999.99)) {
        if (modeCryptoList) {
          valueToReturn = Number(bigValue.toFixed(2));
          if (valueToReturn % 1 !== 0) {
            valueToReturn = parseFloat(valueToReturn + '') + '';
            return formatNumber(valueToReturn, this.locale, '0.0-2');
          }

          return formatNumber(
            Number(bigValue.toFixed(2)),
            this.locale,
            '0.0-2'
          );
        } else {
          valueToReturn = bigValue.toFixed(2);
          if (valueToReturn % 1 !== 0) {
            return parseFloat(valueToReturn + '') + '';
          }

          return bigValue.toFixed(2);
        }
      } else if (bigValue.gte(10000)) {
        if (modeCryptoList) {
          let val: any = formatNumber(
            bigValue.toNumber(),
            this.locale,
            '0.0-2'
          );
          if (bigValue.toNumber() % 1 !== 0) {
            val = parseFloat(bigValue.toNumber() + '');
            return formatNumber(val, this.locale, '0.0-2');
          }
          return val;
        }
        valueToReturn = bigValue.toFixed(2);
        if (valueToReturn % 1 !== 0) {
          return parseFloat(valueToReturn + '') + '';
        }
        return bigValue.toFixed(2);
      }
    }
    return value;
  }
}
