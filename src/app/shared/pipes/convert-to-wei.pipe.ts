import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ListTokens } from '@config/atn.config';
import { Big } from 'big.js';

/**
 * @name ConvertToWeiPipe
 * @desc This pipe will convert amounts in SaTT to Wei format.
 *       Using Big.js library to deal with big decimal numbers.
 */
@Pipe({
  name: 'sattToWei'
})
@Injectable({
  providedIn: 'root'
})
export class ConvertToWeiPipe implements PipeTransform {
  /**
   * Implementation of the PipeTransform's transform method.
   * @param value
   * @param digits Number of digits you want to display after the period.
   * @returns {string} the converted value in Wei format.
   */
  transform(value: string, symbol: string, digits: number = 0): string {
    if (!value) return value;

    let decimals = ListTokens[symbol]?.decimals.toString();
    return new Big(value).times(decimals).toFixed(digits).toString();
  }
}
