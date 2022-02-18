import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fail-transfer',
  templateUrl: './fail-transfer.component.html',
  styleUrls: ['./fail-transfer.component.scss']
})
export class FailTransferComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  linstingBack(event: any) {
    if (event === true) {
      this.router.navigate(['/wallet/buy-token']);
    }
  }
}
