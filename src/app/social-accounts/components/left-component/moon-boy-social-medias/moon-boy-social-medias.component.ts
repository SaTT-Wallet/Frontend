import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-moon-boy-social-medias',
  templateUrl: './moon-boy-social-medias.component.html',
  styleUrls: ['./moon-boy-social-medias.component.scss']
})
export class MoonBoySocialMediasComponent implements OnInit, OnChanges {
  @Input() percentNet2: any;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {}
}
