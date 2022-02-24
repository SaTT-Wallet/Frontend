import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

class LocalStorage implements Storage {
  [name: string]: any;
  readonly length!: number;
  clear(): void {}
  getItem(key: string): string | null {
    return null;
  }
  key(index: number): string | null {
    return null;
  }
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}

@Injectable({ providedIn: 'root' })
export class LocalStorageRefService implements Storage {
  private _localStorage: Storage;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    if (isPlatformBrowser(this.platformId)) {
      this._localStorage = localStorage;
    } else {
      this._localStorage = new LocalStorage();
    }
  }
  [name: string]: any;
  length!: number;
  clear(): void {
    this._localStorage.clear();
  }
  getItem(key: string): string | null {
    return this._localStorage.getItem(key);
  }
  key(index: number): string | null {
    return this._localStorage.key(index);
  }
  removeItem(key: string): void {
    return this._localStorage.removeItem(key);
  }
  setItem(key: string, value: string): void {
    return this._localStorage.setItem(key, value);
  }
}
