import { Directive, TemplateRef } from '@angular/core';
import { OptionTplContext } from './multi-select.component';

@Directive({
  selector: '[appOption]'
})
export class OptionDirective {

  constructor(readonly tpl?: TemplateRef<OptionTplContext>) { }

}
