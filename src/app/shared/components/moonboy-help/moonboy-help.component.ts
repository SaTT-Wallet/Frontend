import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-moonboy-help',
  templateUrl: './moonboy-help.component.html',
  styleUrls: ['./moonboy-help.component.scss']
})
export class MoonboyHelpComponent implements OnInit {
  @Input() pageName = '';
  @Input() customTextEnabled = false;
  @Input() customText = '';

  constructor() {}

  ngOnInit(): void {}
}
