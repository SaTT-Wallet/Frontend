import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appItemsList]'
})
export class ItemsListDirective {

  constructor(readonly tpl?: TemplateRef<any[]>) { }

}
