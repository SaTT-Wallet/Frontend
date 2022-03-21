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
  createdAt: number;
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
  updatedAt: number;
  _id: string;
}
