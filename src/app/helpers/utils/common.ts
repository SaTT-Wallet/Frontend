/*
=========================================================
=========================================================
===                                                   ===
===   This file contains common utility functions     ===
===   that get called where ever we need them         ===
===   in our code base.                               ===
===   Feel free to add any utility function that      ===
===   you think it's used in many places and by       ===
===   adding them to this file will keep them DRY!!   ===
===                                                   ===
=========================================================
=========================================================
*/

/**
 * Takes a value and parse it to date object
 * @param d
 * @returns {Date | undefined} a date object
 */
export function getDateObjectFrom(d: any, isEndDate?: boolean): Date | null {
  if (!d) {
    return null;
  }
  if (Date.parse(d)) {
    let date = new Date(d);
    return date;
  }
  return createDateFromUnixTimestamp(d);
}

/**
 * Creates a date object from a unix timestamp.
 * @param unixTimestamp
 * @returns {Date} a Date object.
 */
export function createDateFromUnixTimestamp(
  unixTimestamp: number | string
): Date {
  return new Date(+unixTimestamp * 1000);
}

// fixing crypto decimals to 9
export function filterAmount(input: any, nbre: any = 10) {
  if (input) {
    var out = input;
    let size = input.length;
    let toAdd = parseInt(nbre) - parseInt(size);

    if (input === 0) {
      toAdd--;
    }
    if (toAdd > 0) {
      if (input.includes('.')) {
        for (let i = 0; i < toAdd; i++) {
          out += '0';
        }
      } else {
        out += '.';
        for (let i = 0; i < toAdd; i++) {
          out += '0';
        }
      }
    } else if (toAdd < 0) {
      if (input.includes('.')) {
        if (input.split('.')[0].length > nbre) {
          out = input.substring(0, nbre);
        } else {
          out = input.substring(0, nbre);
          if (out[nbre - 1] === '.') {
            out = input.substring(0, nbre - 1);
          }
        }
      }
    }
    return out;
  } else {
    return '-';
  }
}
