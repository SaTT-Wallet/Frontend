import { sandboxOf } from 'angular-playground';
import { MultiSelectComponent } from './multi-select.component';

export default sandboxOf(MultiSelectComponent)
  .add('default', {
    template: `<app-multi-select></app-multi-select>`
  });
