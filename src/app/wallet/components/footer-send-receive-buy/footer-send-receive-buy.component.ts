import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-send-receive-buy',
  templateUrl: './footer-send-receive-buy.component.html',
  styleUrls: ['./footer-send-receive-buy.component.scss']
})
export class FooterSendReceiveBuyComponent implements OnInit {
  @Input() pageName: string = '';
  constructor() {}

  ngOnInit(): void {}
}
