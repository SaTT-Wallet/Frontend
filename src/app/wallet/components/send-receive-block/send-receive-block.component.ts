import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-send-receive-block',
  templateUrl: './send-receive-block.component.html',
  styleUrls: ['./send-receive-block.component.css']
})
export class SendReceiveBlockComponent {

  // @Output()
  // onSendClick = new EventEmitter();

  // @Output()
  // onReceiveClick = new EventEmitter();

  constructor(private translateService: TranslateService) { }

  // onSend() {
  //   this.onSendClick.emit();
  // }

  // onReceive() {
  //   this.onReceiveClick.emit();
  // }

}
