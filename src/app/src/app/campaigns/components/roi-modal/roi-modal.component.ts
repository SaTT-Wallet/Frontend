import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-roi-modal',
  templateUrl: './roi-modal.component.html',
  styleUrls: ['./roi-modal.component.scss']
})
export class RoiModalComponent implements OnInit {
  campaignId: string = '';
  tokenName: string = '';
  campaignId: string = '';
  isDestroyedSubject = new Subject();
  // @ViewChild('modal') modal: ElementRef;
  // @Input() title: string;

  constructor() { 

    public CampaignService: CampaignHttpApiService,
  
    private ActivatedRoute: ActivatedRoute
  }

  ngOnInit(): void {
    this.ActivatedRoute.params
    .pipe(
      mergeMap((params) => {
        this.campaignId = params['campaign_id'];
        return this.CampaignService.getOneById(this.campaignId,'projection');
      }),
      takeUntil(this.isDestroyedSubject)
    )
    .subscribe((data: any) => {
      this.campaigndata = data.data;
      this.tokenName = data.data.token.name
      let performance = this.campaigndata.ratios[0]?.oracle;
      if (performance?.length > 1 && performance === 'twitter') {
        this.ratioLink = true;
      }
      this.parentFunction(this.networkWallet).subscribe();
    });
  }
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
