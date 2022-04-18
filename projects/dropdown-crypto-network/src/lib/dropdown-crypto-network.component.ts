import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
export interface IOptionsList<T> {
  items: T[];
}
@Component({
  selector: 'lib-dropdown-crypto-network',
  templateUrl:'./dropdown-crypto-network.component.html',
  styleUrls: ['./dropdown-crypto-network.component.scss'
  ]
})
export class DropdownCryptoNetworkComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void{

    if(changes.selectedItem?.currentValue){

      this.selectedItem = this.list.items[0];
      console.log('this.selectedItem',this.selectedItem);
    }
  }

}
