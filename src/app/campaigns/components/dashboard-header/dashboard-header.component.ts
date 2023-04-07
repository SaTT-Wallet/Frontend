import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { CampaignsListStoreService } from '@campaigns/services/campaigns-list-store.service';
import { ParticipationListStoreService } from '@campaigns/services/participation-list-store.service';
import { Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { IOption } from '@shared/components/multi-select/multi-select.component';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
  @Input() title = 'page title';
  @Output() onFormChange = new EventEmitter();
  txtValue: string = '';
  searched: boolean = false;
  showFilter = false;
  private isDestroyed = new Subject();

  filterCampaignsForm = this.fb.group({
    searchTerm: this.fb.control(''),
    status: this.fb.control(''),
    blockchainType: this.fb.control(''),
    oracles: this.fb.control([]),
    remainingBudget: this.fb.control([])
  });
  filterParticipationForm = this.fb.group({
    searchTerm: this.fb.control(''),
    status: this.fb.control('all'),
    oracles: this.fb.control([])
  });
  statusOptions: IOption[] = [
    {
      value: 'draft',
      iconUrl: '/assets/Images/sand-clock-icon.svg',
      selectedIconUrl: '/assets/Images/sand-clock-white-icon.svg'
    },
    {
      value: 'active',
      iconUrl: '/assets/Images/active-icon.svg',
      selectedIconUrl: '/assets/Images/active-white-icon.svg'
    },
    {
      value: 'finished',
      iconUrl: '/assets/Images/done-icon.svg',
      selectedIconUrl: '/assets/Images/done-white-icon.svg'
    }
  ];
  blockchainTypeOptions: IOption[] = [{ value: 'bep20' }, { value: 'erc20' }];
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
    }
  ];
  remainedBudgetOptions: IOption[] = [
    { value: '0-5000', text: 'campaign_list.between_0_&_5k_satt' },
    { value: '5000-10000', text: 'campaign_list.between_5k_&_10k_satt' },
    { value: '10000-50000', text: 'campaign_list.between_10k_&_50k_satt' },
    { value: '50000-200000', text: 'campaign_list.between_50k_&_200k_satt' },
    { value: '200000-100000000', text: 'campaign_list.between_200k_&_1m_satt' }
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

  searchButtonClickSubject = new Subject();

  constructor(
    private fb: UntypedFormBuilder,
    private participationListService: ParticipationListStoreService,
    private campaignsListStoreService: CampaignsListStoreService
  ) {}

  ngOnInit(): void {
    this.filterCampaignsForm?.valueChanges
      .pipe(debounceTime(500), takeUntil(this.isDestroyed))
      .subscribe((v) => {
        this.onFormChange.emit(v);
        this.campaignsListStoreService.setFilterValues(v);
      });

    this.filterParticipationForm?.valueChanges
      .pipe(debounceTime(500), takeUntil(this.isDestroyed))
      .subscribe((v) => {
        this.onFormChange.emit(v);
        this.participationListService.setFilterValues(v);
        this.participationListService.setQueryParams({
          campaignId: '',
          state: ''
        });
      });
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onTextChange(value: any) {
    this.txtValue = value;
    if (this.txtValue !== '') {
      this.searched = true;
    } else {
      this.searched = false;
    }
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
