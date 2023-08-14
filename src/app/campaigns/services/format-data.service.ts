import { Injectable } from '@angular/core';
import { ConvertToWeiPipe } from '@shared/pipes/convert-to-wei.pipe';
import { ListTokens } from '@config/atn.config';
import { CryptofetchServiceService } from '@core/services/wallet/cryptofetch-service.service';
import { Big } from 'big.js';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormatDataService {
  private coinsPrices: any = [];
  private isDestroyed = new Subject();

  constructor(
    private convertToWeiPipe: ConvertToWeiPipe,
    private fetchCoinsPrices: CryptofetchServiceService,
    private walletFacade: WalletFacadeService
  ) {
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        map((response: any) => response.data),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data: any) => {
        this.coinsPrices = data;
      });
  }

  manipulateDataBeforeSend(campaign: any): any {
    let price: any;
    let object: any = {};
    if (campaign.hasOwnProperty('title')) {
      object.title = campaign.title;
    }
    if (campaign.hasOwnProperty('description')) {
      object.description = campaign.description;
    }
    if (campaign.hasOwnProperty('summary')) {
      object.resume = campaign.summary;
    }
    if (campaign.hasOwnProperty('brand')) {
      object.brand = campaign.brand;
    }
    if (campaign.hasOwnProperty('reference')) {
      object.reference = campaign.reference;
    }
    if (campaign.hasOwnProperty('targetedCountries')) {
      object.countries = campaign.targetedCountries; //this.countriesCode(campaign.targetedCountries);
    }
    if (campaign.hasOwnProperty('currency')) {
      /*object.token = {
        name: campaign.token.name || campaign.currency || 'test',
        type:
          campaign.token?.type?.toUpperCase() ||
          ListTokens[campaign.currency]?.type.toUpperCase(),
        addr: campaign.token.addr || ListTokens[campaign.currency].contract
      };*/
      object.token = {
        name: campaign.currency.name || '',
        type: ListTokens[campaign.currency.name]?.type.toUpperCase(),
        addr: ListTokens[campaign.currency.name].contract
      };
      if (
        object.token.name === 'WSATT' ||
        object.token.name === 'SATTBEP20' ||
        object.token.name === 'SATTPOLYGON'
      ) {
        price = new Big(this.coinsPrices['SATT'].price).toFixed(8).toString();
      } else {
        price = new Big(this.coinsPrices[object.token.name]?.price || 0)
          .toFixed(8)
          .toString();
      }
    }
    if (campaign.hasOwnProperty('tags')) {
      object.tags = campaign.tags?.map((tag: any) => tag.value || tag);
    }
    if (campaign.hasOwnProperty('duration')) {
      object.time = campaign.duration;
    }
    if (campaign.hasOwnProperty('endDate')) {
      object.endDate = new Date(campaign.endDate).getTime() / 1000;
    }
    if (campaign.hasOwnProperty('startDate')) {
      object.startDate = new Date(campaign.startDate).getTime() / 1000;
    }
    if (campaign.hasOwnProperty('remuneration')) {
      // TODO: fix remuneration not sent to backend
      object.remuneration = campaign.remuneration;
    }
    if (campaign.hasOwnProperty('ratios')) {
      object.ratios = campaign.ratios.slice();
      object.ratios = object.ratios.map((ratio: any) => {
        return {
          like: this.convertToWeiPipe.transform(
            ratio.like,
            campaign.currency?.name || campaign.currency
          ),
          view: this.convertToWeiPipe.transform(
            ratio.view,
            campaign.currency?.name || campaign.currency
          ),
          share: this.convertToWeiPipe.transform(
            ratio.share,
            campaign.currency?.name || campaign.currency
          ),
          reachLimit: ratio.reachLimit,
          oracle: ratio.oracle
        };
      });
    }

    if (campaign.hasOwnProperty('bounties')) {
      //object.bounties = campaign.bounties;
      object.bounties = campaign.bounties.slice();
      object.bounties = object.bounties.map((bounty: any) => {
        bounty.categories = bounty.categories.map((category: any) => {
          return {
            minFollowers: category.minFollowers,
            maxFollowers: category.maxFollowers,
            reward: this.convertToWeiPipe.transform(
              category.reward,
              campaign.currency?.name || campaign.currency
            )
          };
        });
        return bounty;
      });
    }
    if (campaign.hasOwnProperty('initialBudget')) {
      object.cost = this.convertToWeiPipe.transform(
        campaign.initialBudget,
        campaign.currency?.name || campaign.currency
      );
    }

    if (campaign.hasOwnProperty('initialBudgetInUSD')) {
      object.cost_usd = (price * campaign.initialBudget * 1).toFixed(2);
    }

    if (campaign.hasOwnProperty('cover')) {
      object.cover = campaign.cover.split(',')[1];
    }

    if (campaign.hasOwnProperty('coverSrc')) {
      object.coverSrc = campaign.coverSrc.split(',')[1];
    }
    if (campaign.hasOwnProperty('coverMobile')) {
      object.coverMobile = campaign.coverMobile.split(',')[1];
    }

    if (campaign.hasOwnProperty('coverSrcMobile')) {
      object.coverSrcMobile = campaign.coverSrcMobile.split(',')[1];
    }
    if (campaign.hasOwnProperty('logo')) {
      object.logo = campaign.logo.split(',')[1];
    }
    if (campaign.hasOwnProperty('missions')) {
      object.missions = campaign.missions;
    }

    return object;
  }

  // countriesCode(targetedCountries: any): any[] {
  //   let countriesCode = [];
  //   let selectedCountries = targetedCountries?.map((elem: any) => {
  //     return elem.item_id;
  //   });

  //     countriesCode = selectedCountries?.map((elem: any) => {
  //       return arrayCountries[elem].code;
  //     });

  //   return countriesCode;
  // }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
