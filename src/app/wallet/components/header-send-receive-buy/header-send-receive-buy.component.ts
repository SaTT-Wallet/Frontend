import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-send-receive-buy',
  templateUrl: './header-send-receive-buy.component.html',
  styleUrls: ['./header-send-receive-buy.component.scss']
})
export class HeaderSendReceiveBuyComponent implements OnInit {
  @Input() title: string = '';
  @Output() clickedBack: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  back() {
    this.clickedBack.emit(true);
  }
}
