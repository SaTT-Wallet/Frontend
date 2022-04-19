import { formatNumber } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { Big } from 'big.js';
@Pipe({
  name: 'formatDigits'
})
@Injectable({
  providedIn: 'root'
})
export class FormatDigitsPipe implements PipeTransform {

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
        return bigValue.toString()
      }
    }
    return value;
  }

}
