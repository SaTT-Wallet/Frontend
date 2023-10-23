import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '@app/core/services/sidebar/sidebar.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit {
  showHalf: boolean = false;
  activatedRoute: ActivatedRoute | null | undefined;
  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    console.log(this.sidebarService)
  }
  goToBuy() {
    if (isPlatformBrowser(this.platformId))
      window.open('https://www.probit.com/app/exchange/SATT-USDT', '_blank');
  }

  toggleMobile() {
    this.sidebarService.toggleWalletMobile.next(false);
    this.sidebarService.toggleFooterMobile.next(false);
  }
  toggle() {
    this.sidebarService.toggleWalletMobile.next(false);
    if (this.sidebarService.toggleFooterMobile.value) {
      this.sidebarService.toggleFooterMobile.next(false);
      this.showHalf = false;
    } else {
      this.sidebarService.toggleFooterMobile.next(true);
      this.showHalf = true;
    }
  }
  clickSend() {
    this.sidebarService.sendClicked('send');
  }
  clickRecieve() {
    this.sidebarService.recieveClicked('recieve');
  }
  clickBuy() {
    /*if (this.tokenStorageService.getCryptoClic() === 'true') {
      this.sidebarService.buyClicked('buy');
      this.tokenStorageService.removeItem('cryptoClic');
    } else {*/
      // this.sidebarService.buyClicked('buy');
      this.router.navigate(['/wallet/buy-token']);
    //}
  }
}
