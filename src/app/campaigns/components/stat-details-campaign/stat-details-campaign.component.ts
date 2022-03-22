import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { forEach } from 'lodash';
interface IStat {
  accepted: number | '0';
  likes: number | '0';
  pending: number | '0';
  rejected: number | '0';
  shares: number | '0';
  total: number | '0';
  views: number | '0';
  socialMedia: string;
}
@Component({
  selector: 'app-stat-details-campaign',
  templateUrl: './stat-details-campaign.component.html',
  styleUrls: ['./stat-details-campaign.component.scss']
})
export class StatDetailsCampaignComponent implements OnInit {
  @Input() hash: any;
  arrayStatics: IStat[] = [];
  totalVues = 0;
  totalShares = 0;
  totalLikes = 0;
  publishedMedia = 0;
  totalParticipants = 0;
  reachTotal = 0;
  private isDestroyed = new Subject();

  constructor(
    public CampaignService: CampaignHttpApiService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getStatistics();
  }
  getStatistics() {
    this.CampaignService.getStatisticsCampaign(this.hash)
      .pipe(
        map((response: any) => {
          if (response.message === 'success' && response.code === 200) {
            this.totalParticipants = response.data.creatorParticipate;
            this.reachTotal = response.data.reachTotal;
            return response.data.stat;
          }
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data: any) => {
        let array: IStat[] = [];
        forEach(data, (element: IStat, key: string) => {
          array.push({
            ...element,
            socialMedia: key
          });
        });
        this.arrayStatics = array;
        this.calacTotal(this.arrayStatics);
        this.cdref.markForCheck();
      });
  }

  calacTotal(array: any) {
    forEach(array, (element: IStat) => {
      this.totalLikes += Number(element.likes);
      this.totalVues += Number(element.views);
      this.totalShares += Number(element.shares);
      this.publishedMedia += Number(element.total);
    });
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
