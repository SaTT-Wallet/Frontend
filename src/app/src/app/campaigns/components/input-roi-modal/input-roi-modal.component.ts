import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-roi-modal',
  templateUrl: './input-roi-modal.component.html',
  styleUrls: ['./input-roi-modal.component.scss']
})
export class InputRoiModalComponent implements OnInit {
  @Input() icon: any;
  @Input() text: any;
  constructor() {}

  ngOnInit(): void {
 
    
    
  }
}
