import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-loading-logo',
  templateUrl: './loading-logo.component.html',
  styleUrls: ['./loading-logo.component.css']
})
export class LoadingLogoComponent {

  @Input()
  @HostBinding('class.fullscreen')
  fullScreen = false

  constructor() { }

}
