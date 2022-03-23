import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { bscan, etherscan } from '@app/config/atn.config';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

@Component({
  selector: 'app-copy-transaction-hash',
  templateUrl: './copy-transaction-hash.component.html',
  styleUrls: ['./copy-transaction-hash.component.css']
})
export class CopyTransactionHashComponent {
  @Input() network: any;
  @Input() networkWallet: any = '';
  @Input() transactionHash: any;

  isTransactionHashCopied = false;
  transactionHashLink!: string;
  constructor(
    private clipboard: Clipboard,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnDestroy() {
    this.tokenStorageService.removeItem('network');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.networkWallet.toLowerCase() === 'bep20') {
        this.tokenStorageService.removeItem('network');
        this.tokenStorageService.setItem('network', this.networkWallet);
      }
      if (this.networkWallet.toLowerCase() === 'erc20') {
        this.tokenStorageService.removeItem('network');
        this.tokenStorageService.setItem('network', this.networkWallet);
      }
      if (this.tokenStorageService.getNetwork() === 'bep20') {
        this.networkWallet = bscan + this.transactionHash;
      } else {
        this.networkWallet = etherscan + this.transactionHash;
      }
    }
  }

  copyTransactionHash() {
    this.isTransactionHashCopied = true;
    this.clipboard.copy(this.transactionHash);
    setTimeout(() => {
      this.isTransactionHashCopied = false;
    }, 2000);
  }
}
