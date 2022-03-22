import { filter } from 'rxjs/operators';
import { forEach } from 'lodash';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { sattUrl, socialMedia } from '@config/atn.config';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
@Component({
  selector: 'app-campaign-creators',
  templateUrl: './campaign-creators.component.html',
  styleUrls: ['./campaign-creators.component.css']
})
export class CampaignCreatorsComponent implements OnInit {
  @Input() proms: any;

  constructor(private CampaignService: CampaignHttpApiService) {}

  socialMediaIcons = socialMedia;
  displayRejectReason: boolean = false;
  selectedProm: any;
  rejectReason: any = '';
  passwordBlockChain: any;
  errorMsg: any;
  sattUrl = sattUrl;
  searchInput: any = '';
  savedprom: any;
  emptyInputError: boolean = false;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proms) {
      this.proms = changes.proms.currentValue;
    }
  }

  confirmRejectMsg() {
    if (this.rejectReason.length) {
      this.displayRejectReason = !this.displayRejectReason;
    } else {
      this.emptyInputError = true;
      setTimeout(() => {
        this.emptyInputError = false;
      }, 3000);
    }
  }

  handelRejectedReason(event: any) {
    this.rejectReason = event.target.value;
  }

  handelValidation() {
    if (!this.displayRejectReason) {
      // this.CampaignService.validateLinks(this.selectedProm,this.passwordBlockChain).subscribe((data:any)=>{
      //   if(data.error){
      //     this.errorMsg=data.error
      //     this.hideError()
      //     this.passwordBlockChain=""
      //     }
      // })
    }
  }

  changesearch(event: any) {
    this.searchInput = event.target.value;
  }

  search() {
    if (this.searchInput) {
      this.proms = this.proms.filter((elem: any) => {
        return (
          elem.meta.name.slice(0, this.searchInput?.length) === this.searchInput
        );
      });
    } else {
      this.proms = this.proms;
    }
  }

  getSelectedLink(link_Obj: any, type: any): void {
    if (type === 'accept') {
      this.displayRejectReason = false;
    } else if (type === 'reject') {
      this.displayRejectReason = true;
    }
    this.selectedProm = link_Obj;
  }

  saveBlockchainPassword(event: any) {
    this.passwordBlockChain = event.target.value;
  }

  hideError() {
    setTimeout(() => {
      this.errorMsg = '';
    }, 4000);
  }
}
