import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '@core/services/tokenStorage/token-storage-service.service';

@Component({
  selector: 'app-password-wallet-validation',
  templateUrl: './password-wallet-validation.component.html',
  styleUrls: ['./password-wallet-validation.component.css']
})
export class PasswordWalletValidationComponent implements OnInit {
  // agreeBox1!: boolean;
  // agreeBox2!: boolean;
  // agreeBox3!: boolean;
  confirmForm: FormGroup;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
    this.confirmForm = new FormGroup({
      agreeBox1: new FormControl('', [Validators.required]),
      agreeBox2: new FormControl('', [Validators.required]),
      agreeBox3: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.tokenStorageService.setSecureWallet('visited-key', 'true');
  }
  onCheckboxChange(event: any, form: any) {
    if (event.target.checked === false) {
      this.confirmForm.get(form)?.setValue('');
    }
  }

  onSumbit() {
    this.tokenStorageService.setSecureWallet('visited-transactionPwd', 'true');
    this.router.navigate(['social-registration/password_wallet']);
  }
}
