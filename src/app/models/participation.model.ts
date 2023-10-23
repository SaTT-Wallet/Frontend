import { getDateObjectFrom } from '@app/helpers/utils/common';

export class Participation {
  id: string;
  hash: string;
  oracle: string;
  username: number | null;
  status: boolean | string;
  reason: any;
  //wallet: string;
  postId: string;
  campaignHash: string;
  applyDate: Date | null;
  //date: Date;
  //fund: 0;
  isPayed: boolean;
  likes: number;
  shares: number;
  views: number;
  payedAmount: string;
  totalToEarn: string;
  typeSN!: number;
  title!: string;
  description!: string;
  cover: any;
  campaign: any;
  safeURL: any;
  disable: boolean;
  link: string;
  mediaUrl: string;
  sum: string;
  abosNumber: string;
  instagramUserName: string;
  totalToEarnInUSD: string;
  isAccepted: boolean = false;
  acceptedDate: Date | null;
  type: string;
  meta: any;
  userPic: any;
  idPost: any;
  appliedDate: any;
  lastHarvestDate: any;
  constructor(data?: any) {
    this.id = data?._id || '';
    this.hash = !!data.id_prom ? data.id_prom : '';

    this.abosNumber = data?.abosNumber ?? null;
    this.oracle = data?.oracle || '';
    this.username = data?.userId || data?.idUser || null;
    this.instagramUserName = data?.instagramUserName ||'';
    this.status = data?.status ?? '';
    this.reason = data?.reason;
    this.postId = data?.idPost || '';
    this.idPost = data?.idPost || '';
    this.campaignHash = data?.id_campaign || '';
    this.applyDate = getDateObjectFrom(data?.appliedDate);
    this.appliedDate = data?.appliedDate || '';
    this.isPayed = data?.isPayed ?? 'eezee';

    this.likes = data?.likes || 0;
    this.shares = data?.shares || 0;
    this.views = data?.views || 0;
    this.payedAmount = data?.payedAmount || '0';
    this.totalToEarn = data?.totalToEarn || '0';
    // this.sum = data?.totalToEarn && data?.payedAmount ? new Big(data?.totalToEarn).plus(data?.payedAmount).toFixed() : "0";
    this.sum = data?.sum || '0';
    this.typeSN = data?.typeSN || '0';
    this.title = data?.title || '';
    this.description = data?.description || '';
    this.cover = data?.cover || '';
    this.campaign = data?.campaign || '';
    this.safeURL = data?.safeURL || '';
    this.disable = data?.disable ?? false;
    this.link = data?.link || '';
    this.mediaUrl = data?.media_url || '';
    this.totalToEarnInUSD = '';
    this.isAccepted = data?.isAccepted ? data?.isAccepted : data?.status;
    this.acceptedDate = data?.acceptedDate || null;
    this.lastHarvestDate = data?.lastHarvestDate || null;


    this.type = data?.type || '';
    this.meta = data?.meta || '';
    this.userPic = data?.meta?.picLink ? data?.meta.picLink : '';
  }
}
