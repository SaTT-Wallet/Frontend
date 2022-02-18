import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multi-range-slider',
  templateUrl: './multi-range-slider.component.html',
  styleUrls: ['./multi-range-slider.component.scss']
})
export class MultiRangeSliderComponent implements OnInit {
  constructor() {}
  budget: any;
  @Output() budgetValue = new EventEmitter();

  ngOnInit(): void {}

  onSliderChange(event: number[]) {
    const budgetRange = {
      [event[0] + '-' + event[1]]: event[0] + '-' + event[1]
    };
    setTimeout(() => {
      budgetRange === this.budget && this.budgetValue.emit(budgetRange);
    }, 2000);
    this.budget = budgetRange;
  }
}
