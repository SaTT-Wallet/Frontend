import { Component, OnInit,ViewChild } from '@angular/core';
 
@Component({
  selector: 'app-draft-maximum-participation',
  templateUrl: './draft-maximum-participation.component.html',
  styleUrls: ['./draft-maximum-participation.component.css']
})
export class DraftMaximumParticipationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  inputValue: string = '';
  @ViewChild('toggleSwitch', { static: true }) toggleSwitch: any;
  onInputChanged() {
    if (!this.toggleSwitch.checked && this.inputValue.trim() !== '') {
      this.inputValue = '';
    }
  }
}
