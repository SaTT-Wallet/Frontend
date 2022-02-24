import {
  isPlatformBrowser,
  isPlatformServer,
  isPlatformWorkerApp
} from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

export const enum EPlatformType {
  BROWSER,
  SERVER,
  WORKER
}

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private _platform: EPlatformType = EPlatformType.BROWSER;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this._platform = EPlatformType.BROWSER;
    }
    if (isPlatformServer(this.platformId)) {
      this._platform = EPlatformType.SERVER;
    }
  }

  get platform(): EPlatformType {
    return this._platform;
  }
}
