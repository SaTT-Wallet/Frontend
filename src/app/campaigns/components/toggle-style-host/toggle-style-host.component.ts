import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type DisplayItemsStyle = 'grid' | 'list';
@Component({
  selector: 'app-toggle-style-host',
  templateUrl: './toggle-style-host.component.html',
  styleUrls: ['./toggle-style-host.component.scss']
})
export class ToggleStyleHostComponent implements OnInit {
  @Output() isFormatGrid = new EventEmitter();
  @Input() displayItems: DisplayItemsStyle = 'grid';

  constructor() {}

  ngOnInit(): void {}
  showFormatGrid() {
    this.isFormatGrid.emit(true);
  }
  showFormatList() {
    this.isFormatGrid.emit(false);
  }
}
