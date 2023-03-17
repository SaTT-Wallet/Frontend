import { Component, Input, SimpleChanges } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  bscan,
  bttscan,
  etherscan,
  polygonscan,
  tronScan
} from '@app/config/atn.config';
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
  @Input() type: any;
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
      this.tokenStorageService.removeItem('network');
      this.tokenStorageService.setItem('network', this.networkWallet);
      if (this.tokenStorageService.getNetwork() === 'BEP20') {
        this.networkWallet = bscan + this.transactionHash;
      } else if (this.tokenStorageService.getNetwork() === 'ERC20') {
        this.networkWallet = etherscan + this.transactionHash;
      } else if (this.tokenStorageService.getNetwork() === 'POLYGON') {
        this.networkWallet = polygonscan + this.transactionHash;
      } else if (this.tokenStorageService.getNetwork() === 'BTTC') {
        this.networkWallet = bttscan + this.transactionHash;
      } else if (this.tokenStorageService.getNetwork() === 'TRON') {
        this.networkWallet = tronScan + this.transactionHash;
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
