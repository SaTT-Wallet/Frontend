import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-wallet-activated',
  templateUrl: './password-wallet-activated.component.html',
  styleUrls: ['./password-wallet-activated.component.css']
})
export class PasswordWalletActivatedComponent implements OnInit {
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tokenStorageService.setSecureWallet('visited-activePass', 'true');
  }
  goToWallet() {
    this.router.navigate(['/home']);
  }
  goToEditProfile() {
    this.router.navigate(['home/settings/edit']);
  }
}
