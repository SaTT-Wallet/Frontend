export interface ICampaignsListResponse {
  code: number;
  data: {
    campaigns: ICampaignResponse[];
    count: number;
  };
  message?: string;
  error?: string;
}

export interface ICampaignResponse {
  bounties: [];
  brand: string;
  cost: string;
  cost_usd: string;
  cover: string;
  createdAt: string;
  endDate: string;
  idNode: string;
  logo: string;
  ratios: [];
  reference: string;
  remuneration: 'performance' | 'remuneration';
  sort: number;
  sortPriority: boolean;
  startDate: string;
  tags: string[];
  title: string;
  token: { name: string; type: string; addr: string };
  type: string;
  updatedAt: string;
  _id: string;
  hash?: string;
  walletId?: string;
  funds?: string[];
  remaining?: string;
  countries?: any[];
  description: string;
  resume: string;
  shortLink?: string;
  stat?: string;
  coverSrc?: string;
  coverMobile?: string;
  coverSrcMobile?: string;
  proms?: any;
  url?: string;
  file?: string;
  urlPicUser?: string;
  missions?: [];
  limit:number;  
}
