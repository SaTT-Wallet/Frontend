import { ItemsListDirective } from './items-list.directive';
import {TemplateRef} from "@angular/core";

describe('ItemsListDirective', () => {
  it('should create an instance', () => {
    const directive = new ItemsListDirective();
    expect(directive).toBeTruthy();
  });
});
