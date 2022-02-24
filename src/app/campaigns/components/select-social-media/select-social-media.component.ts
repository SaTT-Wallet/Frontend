import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-social-media',
  templateUrl: './select-social-media.component.html',
  styleUrls: ['./select-social-media.component.scss']
})
export class SelectSocialMediaComponent implements OnInit {
  instaSelected = true;
  facebookSelected = true;
  youtubeSelected = true;
  twitterSelected = true;
  linkedInSelected = true;
  @Output() oracleValue = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toggleInsta() {
    this.instaSelected = !this.instaSelected;
    this.emitOraclesValue();
  }

  toggleFacebook() {
    this.facebookSelected = !this.facebookSelected;
    this.emitOraclesValue();
  }

  toggleTwitter() {
    this.twitterSelected = !this.twitterSelected;
    this.emitOraclesValue();
  }

  toggleYoutube() {
    this.youtubeSelected = !this.youtubeSelected;
    this.emitOraclesValue();
  }
  toggleLinkedIn() {
    this.linkedInSelected = !this.linkedInSelected;
    this.emitOraclesValue();
  }

  emitOraclesValue() {
    const array = [];
    if (this.instaSelected) {
      array.push('instagram');
    }
    if (this.facebookSelected) {
      array.push('facebook');
    }
    if (this.twitterSelected) {
      array.push('twitter');
    }
    if (this.youtubeSelected) {
      array.push('youtube');
    }
    if (this.linkedInSelected) {
      array.push('linkedin');
    }
    this.oracleValue.emit(array);
  }
}
