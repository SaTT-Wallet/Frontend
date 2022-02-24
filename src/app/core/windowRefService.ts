/*
 * This code snippet is based on
 * https://juristr.com/blog/2016/09/ng2-get-window-ref/
 */
import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {
  get nativeWindow(): Window {
    return getWindow();
  }
}
