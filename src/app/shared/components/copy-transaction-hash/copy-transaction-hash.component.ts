import { Component, Input, SimpleChanges } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { bscan, etherscan, polygonscanAddr } from '@app/config/atn.config';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';

import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { WindowRefService } from '@app/core/windowRefService';

@Component({
  selector: 'app-copy-transaction-hash',
  templateUrl: './copy-transaction-hash.component.html',
  styleUrls: ['./copy-transaction-hash.component.css']
})
export class CopyTransactionHashComponent {
  @Input() network: any;
  @Input() networkWallet: any = '';
  @Input() transactionHash: any;

  noTransactionHash!: boolean;
  urlSmartContrat!: string;

  isTransactionHashCopied = false;
  transactionHashLink!: string;
  constructor(
    private clipboard: Clipboard,
    private tokenStorageService: TokenStorageService,
    public CampaignService: CampaignHttpApiService,
    private windowRefService: WindowRefService
  ) {}

  ngOnDestroy() {
    this.tokenStorageService.removeItem('network');
  }
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.networkWallet?.toLowerCase() === 'bep20') {
        this.tokenStorageService.removeItem('network');
        this.tokenStorageService.setItem('network', this.networkWallet);
      }
      if (this.networkWallet?.toLowerCase() === 'erc20') {
        this.tokenStorageService.removeItem('network');
        this.tokenStorageService.setItem('network', this.networkWallet);
      }
      if (this.networkWallet?.toLowerCase() === 'polygon') {
        this.tokenStorageService.removeItem('network');
        this.tokenStorageService.setItem('network', this.networkWallet);
      }
      if (this.tokenStorageService.getNetwork() === 'bep20') {
        this.networkWallet = bscan + this.transactionHash;
        //this.windowRefService.nativeWindow.open(this.networkWallet, '_blank');
      } else if (this.tokenStorageService.getNetwork() === 'erc20') {
        this.networkWallet = etherscan + this.transactionHash;
        //this.windowRefService.nativeWindow.open(this.networkWallet, '_blank');
      } else if (this.tokenStorageService.getNetwork() === 'POLYGON') {
        this.networkWallet = polygonscanAddr + this.transactionHash;
        //this.windowRefService.nativeWindow.open(this.networkWallet, '_blank');
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
