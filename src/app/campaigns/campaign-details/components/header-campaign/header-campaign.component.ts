import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ParticipationListStoreService } from '@app/campaigns/services/participation-list-store.service';
import { IOption } from '@shared/components/multi-select/multi-select.component';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header-campaign',
  templateUrl: './header-campaign.component.html',
  styleUrls: ['./header-campaign.component.scss']
})
export class HeaderCampaignComponent implements OnInit {
  @Output() onFormChange = new EventEmitter();
  @Input() campaignHash: any;
  @Input() isOwner: boolean = false;
  @Input() fromFarming: boolean = false;
  toggled: boolean = false;
  private isDestroyed = new Subject();

  filterGainsForm = this.fb.group({
    searchTerm: this.fb.control(''),
    status: this.fb.control('all'),
    oracles: this.fb.control([])
  });
  oraclesOptions: IOption[] = [
    {
      value: 'facebook',
      iconUrl: '/assets/Images/social-media/facebook-icon-purple.svg',
      selectedIconUrl: '/assets/Images/facebook.svg',
      bgColor: 'white'
    },
    {
      value: 'twitter',
      iconUrl: '/assets/Images/social-media/twitter-icon-purple.svg',
      selectedIconUrl: '/assets/Images/twitter.svg',
      bgColor: '#55ACEE'
    },
    {
      value: 'youtube',
      iconUrl: '/assets/Images/social-media/youtube-icon-purple.svg',
      selectedIconUrl: '/assets/Images/youtube.svg',
      bgColor: 'white'
    },
    {
      value: 'instagram',
      iconUrl: '/assets/Images/social-media/instagram-icon-purple.svg',
      selectedIconUrl: '/assets/Images/instagram.svg',
      bgColor: 'white'
    },
    {
      value: 'linkedin',
      iconUrl: '/assets/Images/social-media/linkedin-icon-purple.svg',
      selectedIconUrl: '/assets/Images/linkedin.svg',
      bgColor: 'white'
    },
    {
      value: 'tiktok',
      iconUrl: '/assets/Images/tiktok-purple.svg',
      selectedIconUrl: '/assets/Images/tikTok-icon.svg',
      bgColor: 'white'
    },
    {
      value: 'threads',
      iconUrl: '/assets/Images/social-media/threads-purple.svg',
      selectedIconUrl: '/assets/Images/social-media/threads-icon.svg',
      bgColor: 'white'
    }
  ];
  participationStatusOptions: IOption[] = [
    {
      value: 'true',
      text: 'icon-load',
      iconUrl: '/assets/Images/icon-load.svg'
    },
    {
      value: 'false',
      text: 'icon-pending',
      iconUrl: '/assets/Images/icon-pending.svg'
    },
    {
      value: 'rejected',
      text: 'icon-delete',
      iconUrl: '/assets/Images/icon-delete.svg'
    }
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private participationListService: ParticipationListStoreService
  ) {
    // reset filter
    this.participationListService.setFilterValues({
      searchTerm: '',
      status: 'all',
      oracles: []
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.filterGainsForm?.valueChanges
        .pipe(debounceTime(700), takeUntil(this.isDestroyed))
        .subscribe((v) => {
          this.onFormChange.emit(v);
          this.participationListService.setFilterValues(v);
          if (!this.fromFarming) {
            let state = '';
            if (this.isOwner) {
              state = 'owner';
            } else {
              state = 'part';
            }
            this.participationListService.setQueryParams({
              campaignId: this.campaignHash,
              state: state
            });
          } else {
            this.participationListService.setQueryParams({
              campaignId: '',
              state: ''
            });
          }
        });
    }, 500);

    // this.filterCampaignsForm?.valueChanges
    //   .pipe(debounceTime(500))
    //   .subscribe((v) => {
    //     console.warn(v);
    //     this.onFormChange.emit(v);
    //     this.campaignsListStoreService.setFilterValues(v);
    //   });
  }
  getPendingLinks() {
    this.toggled = true;
    this.filterGainsForm.get('status')?.setValue(false);
  }
  reset() {
    this.toggled = false;
    this.filterGainsForm.get('status')?.setValue('all');
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
