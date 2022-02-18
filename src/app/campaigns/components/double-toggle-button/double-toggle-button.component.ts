import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-double-toggle-button',
  templateUrl: './double-toggle-button.component.html',
  styleUrls: ['./double-toggle-button.component.scss']
})
export class DoubleToggleButtonComponent implements OnInit {
  @Output() toggleValue = new EventEmitter();
  left = true;
  right = true;
  contentIsImg = false;

  constructor() {}

  ngOnInit(): void {}

  toggleLeft() {
    this.left = !this.left;
    this.toggleValue.emit(this.getToggleValue());
  }

  toggleRight() {
    this.right = !this.right;
    this.toggleValue.emit(this.getToggleValue());
  }

  getToggleValue(): string {
    if (this.right && this.left) {
      return 'both';
    } else if (this.right && !this.left) {
      return 'right';
    } else if (!this.right && this.left) {
      return 'left';
    } else {
      return 'none';
    }
  }
}
