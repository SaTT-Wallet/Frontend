import { ViewportScroller } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import ts from 'typescript';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.css']
})
export class CguComponent implements OnInit {
  toggleSideMenu: boolean = true;
  pageYoffset!: number;
  @HostListener('window:scroll', ['$event']) onScroll(event: any) {
    if (isPlatformBrowser(this.platformId))
      this.pageYoffset = window.pageYOffset;
  }
  constructor(
    private scroll: ViewportScroller,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {}
  goToSection(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const classElement = this.document.getElementsByClassName(id);
      if (classElement.length > 0) {
        classElement[0].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
