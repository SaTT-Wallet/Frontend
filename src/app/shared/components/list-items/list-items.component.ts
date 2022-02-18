import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { ItemsListDirective } from "./items-list.directive";

@Component({
  selector: "app-list-items",
  templateUrl: "./list-items.component.html",
  styleUrls: ["./list-items.component.scss"],
})
export class ListItemsComponent {
  @Input()
  throttle = 0;
  @Input()
  distance = 2;
  @Input()
  infiniteScrollContainer = '.center-content';
  @Input()
  fromRoot = false;
  @Output()
  onEndPageScroll: EventEmitter<any> = new EventEmitter();

  @ContentChild(ItemsListDirective, { static: true })
  itemsListDir?: ItemsListDirective;

  get itemsListTpl(): TemplateRef<any[]> {
    return this.itemsListDir?.tpl as TemplateRef<any[]>;
  }

  onScroll() {
    this.onEndPageScroll.emit();
  }
}
