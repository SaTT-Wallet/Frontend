import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { from, Subject } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-roi-modal',
  templateUrl: './roi-modal.component.html',
  styleUrls: ['./roi-modal.component.scss']
})
export class RoiModalComponent implements OnInit {
  campaignId: string = '63d941573bf74645ec1f30a9';
  roiCurrentRate: number = 0;
  roiCurrentUsd: number = 0;
  tokenName: string = '';
  campaignType: string = '';
  campaignView: number = 0;
  campaignlike: number = 0;
  campaignShare: number = 0;
  campaignReachMax: number = 0;
  campaignPerformanceReward: number = 0;
  campaignPublicationReward: number = 0;
  campaignPerformanceUsd: number = 0;
  campaignPublicationUsd: number = 0;
  campaignBounties: any;
  campaignRatios: any;
  InputView: number = 4;
  Inputlike: number = 3;
  InputShare: number = 2;
  InputReachMax: number = 10;
  oracleSelected: string= "facebook";
  oracleId!: number;
  cryptoPrice: number = 2;
  isDestroyedSubject = new Subject();
  // @ViewChild('modal') modal: ElementRef;
  // @Input() title: string;

  constructor(private CampaignService: CampaignHttpApiService) {
    // private ActivatedRoute: ActivatedRoute
  }

  ngOnInit(): void {
    this.oracleId = 1;
console.log('this.roiCurrentUsd avant', this.roiCurrentUsd);

    this.CampaignService.getOneById(this.campaignId, 'projection').subscribe(
      (data: any) => {
  
        this.tokenName = data.data.token.name;
        this.campaignType = data.data.remuneration;
        // this.campaignView = parseInt(data.data.ratios[this.oracleId]?.view);
        // this.campaignlike = parseInt(data.data.ratios[this.oracleId]?.like);
        // this.campaignShare = parseInt(data.data.ratios[this.oracleId]?.share);
        // this.campaignReachMax = parseInt(
        //   data.data.ratios[this.oracleId]?.reachLimit
        // );
        this.campaignBounties = data.data.bounties;
        this.campaignRatios = data.data.ratios;

        this.estimationGains();
      }
    );

  }
  getRewardRatios() {
    
    let ratios = this.campaignRatios;
    ratios.forEach((ratio: any) => {
      if (ratio.oracle === this.oracleSelected) {
        let abos =40
        if (ratio.reachLimit) {
          this.campaignReachMax = parseInt(ratio.reachLimit);
          
          if(this.campaignReachMax>0){
            var max = Math.ceil((this.campaignReachMax * abos) / 100)
            if(+this.InputView> max){
                this.campaignView = max
            }
            if(+this.Inputlike> max){
              this.campaignlike = max
          }
          if(+this.InputShare> max){
            this.campaignShare = max
        }
          }
        }else{
          this.campaignView = parseInt(ratio.view);
        this.campaignlike = parseInt(ratio.like);
        this.campaignShare = parseInt(ratio.share);
        }
        
      }
    });
  }
  getRewardBountie() {
    let bounties = this.campaignBounties;
    let totalToEarn = '0';
    bounties.forEach((bounty: any) => {
      if (bounty.oracle === this.oracleSelected) {
        let abosNumber = 7;
        bounty.categories.forEach((category: any) => {
          if (
            +category.minFollowers <= +abosNumber &&
            +abosNumber <= +category.maxFollowers
          ) {
            let total = category.reward;
            totalToEarn = total;
          } else if (+abosNumber > +category.maxFollowers) {
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
      this.getRewardRatios()
      this.roiCurrentRate =
        this.campaignView * this.InputView +
        this.campaignlike * this.Inputlike +
        this.campaignShare * this.InputShare;
    } else if (this.campaignType === 'publication') {
      this.getRewardBountie();
    }

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
