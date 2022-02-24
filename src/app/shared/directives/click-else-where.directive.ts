import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Output,
  PLATFORM_ID
} from '@angular/core';

@Directive({
  selector: '[appClickElseWhere]'
})
/**
 * This directive when it's added to a dropdown will
 * close the dropdown when clicked elsewhere in the document
 */
export class ClickElseWhereDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  @HostListener('document:click', ['$event'])
  public onClick(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      event.stopPropagation();
      const clickedInside = this.elementRef.nativeElement.contains(
        event.target
      );
      if (!clickedInside) {
        //console.log("outside click xx");
        this.clickOutside.emit();
      }
    }
  }
}
