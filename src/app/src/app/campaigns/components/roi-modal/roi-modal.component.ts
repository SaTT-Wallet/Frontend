import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';


import { Subject } from 'rxjs';

@Component({
  selector: 'app-roi-modal',
  templateUrl: './roi-modal.component.html',
  styleUrls: ['./roi-modal.component.scss']
})
export class RoiModalComponent implements OnInit {
  inputValue: any;
  roiCurrentRate!: number;
  roiCurrentUsd!: number;
  tokenName!: string ;
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
  InputView!: number;
  Inputlike!: number;
  InputShare!: number;
  InputReachMax!: number;
  InputFllowers!: number;
  View!: number;
  like!: number;
  Share!: number;
  oracleSelected: string = '';
  platforms: string[] = [];
  cryptoPrice: any;
  tofixUsd: string = '0';
  isDestroyedSubject = new Subject();

  @Input() campaign: any;
  @Output() closeModaleEvent = new EventEmitter<any>();
  constructor(
    private CampaignService: CampaignHttpApiService,
    private router: Router,
    private walletFacade: WalletFacadeService
  ) {}

  ngOnInit(): void {
    this.roiCurrentRate = 0;
    this.roiCurrentUsd = 0;
    this.tokenName = this.campaign.currency.name;
        if (['SATTBEP20'].includes(this.tokenName)) this.tokenName = 'SATT';
        this.campaignType = this.campaign.remuneration;
        this.campaignBounties = this.campaign.bounties;
        this.campaignRatios = this.campaign.ratios;
   
       this.oracleSelected = this.campaignType === 'performance' ? this.campaignRatios[0].oracle : this.campaignBounties[0].oracle;
     
        
        this.campaignRatios.forEach((ratio: any) => {
          this.platforms.push(ratio.oracle);
        });
     
        
        this.campaignBounties.forEach((bountie: any) => {
          this.platforms.push(bountie.oracle);
        });
        this.getCryptoPrice(this.tokenName);
    
  }

  validateNumber(e: any) {
    e = e || window.event;
    var charCode = typeof e.which == 'undefined' ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
  }

  closeBtn() {
    this.closeModaleEvent.emit(true);
  }
  getCryptoPrice(token: string) {
    this.walletFacade.getCryptoPriceList().subscribe((data: any) => {
      console.log("dataa", data);
      
      this.cryptoPrice = data.data[token].price;

      this.estimationGains();
    });
  }

  onPlatformSelect(platform: string) {
    this.oracleSelected = platform;
    this.InputFllowers = 0;
    this.InputView = 0;
    this.InputShare = 0;
    this.InputReachMax = 0;
    this.Inputlike = 0;
    this.roiCurrentRate = 0;
    this.roiCurrentUsd = 0;
  }

  getRewardRatios() {
    let ratios = this.campaignRatios;
    ratios.forEach((ratio: any) => {
      if (ratio.oracle === this.oracleSelected) {
        this.View = !this.InputView ? 0 : this.InputView;
        this.like = !this.Inputlike ? 0 : this.Inputlike;
        this.Share = !this.InputShare ? 0 : this.InputShare;
        if (ratio.reachLimit) {
          this.campaignReachMax = parseInt(ratio.reachLimit);
          this.ReachMaxExist = true;
        
          if (this.campaignReachMax > 0) {
            var max = Math.ceil(
              (this.campaignReachMax * this.InputReachMax) / 100
            );
            this.View =
              +this.InputView > max
                ? max
                : !this.InputView
                ? 0
                : this.InputView;
            this.like =
              +this.Inputlike > max
                ? max
                : !this.Inputlike
                ? 0
                : this.Inputlike;
            this.Share =
              +this.InputShare > max
                ? max
                : !this.InputShare
                ? 0
                : this.InputShare;
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
        this.roiCurrentRate = parseInt(totalToEarn) / 10 ** 18;
      }
    });
  }

  estimationGains() {
    if (this.campaignType === 'performance') {
      this.getRewardRatios();
      this.roiCurrentRate = this.oracleSelected === 'threads' ?  this.campaignlike * this.like :
        this.campaignView * this.View +
        this.campaignlike * this.like +
        this.campaignShare * this.Share;
    } else if (this.campaignType === 'publication') {
      this.getRewardBountie();
    }
    
    this.roiCurrentUsd = this.roiCurrentRate * this.cryptoPrice;
    if (this.roiCurrentUsd === 0) {
      this.tofixUsd = '0';
    } else {
      if (this.roiCurrentUsd < 0.1) {
        this.tofixUsd = '8';
      }
      if (this.roiCurrentUsd >= 0.1 && this.roiCurrentUsd <= 1.9) {
        this.tofixUsd = '6';
      }
      if (this.roiCurrentUsd >= 2 && this.roiCurrentUsd <= 9.9999) {
        this.tofixUsd = '5';
      }
      if (this.roiCurrentUsd >= 10.0 && this.roiCurrentUsd <= 9.9999) {
        this.tofixUsd = '2';
      }
    }
  }
  goToCampaignDetail() {
    this.router.navigate(['/home/campaign/', this.campaign.id]);
    this.closeModaleEvent.emit(true);
  }
}
