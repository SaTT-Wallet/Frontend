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

  if(!d) {
    return null
  }
  if (Date.parse(d)) {
    let date = new Date(d)
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
