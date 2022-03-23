import { Directive, OnInit } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace instgrm {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Embeds {
    function process(): void;
  }
}

@Directive({
  selector: '[data-instgrm-permalink]'
})
export class InstagramPostDirective implements OnInit {
  public ngOnInit(): void {
    instgrm.Embeds.process();
  }
}
