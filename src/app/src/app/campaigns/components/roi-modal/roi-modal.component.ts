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
  roiCurrentRate: number= 0;
  roiCurrentUsd: number= 0;
  tokenName: string = '';
  campaignType: string ='';
  campaignView: number=0;
  campaignlike: number=0;
  campaignShare: number=0;
  campaignReachMax: number=0;
  campaignPReward: number=0;
  campaignMinFollowers: number=0;
  campaignMaxFollowers: number=0;
  campaignPublicationReward: number=0;
  InputView: number = 4;
  Inputlike: number = 3;
  InputShare: number = 2;
  InputReachMax: number = 10;
  oracleId! : number;
  cryptoPrice: any;
  isDestroyedSubject = new Subject();
  // @ViewChild('modal') modal: ElementRef;
  // @Input() title: string;

  constructor( private CampaignService: CampaignHttpApiService) { 

  
    // private ActivatedRoute: ActivatedRoute
  }

  ngOnInit(): void {
    this.oracleId = 1;
   
    this.CampaignService.getOneById(this.campaignId,'projection').subscribe((data:any) =>{
      console.log("cammmmmmpaign",data.data);
      this.tokenName = data.data.token.name
      this.campaignType = data.data.remuneration
      this.campaignView = parseInt(data.data.ratios[this.oracleId]?.view)
      this.campaignlike = parseInt(data.data.ratios[this.oracleId]?.like)
      this.campaignShare = parseInt(data.data.ratios[this.oracleId]?.share)
      this.campaignReachMax = parseInt(data.data.ratios[this.oracleId]?.reachLimit)
      console.log("bountiiii", data.data.bounties[this.oracleId].categories);
      this.campaignPublicationReward = data.data.bounties[this.oracleId].categories
      this.getRewardBountie();
      
      // this.campaignMinFollowers = data.data.bounties[this.oracleId]?
      this.estimationGains()
    })}
getRewardBountie(){

  let a = 555; // exemple de valeur de la variable a
  let categories = [ // exemple de tableau d'objets avec minFollowers, maxFollowers et reward
    {_id: "63d942c58ea8ff45c075b329", minFollowers: 1, maxFollowers: 5, reward:"1000000000000000000"},
    {_id: "63d942c58ea8ff45c075b32a", minFollowers: 6, maxFollowers: 20, reward:"2000000000000000000"},
    {_id: "63d942c58ea8ff45c075b32a", minFollowers: 22, maxFollowers: 200, reward:"3000000000000000000"}
  ];
  
  let reward$ = from(categories).pipe(
    first(objet => a >= objet.minFollowers && a <= objet.maxFollowers), 
    map(objet => objet.reward) 
  );
  
  reward$.subscribe(reward => console.log(reward));
}

    estimationGains(){
      if(this.campaignType === 'performance'){
        let reachmaxcheck 
        if(this.InputView  > this.campaignReachMax){
          reachmaxcheck = this.InputView
        }else
       {reachmaxcheck = this.InputView} 
        this.roiCurrentRate= (this.campaignView * reachmaxcheck) + (this.campaignlike * this.Inputlike) +(this.campaignShare * this.InputShare) 
      
      }else if(this.campaignType === 'publication'){
       this.roiCurrentRate 
      }
    
    
     this.roiCurrentUsd = this.roiCurrentRate * this.cryptoPrice
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
