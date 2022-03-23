import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  @Output() sendClickedEvent = new EventEmitter<string>();
  @Output() recieveClickedEvent = new EventEmitter<string>();
  @Output() buyClickedEvent = new EventEmitter<string>();

  public recieveBtn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public buysenBtn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public toggleSidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public toggleSidebarMobile: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public toggleWalletMobile: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public toggleFooterMobile: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  activatedRoute: ActivatedRoute | null | undefined;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver
      .observe('(max-width: 1024px)')
      .subscribe((result: BreakpointState) => {
        this.toggle();
      });
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DropDown: boolean = false; // Balance section in side bar
  // public redirection(crypto: any): void {
  //   if (this.sendBtn.next(this.sendBtn.value) == true) {
  //     console.log('send btn from sidebarService ', this.sendBtn.value);
  //     this.goTosend(crypto);
  //   }
  // }
  public toggle(): void {
    this.toggleSidebar.next(!this.toggleSidebar.value);
  }

  public toggleMobile() {
    this.toggleSidebarMobile.next(!this.toggleSidebarMobile.value);
  }
  public toggleMobile2() {
    this.toggleSidebarMobile.next(!this.toggleSidebarMobile.value);
  }
  public toggleWallet() {
    this.toggleWalletMobile.next(!this.toggleWalletMobile.value);
  }
  public toggleFooter() {
    this.toggleFooterMobile.next(!this.toggleFooterMobile.value);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  BalanceDropDown(action: any, value?: any): any {
    if (action === 'get') {
      this.DropDown = false;
    } else if (action === 'change') {
      this.DropDown = value;
    }
  }
  // goTosend(id: any) {
  //   this.router.navigate(['/wallet/send'], {
  //     queryParams: { id: id },
  //     relativeTo: this.activatedRoute
  //   });
  // }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sendClicked(msg: string) {
    this.sendClickedEvent.emit(msg);
  }
  recieveClicked(msg: string) {
    this.recieveClickedEvent.emit(msg);
  }
  buyClicked(msg: string) {
    this.buyClickedEvent.emit(msg);
  }
}
