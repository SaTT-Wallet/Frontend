import { Directive, TemplateRef } from '@angular/core';
import { ResetBtnTplContext } from './multi-select.component';

@Directive({
  selector: '[appResetBtn]'
})
export class ResetBtnDirective {

  constructor(readonly tpl?: TemplateRef<ResetBtnTplContext>) { }

}
