import { ListTokens } from '@config/atn.config';
import { getDateObjectFrom } from '@helpers/utils/common';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { ICampaignResponse } from '@app/core/campaigns-list-response.interface';

export class Campaign {
  id: string;
  hash: string | null;
  walletId: string;
  initialBudget: string;
  initialBudgetInUSD: string;
  budget: string; // the remaining budget will get updated each time we increase/decrease budget
  targetedCountries: any[];
  createdAt: string;
  updatedAt: string;
  description: string;
  ratios: any[];
  bounties: any[];
  remuneration: string;
  summary: string;
  shortLink: string;
  status: string;
  tags: any[];
  title: string;
  currency: { [key: string]: string };
  cover: any;
  coverSrc: any;
  coverMobile: any;
  coverSrcMobile: any;
  brand: string;
  logo: any;
  reference: string;
  endDate: any;
  startDate: any;
  proms: [];
  url: any;
  file: any;
  ownerId: string;
  urlPicUser: any;
  type: string;
  limitParticipation:number;
  tokenStorageService!: TokenStorageService;
  missions: [];
  isOwnedByUser = false;
  budgetUsd: string;
  constructor(data?: ICampaignResponse) {
    this.id = data?._id || '';
    this.hash = data?.hash || null;
    this.walletId = data?.walletId || '';
    this.ownerId = data?.idNode || '';
    this.initialBudget = data?.cost || '0';
    this.initialBudgetInUSD = data?.cost_usd || '0';
    this.limitParticipation = data?.limit || 0;
    this.budget = data?.funds
      ? (data?.funds[1] as string)
      : data?.remaining
      ? (data?.remaining as string)
      : (data?.cost as string);
    this.targetedCountries = this.convertCountriesCode(data?.countries || []);
    this.createdAt = data?.createdAt || '';
    this.updatedAt = data?.updatedAt || '';
    this.description = data?.description || '';
    this.ratios = data?.ratios || [];
    this.bounties = data?.bounties || [];
    this.remuneration = data?.remuneration || 'performance';
    this.summary = data?.resume || '';
    this.shortLink = data?.shortLink || '';
    this.status = data?.stat || '';
    this.tags = data?.tags || [];
    this.title = data?.title || '';
    this.currency = data?.token || {
      name: 'SATT',
      type: 'erc20',
      addr: ListTokens['SATT'].contract
    };
    this.brand = data?.brand || '';
    this.cover = data?.cover ? 'data:image/png;base64,' + data?.cover : '';
    this.coverSrc = data?.coverSrc
      ? 'data:image/png;base64,' + data?.coverSrc
      : '';
    this.coverMobile = data?.coverMobile
      ? 'data:image/png;base64,' + data?.coverMobile
      : '';
    this.coverSrcMobile = data?.coverSrcMobile
      ? 'data:image/png;base64,' + data?.coverSrcMobile
      : '';
    this.logo = data?.logo ? 'data:image/png;base64,' + data?.logo : '';
    this.reference = data?.reference || '';
    this.endDate =
      typeof data?.endDate == 'number'
        ? getDateObjectFrom(data.endDate)
        : getDateObjectFrom(data?.endDate, true);
    this.startDate =
      typeof data?.startDate == 'number'
        ? getDateObjectFrom(data.startDate)
        : getDateObjectFrom(data?.startDate);
    this.proms = data?.proms;
    this.url = data?.url;
    this.file = data?.file;
    this.urlPicUser = data?.urlPicUser || '';
    this.type = data?.type || '';
    this.missions = data?.missions || [];
    this.budgetUsd = '';
  }

  get isDraft(): boolean {
    return this.type === 'draft';
  }

  get isActive(): boolean {
    return this.type === 'apply';
  }

  get isFinished(): boolean {
    return this.type === 'finished';
  }

  get inProgress(): boolean {
    return this.type === 'inProgress';
  }

  /*get isOwnedByUser(): boolean {
    return Number(this.ownerId) === Number(localStorage.getItem('userId'));
  }*/

  set ownedByUser(isOwnedByUser: boolean) {
    this.isOwnedByUser = isOwnedByUser;
  }

  convertCountriesCode(countries: any[]) {
    let _countries: any = [];
    if (Object.keys(countries).length === 250) {
      _countries.push('All countries');
    } else {
      countries.forEach((country) => {
        if (!!country.item_text) {
          _countries.push(country.item_text);
        } else {
          _countries.push(country);
        }
      });
      /*this.allCountries.forEach((elem: any) => {
        console.warn(countries);
        for (let key in countries) {
          if (elem.name === countries[key].item_text) {
            _countries.push(elem.name);
          }
        }
      });*/
    }

    return _countries;
  }
}
