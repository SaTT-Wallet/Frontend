import {
  Component,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter,
} from '@angular/core';

export interface IOptionsList<T> {
  items: T[];
}
@Component({
  selector: 'lib-custom-dropdown',
  templateUrl:'./custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'
  ]
})
export class CustomDropDownComponent implements OnInit {
  @Output() onSelect = new EventEmitter();
  @Input() list: IOptionsList<any> = { items: [] };
  @Input() itemsTemplateRef?: TemplateRef<any>;
  @Input() buttonTextTemplateRef?: TemplateRef<any>;
  selectedItem = 'Click here!';

  constructor() {}

  ngOnInit(): void {
    this.selectedItem = this.list.items[0];
  }

  onSelectItem(item: any) {
    this.onSelect.emit(item);
    this.selectedItem = item;
  }

}
