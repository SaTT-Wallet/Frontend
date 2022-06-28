import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CookieManager {
  getItem(cookies, sKey): any {
    if (!sKey) {
      return null;
    }
    return (
      decodeURIComponent(
        cookies.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
              encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    );
  }

  setItem(cookies, sKey, sValue, vEnd?, sPath?, sDomain?, bSecure?): string {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return cookies;
    }
    let sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd;
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + vEnd.toUTCString();
          break;
      }
    }
    return (
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '')
    );
  }

  removeItem(cookies, sKey, sPath?, sDomain?): string {
    if (!this.hasItem(cookies, sKey)) {
      return cookies;
    }
    return (
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '')
    );
  }

  hasItem(cookies, sKey): boolean {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    return new RegExp(
      '(?:^|;\\s*)' +
        encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
        '\\s*\\='
    ).test(cookies);
  }

  keys(cookies) {
    const aKeys = cookies
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  }
}
