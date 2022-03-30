import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type="number"]'
})
export class WheelMouseDirective {
  @HostListener('wheel', ['$event'])
  onWheel(event: Event) {
    event.preventDefault();
  }
}
