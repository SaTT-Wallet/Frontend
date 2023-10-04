import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  sattUrl,
  campaignSmartContractERC20,
  campaignSmartContractBEP20,
  campaignSmartContractPOLYGON,
  campaignSmartContractBTT
} from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import {
  catchError,
  map,
  retry,
  share,
  shareReplay,
  takeLast,
  mergeMap,
  takeUntil
} from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import {
  ICampaignResponse,
  ICampaignsListResponse
} from '@app/core/campaigns-list-response.interface';
import { IApiResponse } from '@app/core/types/rest-api-responses';
import { environment as env } from '../../../../environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CampaignHttpApiService {
  campaignData: any;
  loadDataAddPoolWhenEndScroll = new Subject();
  loadDataPostFarmWhenEndScroll = new Subject();
  loadDataEarningsWhenEndScroll = new Subject();
  loadDataWelcomePageWhenEndScroll = new Subject();
  isLoading = new Subject();
  stat = new Subject();

  private isDestroyed = new Subject();
  scrolling = new Subject();
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  upload(file: File, id: any) {
    const formData: FormData = new FormData();
    formData.append('cover', file);

    return this.http.post(sattUrl + '/campaign/ipfs/' + id, formData);
  }
  getPromById(id: string) {
    return this.http.get(`${sattUrl}/campaign/prom/stats/${id}`).pipe(
      retry(1),
      catchError(() => {
        //TODO: handle backend api errors
        return of(null);
      }),
      share()
    );
  }

  getRefunds(hash: any, password: string, network: string) {
    return this.http.post(sattUrl + '/campaign/remaining', {
      hash: hash,
      pass: password,
      network: network
    });
  }

  getTotalInvestetd() {
    return this.http.get(sattUrl + '/campaign/invested');
  }
  notifyLink(campaignId: any, link: any, idProm: string) {
    return this.http.post(sattUrl + '/campaign/linkNotification', {
      idCampaign: campaignId,
      link,
      idProm
    });
  }

  getOneById(
    id: string,
    projection: string = ''
  ): Observable<IApiResponse<ICampaignResponse>> {
    return this.http.get<IApiResponse<ICampaignResponse>>(
      sattUrl + '/campaign/details/' + id + `?projection=${projection}`
    );
  }

  /**
   * Recover earnings of the accepted campaign medias.
   * @param id prom identifier
   * @param password Wallet password.
   * @returns {Observable} a http client observable.
   */
  recoverEarnings(
    password: string,
    idProm: string,
    hash: any
  ): Observable<any> {
    return this.http.post(`${sattUrl}/campaign/gains`, {
      idProm,
      pass: password,
      hash
    });
  }
  generateBrief(title: string) {
    
    
    return this.http.post(sattUrl + '/campaign/generate-brief', {
      title
    });
  }

  getBestInfluencerPic(id: any) {
    return this.http.get(sattUrl + `/profile/picture?id=${id}`, {
      responseType: 'blob'
    });
  }

  /*
     @link : /campaign/:id/showcovers
     @description: retrieves the cover image for the according campaign
     @params:
     id : campagne.meta._id   for activated or ended campaign
     id : _id for draft campaign
     */
  getCampaignCover(id: any, type: string) {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http
      .get(sattUrl + 'v2/campaign/' + id + '/cover/' + type, {
        responseType: 'blob',
        headers: httpHeaders
      })
      .pipe(
        retry(1),
        catchError(() => of(null))
      );
  }

  deleteDraft(id: any) {
    return this.http
      .delete(sattUrl + '/campaign/deleteDraft' + `/${id}`)
      .pipe(shareReplay(1));
  }

  getCampaignKitUrl(id: any) {
    return this.http.get(sattUrl + '/campaign/' + id + '/kits');
  }

  createCompaign(campagne: any) {
    return this.http.post(sattUrl + '/campaign/launch/performance', campagne);
  }

  launchCampaignWithBounties(campaign: any) {
    return this.http.post(`${sattUrl}/campaign/launchBounty`, campaign);
  }

  createNewDraftCampaign(
    draftCampaign: any
  ): Observable<IApiResponse<ICampaignResponse>> {
    return this.http
      .post<IApiResponse<ICampaignResponse>>(
        `${sattUrl}/campaign/save`,
        draftCampaign
      )
      .pipe(shareReplay(1));
  }

  removeKit(id_kit: any) {
    return this.http.delete(sattUrl + '/campaign/kit/' + id_kit);
  }

  verifyLink(linkApplication: any) {
    return this.http.get(
      sattUrl +
        '/profile/link/verify/' +
        linkApplication.typeSN +
        '/' +
        linkApplication.idUser +
        '/' +
        (linkApplication.idPost || localStorage.getItem('idPost'))
    );
  }

  applyLink(
    campaign: any,
    application: any,
    title: string,
    password: any,
    hash: string
  ) {
    return this.http.post(sattUrl + '/campaign/apply', {
      idCampaign: campaign,
      typeSN: application.typeSN,
      idPost: application.idPost,
      idUser: application.idUser,
      title,
      pass: password,
      hash,
      linkedinId: application.linkedinId,
      version: localStorage.getItem('wallet_version'),
      ...(application.typeSN === 5 && {
        linkedinUserId: application.linkedinUserId
      })
    });
  }

  redirect(url: any) {
    return this.http.get(url, { observe: 'response' });
  }

  modifytKit(kits: any, campaignId: any) {
    let formData = new FormData();

    // console.log(kits)
    // for(let key in kits){
    //   console.log(key)
    //   console.log(kits[key])

    //   if(key === 'url'){
    //     formData.append("link", kits[key]);
    //   }
    //   if  (key === 'file'){
    //     formData.append("file", kits[key]);
    //   }
    // }

    //     kits.forEach((element: any) => {
    // console.log(element)
    // if (element.new) {

    //         if (element.link) {
    //           formData.append("link", element.link);

    //         } else {
    //           formData.append("file", element.file);
    //          }
    //       }
    //     });

    kits.forEach((element: any, index: any, array: any) => {
      if (index === array.length - 1) {
        if (element.new) {
          if (element.link) {
            formData.append('link', element.link);
          } else {
            formData.append('file', element.file);
          }
        }
      }
    });

    //   for (var i = 0, len = kits.length; i < len; i++) {
    //     console.log(kits[i])

    // if (kits[i].new){
    //   if (kits[i].link) {
    //     formData.append("link", kits[i].link);

    //   } else {
    //     formData.append("file", kits[i].file);
    //    }
    // }

    //     }

    formData.append('campaign', campaignId);

    // var data={link,campaign:Kits[0].campaign}

    // formData.append('data', JSON.stringify(data));

    return this.http
      .post(sattUrl + '/campaign/addKits', formData, {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(
        catchError(() => {
          //TODO: handle errors with services.
          //console.log("error saving kits");
          return of({
            error:
              'an error ocured when trying to save your data please try again.'
          });
        }),
        shareReplay(1)
      );
  }

  getKitPic(fileId: any) {
    return this.http.get(sattUrl + '/campaign/kit/' + fileId, {
      responseType: 'blob'
    });
  }

  /**
   * Update one campaign by id.
   * @param values to be updated.
   * @param id campaign identifier.
   * @returns {Observable<any>}
   */
  updateOneById(
    values: any,
    id: string
  ): Observable<IApiResponse<ICampaignResponse> | null> {
    return this.http
      .put<IApiResponse<ICampaignResponse>>(
        `${sattUrl}/campaign/update/${id}`,

        values
      )
      .pipe(
        catchError(() => of(null)),
        retry(1),
        shareReplay(1)
      );
  }

  approvalERC20(erc20: any) {
    return this.http.post(sattUrl + '/campaign/erc20/approval', {
      tokenAddress: erc20.addr,
      campaignAddress: campaignSmartContractERC20
    });
  }

  approveBEP20(bep20: any) {
    return this.http.post(sattUrl + '/campaign/bep20/approval', {
      tokenAddress: bep20.addr,
      campaignAddress: campaignSmartContractBEP20
    });
  }

  approveTRON(tron: any) {
    return this.http.post(sattUrl + '/campaign/tron/approval', {
      tokenAddress: tron.addr,
      pass: tron.pass,
      version: localStorage.getItem('wallet_version')
    });
  }

  approvePOLYGON(token: any) {
    return this.http.post(sattUrl + '/campaign/polygon/approval', {
      tokenAddress: token.addr,
      campaignAddress: campaignSmartContractPOLYGON
    });
  }

  approveBTT(token: any) {
    return this.http.post(sattUrl + '/campaign/btt/approval', {
      tokenAddress: token.addr,
      campaignAddress: campaignSmartContractBTT
    });
  }

  allowERC20(erc20: any, password: any) {
    let amount = '999999999999999999999999999999999999999999999999999999999';
    return this.http.post(sattUrl + '/campaign/erc20/allow', {
      // access_token: this.tokenStorageService.getToken(),
      campaignAddress: campaignSmartContractERC20,
      amount: amount,
      tokenAddress: erc20.addr,
      pass: password
    });
  }

  allowBEP20(bep20: any, password: any) {
    let amount = '999999999999999999999999999999999999999999999999999999999';
    // const BEP20 = ListTokens["SATTBEP20"].contract;
    return this.http.post(sattUrl + '/campaign/bep20/allow', {
      campaignAddress: campaignSmartContractBEP20,
      amount: amount,
      pass: password,
      tokenAddress: bep20.addr
    });
  }

  allowPOLYGON(token: any, password: any) {
    let amount = '999999999999999999999999999999999999999999999999999999999';
    // const BEP20 = ListTokens["SATTBEP20"].contract;
    return this.http.post(sattUrl + '/campaign/polygon/allow', {
      campaignAddress: campaignSmartContractPOLYGON,
      amount: amount,
      pass: password,
      tokenAddress: token.addr
    });
  }

  allowTRON(tron: any, password: any) {
    let amount = '999999999999999999999999999999999999999999999999999999999';
    // const BEP20 = ListTokens["SATTBEP20"].contract;
    return this.http.post(sattUrl + '/campaign/tron/allow', {
      amount: amount,
      pass: password,
      tokenAddress: tron.addr
    });
  }

  allowBTT(token: any, password: any) {
    let amount = '999999999999999999999999999999999999999999999999999999999';
    // const BEP20 = ListTokens["SATTBEP20"].contract;
    return this.http.post(sattUrl + '/campaign/BTT/allow', {
      campaignAddress: campaignSmartContractBTT,
      amount: amount,
      pass: password,
      tokenAddress: token.addr
    });
  }

  validateLinks(prom: any, Password: any, id: any, fromNotification?: boolean) {
    if(fromNotification) {
      return this.http.post(sattUrl + '/campaign/validate', {
        idCampaign: prom.cmp_hash || id,
        idProm: prom.link._id,
        link: prom.link.idPost,
        idLink: prom.link._id,
        pass: Password,
        lang: this.tokenStorageService.getLocalLang()
      });
    }  else
    return this.http.post(sattUrl + '/campaign/validate', {
      idCampaign: prom.campaign._id || id,
      idProm: prom.hash,
      link: prom.link,
      email: prom.meta.email,
      idLink: prom.id,
      idUser: prom.meta._id,
      pass: Password,
      lang: this.tokenStorageService.getLocalLang()
    });
  }

  rejectLinks(
    prom: any,
    reason: any,
    campaignid: string,
    titleCampaign: string,
    fromNotif?: boolean
  ) {
    console.log({prom: prom})
    return this.http.put(
      `${sattUrl}/campaign/reject/${ fromNotif ? prom._id : prom.id}`,
      {
        idCampaign: campaignid,
        reason: reason,
        title: titleCampaign,
        email: prom.meta?.email || prom.idUser,
        idUser: prom.meta?._id || prom.idUser,
        link: prom.link || prom.idPost ,
        lang: this.tokenStorageService.getLocalLang()
      }
    );
  }

  getCampaignStatics(campaignId: string) {
    return this.http.get(`${sattUrl}/campaign/statistics/${campaignId}`);
  }

  videoDescription(idPost: any, oracle?: any) {
    if (oracle === 'youtube') {
      return this.http.get(`${env.YOUTUBE_OEMBED_LINK}${idPost}&format=json`);
    }
    return of({});
  }

  linkedinSharedid(idPost: any) {
    return this.http.get(
      sattUrl + '/profile/linkedin/ShareByActivity/' + idPost
    );
  }

  public inProgressCampaign(id: any) {
    this.tokenStorageService.removeProgressCampaign();
    this.tokenStorageService.setProgressCampaign(id);
  }
  public getProgressCampaign() {
    return this.tokenStorageService.getProgressCampaign();
  }

  getAllPromsStats(campaignId: string, isOwnedByUser: boolean) {
    if (!isOwnedByUser) {
      return this.http.get(
        sattUrl +
          '/campaign/campaignPrompAll/' +
          campaignId +
          '?influencer=' +
          this.tokenStorageService.getIdWallet()
      );
    } else {
      return this.http.get(
        sattUrl + '/campaign/campaignPrompAll/' + campaignId
      );
    }
  }

  userParticipations(
    page = 1,
    size = 10,
    queryParams: HttpParams = new HttpParams(),
    campaignId = '',
    state = ''
  ): Observable<any> {
    queryParams = queryParams.set('page', '' + page).set('limit', '' + size);
    let queryParamsCamp = queryParams
      .set('campaign', campaignId)
      .set('state', state)
      .set('page', '' + page)
      .set('limit', '' + size)
      .set('version', '' + this.tokenStorageService.getWalletVersion());
    let idUser = this.tokenStorageService.getUserId();

    return this.http
      .get(sattUrl + '/campaign/filterLinks/' + idUser, {
        params: campaignId ? queryParamsCamp : queryParams
      })
      .pipe(share());
  }

  allCampaigns(
    page = 1,
    size = 1,
    queryParams: HttpParams = new HttpParams()
  ): Observable<ICampaignsListResponse> {
    const walletId = !!this.tokenStorageService.getToken()
      ? (this.tokenStorageService.getIdWallet() as string)
      : '';
    let queryParams2 = queryParams
      .set('idWallet', walletId)
      .set('page', '' + page)
      .set('limit', '' + size);
    return this.http
      .get<ICampaignsListResponse>(` ${sattUrl}/campaign/campaigns`, {
        params: queryParams2
      })
      .pipe(share());
  }

  getStatisticsCampaign(hash: any) {
    return this.http.get(`${sattUrl}/campaign/statLinkCampaign/` + hash);
  }

  getFbUserName(linkApplication: any) {
    return this.http.get(
      sattUrl + '/profile/link/verify/fbUserName/' + linkApplication
    );
  }

  expandUrl(shortUrl: string) {
    return this.http.get(sattUrl + '/campaign/expandLink?shortUrl=' + shortUrl);
  }

  getWelcomePageStats() {
    return this.http.get(sattUrl + '/campaign/statistics');
  }

  getWalletsCount() {
    return this.http.get(sattUrl + '/wallet/countWallets');
  }

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
