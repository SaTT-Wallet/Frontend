import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-send-receive-buy',
  templateUrl: './header-send-receive-buy.component.html',
  styleUrls: ['./header-send-receive-buy.component.scss']
})
export class HeaderSendReceiveBuyComponent implements OnInit {
  @Input() title: string = '';
  @Output() clickedBack: EventEmitter<boolean> = new EventEmitter();
  constructor(  private router: Router,
    ) {}

  ngOnInit(): void {}
  back() {
    this.router.navigate(['/wallet']);
    //this.clickedBack.emit(true);
  }
}
