import { Pipe, PipeTransform } from '@angular/core';

/**
 * @name CapitalizePhrasePipe
 * @desc Capitalize the first letter of a string.
 */
@Pipe({
  name: 'capitalizePhrase'
})
export class CapitalizePhrasePipe implements PipeTransform {

  /**
   * Implementation of the PipeTransform's transform method.
   * @param value 
   * @returns {string} With the first letter only upper cased.
   */
  transform(value: string): string {
    if (!value) return value;
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
  }

}
