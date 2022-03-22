import { isPlatformBrowser } from '@angular/common';
import { Directive, HostListener, Inject, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    if (isPlatformBrowser(this.platformId)) e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    if (isPlatformBrowser(this.platformId)) e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    if (isPlatformBrowser(this.platformId)) e.preventDefault();
  }
}
