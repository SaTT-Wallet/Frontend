import { Component, OnInit } from '@angular/core';

import { ListTokens } from '@app/config/atn.config';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';


import { from, Subject } from 'rxjs';

@Component({
  selector: 'app-roi-modal',
  templateUrl: './roi-modal.component.html',
  styleUrls: ['./roi-modal.component.scss']
})
export class RoiModalComponent implements OnInit {
  campaignId: string = '63cfef88de3de12cea7beed1';
  roiCurrentRate: number = 0;
  roiCurrentUsd: number = 0;
  tokenName: string = '';
  campaignType: string = '';
  campaignView: number = 0;
  campaignlike: number = 0;
  campaignShare: number = 0;
  campaignReachMax: number = 0;
  ReachMaxExist: boolean = false;
  etherInWei: any;
  coinsPrices: any;
  campaignBounties: any;
  campaignRatios: any;
  InputView: number = 40;
  Inputlike: number = 3;
  InputShare: number = 2;
  InputReachMax: number = 10;
  InputFllowers: number = 100;
  oracleSelected: string = 'facebook';
  oracleId!: number;
  cryptoPrice: any;
  isDestroyedSubject = new Subject();
  // @ViewChild('modal') modal: ElementRef;
  // @Input() title: string;

  constructor(
    private CampaignService: CampaignHttpApiService,
    private walletFacade: WalletFacadeService
  ) {
    // private ActivatedRoute: ActivatedRoute
  }

  ngOnInit(): void {
    
    this.CampaignService.getOneById(this.campaignId, 'projection').subscribe(
      (data: any) => {
        this.tokenName = data.data.token.name;
        this.campaignType = data.data.remuneration;
        this.campaignBounties = data.data.bounties;
        this.campaignRatios = data.data.ratios;
        this.getCryptoPrice("SATT");
        ;
      }
    );

   

    // this.etherInWei = ListTokens[this.tokenName].decimals;
  }
  getCryptoPrice(token: string) {
    this.walletFacade.getCryptoPriceList().subscribe((data: any) => {
      console.log("tokenn", token);
      
      this.cryptoPrice = data.data[token].price;
      console.log('this.cryptoPrice', this.cryptoPrice);
      this.estimationGains()
    },);
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
    console.log('this crypto name', this.tokenName);
    console.log('THIS PRICE', this.cryptoPrice);

    this.roiCurrentUsd = this.roiCurrentRate * this.cryptoPrice;
  }

  //   this.ActivatedRoute.params
  //   .pipe(
  //     mergeMap((params) => {
  //       this.campaignId = params['campaign_id'];
  //       return this.CampaignService.getOneById(this.campaignId,'projection');
  //     }),
  //     takeUntil(this.isDestroyedSubject)
  //   )
  //   .subscribe((data: any) => {
  //     this.campaigndata = data.data;
  //     this.tokenName = data.data.token.name
  //     let performance = this.campaigndata.ratios[0]?.oracle;
  //     if (performance?.length > 1 && performance === 'twitter') {
  //       this.ratioLink = true;
  //     }
  //     this.parentFunction(this.networkWallet).subscribe();
  //   });
  // }

  // getCampaignData(){
  //   this.CampaignService.getOneById(this.campaignId)
  //       .pipe(
  //         takeUntil(this.isDestroyed$),
  //         map((res: any) => res.data)
  //       )
  //       .subscribe((data: any) => {

  //       });
  // }
  // openModal() {
  //   this.modal.nativeElement.classList.add('show');
  //   document.body.classList.add('modal-open');
  // }

  // closeModal() {
  //   this.modal.nativeElement.classList.remove('show');
  //   document.body.classList.remove('modal-open');
  // }
}
