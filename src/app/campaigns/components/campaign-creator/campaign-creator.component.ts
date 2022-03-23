import { Component, OnInit, Input } from '@angular/core';
import { socialMedia } from '@config/atn.config';

@Component({
  selector: 'app-campaign-creator',
  templateUrl: './campaign-creator.component.html',
  styleUrls: ['./campaign-creator.component.css']
})
export class CampaignCreatorComponent implements OnInit {
  @Input() proms: any;

  constructor() {}

  socialMediaIcons = socialMedia;

  ngOnInit(): void {}
  trackById(index: number, _prom: any) {
    return _prom;
  }
}
