import { Injectable, Pipe, PipeTransform } from "@angular/core";
import Big from "big.js";
import { ListTokens } from "@config/atn.config";

/**
 * @name ConvertFromWei
 * @desc This pipe when it's applied will convert from
 *       Wei to your chosen currency using Big.js library.
 */
@Pipe({
  name: "fromWeiTo",
})
@Injectable({
  providedIn: "root",
})
export class ConvertFromWei implements PipeTransform {
  /**
   * Implementation of the PipeTransform's transform method.
   * @param value
   * @param digits Number of digits you want to display after the period.
   * @returns {string} the converted value in SaTT format.
   */
  transform(value: string, symbol: string, digits: number = 3): string {
    console.log(value, symbol)
    if (!value || value === "0") return '0';

    let decimals = ListTokens[symbol].decimals.toString();
    if(value==="SATTBEP20"){
      value="SATT"
    }
 return new Big(value).div(decimals).round(digits).toString();
  }
}
