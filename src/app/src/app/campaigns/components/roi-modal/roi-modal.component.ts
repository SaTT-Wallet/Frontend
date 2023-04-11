import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-roi-modal',
  templateUrl: './roi-modal.component.html',
  styleUrls: ['./roi-modal.component.scss']
})
export class RoiModalComponent implements OnInit {
  inputValue: any;
  roiCurrentRate: number = 0;
  roiCurrentUsd: number = 0;
  tokenName: string = '';
  campaignType: string = '';
  campaignView: number = 0;
  campaignlike: number = 0;
  campaignShare: number = 0;
  campaignReachMax: number = 0;
  ReachMaxExist: boolean = false;
  closeModal: boolean = false;
  etherInWei: any;
  campaignBounties: any;
  campaignRatios: any;
  InputView: number = 0;
  Inputlike: number = 0;
  InputShare: number = 0;
  InputReachMax: number = 0;
  InputFllowers: number = 0;
  oracleSelected: string = 'facebook';
  platforms: string[] = [];
  cryptoPrice: any;

  isDestroyedSubject = new Subject();

  @Input() id: any;
  @Output() closeModaleEvent = new EventEmitter<any>();
  constructor(
    private CampaignService: CampaignHttpApiService,
    private router: Router,
    private walletFacade: WalletFacadeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.CampaignService.getOneById(this.id, 'projection').subscribe(
      (data: any) => {
        this.tokenName = data.data.token.name;
        if (['SATTPOLYGON', 'SATTBEP20', 'SATTBTT'].includes(this.tokenName))
          this.tokenName = 'SATT';
        this.campaignType = data.data.remuneration;
        this.campaignBounties = data.data.bounties;
        this.campaignRatios = data.data.ratios;
        this.campaignRatios.forEach((ratio : any) => {
          this.platforms.push(ratio.oracle);
        });
        this.campaignBounties.forEach((bountie : any) =>{
          this.platforms.push(bountie.oracle)
        })
        this.getCryptoPrice(this.tokenName);
      }
    );

    // this.etherInWei = ListTokens[this.tokenName].decimals;
  }

  getOraclList() {}

  closeBtn() {
    this.closeModaleEvent.emit(true);
  }
  getCryptoPrice(token: string) {
    this.walletFacade.getCryptoPriceList().subscribe((data: any) => {
     

      this.cryptoPrice = data.data[token].price;

      this.estimationGains();
    });
  }


  onPlatformSelect(platform: string) {
    this.oracleSelected = platform;
    this.InputFllowers = 0;
    this.InputView =0;
    this.InputShare =0;
    this.InputReachMax= 0;
    this.Inputlike =0;
    this.roiCurrentRate= 0;
    this.roiCurrentUsd=0;
  }

  getRewardRatios() {
    let ratios = this.campaignRatios;
    ratios.forEach((ratio: any) => {
      

      if (ratio.oracle === this.oracleSelected) {
        if (ratio.reachLimit) {
          this.campaignReachMax = parseInt(ratio.reachLimit);
          this.ReachMaxExist = true;

          if (this.campaignReachMax > 0) {
            var max = Math.ceil(
              (this.campaignReachMax * this.InputReachMax) / 100
            );
            if (+this.InputView > max) {
              this.InputView = max;
            }
            if (+this.Inputlike > max) {
              this.Inputlike = max;
            }
            if (+this.InputShare > max) {
              this.InputShare = max;
            }
          }
        }
        this.campaignView = parseInt(ratio.view) / 10 ** 18;
        this.campaignlike = parseInt(ratio.like) / 10 ** 18;
        this.campaignShare = parseInt(ratio.share) / 10 ** 18;
      }
    });
  }
  getRewardBountie() {
  
    let bounties = this.campaignBounties;
    let totalToEarn = '0';
    bounties.forEach((bounty: any) => {
  
      if (bounty.oracle === this.oracleSelected) {
        bounty.categories.forEach((category: any) => {
          if (
            +category.minFollowers <= +this.InputFllowers &&
            +this.InputFllowers <= +category.maxFollowers
          ) {
            let total = category.reward;
            totalToEarn = total;
          } else if (+this.InputFllowers > +category.maxFollowers) {
            let total = category.reward;
            totalToEarn = total;
          }
        });
        this.roiCurrentRate = parseInt(totalToEarn);
      }
    });
  }

  estimationGains() {
  

    if (this.campaignType === 'performance') {
      this.getRewardRatios();
      this.roiCurrentRate =
        this.campaignView * this.InputView +
        this.campaignlike * this.Inputlike +
        this.campaignShare * this.InputShare;
    } else if (this.campaignType === 'publication') {
      this.getRewardBountie();
    }
    

    this.roiCurrentUsd = this.roiCurrentRate * this.cryptoPrice;
  }
  goToCampaignDetail() {
    this.router.navigate(['/home/campaign/', this.id]);
    this.closeModaleEvent.emit(true);
  }
}
