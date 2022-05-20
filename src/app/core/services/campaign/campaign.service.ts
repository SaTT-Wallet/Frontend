import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  sattUrl,
  campaignSmartContractERC20,
  campaignSmartContractBEP20,
  campaignSmartContractPOLYGON
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
import { AuthStoreService } from '../Auth/auth-store.service';
import {
  ICampaignResponse,
  ICampaignsListResponse
} from '@app/core/campaigns-list-response.interface';
import { IApiResponse } from '@app/core/types/rest-api-responses';

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
    private tokenStorageService: TokenStorageService,
    private authStoreService: AuthStoreService
  ) {}

  getMycampaigns() {
    let idWallet = this.tokenStorageService.getIdWallet();
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http
      .get(sattUrl + '/v2/campaigns/influencer/' + idWallet, {
        headers: header
      })
      .pipe(
        //tap((_)=>{console.log(_)}),
        map((data: any) =>
          data.campaigns.filter((campaign: any) => campaign.proms.length)
        )
      );
  }
  /*
     @link : /campaigns/:id
     @description: retrieves all the publisher identifiers of the campaign
     @params:
      id : campaign.meta._id   for activated or ended campaign
      id : _id for draft campaign
     */
  getCampaignbyId(id: any) {
    return this.http.get(sattUrl + '/campaigns/id/' + id, {
      headers: this.tokenStorageService.getHeader()
    });
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

  /*
	@url : /campaign/totalSpent/:owner
	@description: fetching total spending of the user in USD
	@params:
    owner : wallet address of user
	{headers}
	@Output JSON object
	*/
  getTotalSpent() {
    return this.http.get(
      sattUrl +
        '/campaign/totalSpent/' +
        this.tokenStorageService.getIdWallet(),
      { headers: this.tokenStorageService.getHeader() }
    );
  }
  getTotalInvestetd() {
    return this.http.get(sattUrl + '/campaign/invested', {
      headers: this.tokenStorageService.getHeader()
    });
  }
  notifyLink(campaignId: any, link: any, idProm: string) {
    return this.http.post(
      sattUrl + '/campaign/linkNotification',
      { idCampaign: campaignId, link, idProm },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  getTotalBudget(): Observable<any> {
    let idWallet = this.tokenStorageService.getIdWallet();
    return this.http.get(sattUrl + '/campaign/totalEarned/' + idWallet, {
      headers: this.tokenStorageService.getHeader()
    });
  }
  /**
   * Returns the list of created and draft campaigns by user wallet id.
   * @returns {Observable} a http client observable.
   */
  getCampaignsByUserWalletId(
    page = 1,
    size = 10,
    queryParams: HttpParams = new HttpParams()
  ): Observable<any> {
    //let idWallet = this.tokenStorageService.getIdWallet();

    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    queryParams = queryParams.set('page', '' + page).set('limit', '' + size);
    return this.http
      .get(`${sattUrl}/v2/campaigns/owner`, {
        params: queryParams,
        headers: header
      })
      .pipe(share());
  }

  /**
   * Possible duplicate api in the backend.
   * @returns {Observable<any>} Http client observable.
   */
  getCampaignsList(
    page = 1,
    size = 10,
    queryParams: HttpParams = new HttpParams()
  ): Observable<any> {
    let idWallet = this.tokenStorageService.getIdWallet();
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    queryParams = queryParams.set('page', '' + page).set('limit', '' + size);

    return this.http
      .get(
        `
      ${sattUrl}/v2/campaigns/influencer/${idWallet}`,
        {
          params: queryParams,
          headers: header
        }
      )
      .pipe(share());
  }

  getAcceptedPromsbyOwner(walletId: any, campainId: any) {
    return this.http.post(
      sattUrl + '/campaigns/owner_accepted_proms',
      { id_wallet: walletId, id_campaign: campainId },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  getOneById(id: string): Observable<IApiResponse<ICampaignResponse>> {
    return this.http.get<IApiResponse<ICampaignResponse>>(
      sattUrl + '/campaign/details/' + id,
      {
        headers: this.tokenStorageService.getHeader()
      }
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
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      `${sattUrl}/campaign/gains`,
      {
        idProm,
        pass: password,
        hash
      },
      { headers: httpHeaders }
    );
  }

  getBestInfluencerPic(id: any) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(sattUrl + `/profile/picture?id=${id}`, {
      responseType: 'blob',
      headers: headers
    });
  }

  /*
     @link : /campaign/:id/proms
     @description: retrieves all the publisher identifiers of the campaign
     @params:
     idCampaign : campaign id
     */
  getCampaignEditors(idCampaign: any) {
    return this.http.get(sattUrl + '/campaign' + idCampaign + '/proms', {
      headers: this.tokenStorageService.getHeader()
    });
  }

  checkUrl(checkLink: any) {
    return this.http.get(
      sattUrl +
        '/campaign/checklink' +
        `/${checkLink.typeSN}` +
        `/${checkLink.idUser}` +
        `/${checkLink.idPost}`,
      { headers: this.tokenStorageService.getHeader() }
    );
  }
  increaseBudget(Budget: any) {
    Budget.token = this.tokenStorageService.getToken();
    return this.http.post(
      sattUrl + '/campaign/fund',
      {
        idCampaign: Budget.idCampaign,
        ERC20token: Budget.ERC20token,
        amount: Budget.amount,
        pass: Budget.pass,
        token: Budget.token
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }
  /**
     @link : /campaign/apply
     @description: permet à un éditeur de postuler à une campagne
     @parameters :
     idCampaign : identifiant de campagne
     typeSN : type de réseau social (1:facebook,2:youtube,3:instagram,4:twitter)
     idPost : identifiant du post selon le reseau social
     idUser : identifiant de l’utilisateur selon le reseau social
     @response :  renvoie un identifiant d'éditeur
     */
  campaignApply(campaign: any, application: any, password: any) {
    // let token = this.tokenStorageService.getToken();
    return this.http.post(
      sattUrl + '/v2/campaign/apply',
      {
        idCampaign: campaign.meta.hash,
        typeSN: application.typeSN,

        idPost: application.idPost,
        idUser: application.idUser,
        pass: password
      },
      { headers: this.tokenStorageService.getHeader() }
    );
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

  getCampaignLogo(id: any) {
    return this.http
      .get(sattUrl + '/campaign/' + id + '/logo', {
        responseType: 'blob',
        headers: this.tokenStorageService.getHeader()
      })
      .pipe(
        retry(1),
        catchError(() => of(null))
      );
  }

  addCampaignLog(file: File, id?: any) {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('campaign', id);
    let _id = this.campaignData?.id || id;
    return this.http
      .post(sattUrl + '/campaign/' + _id + '/logo', formData, {
        //reportProgress: true,
        observe: 'events',
        headers: {
          Authorization: 'Bearer ' + this.tokenStorageService.getToken()
        }
      })
      .pipe(takeLast(1));
  }
  deleteDraft(id: any) {
    return this.http
      .delete(sattUrl + '/campaign/deleteDraft' + `/${id}`, {
        headers: this.tokenStorageService.getHeader()
      })
      .pipe(shareReplay(1));
  }

  getCampaignKitUrl(id: any) {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json'
      // Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get(sattUrl + '/campaign/' + id + '/kits', {
      headers: httpHeaders
    });
  }

  createCompaign(campagne: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(sattUrl + '/campaign/launch/performance', campagne, {
      headers: header
    });
  }

  launchCampaignWithBounties(campaign: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.post(`${sattUrl}/campaign/launchBounty`, campaign, {
      headers: header
    });
  }

  createNewDraftCampaign(
    draftCampaign: any
  ): Observable<IApiResponse<ICampaignResponse>> {
    const token = this.tokenStorageService.getToken();

    const header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    return this.http
      .post<IApiResponse<ICampaignResponse>>(
        `${sattUrl}/campaign/save`,
        draftCampaign,
        { headers: header }
      )
      .pipe(shareReplay(1));
  }

  // bellehi fahemni chma3neha "upsert" ??????
  upsert(campagne: any, cover?: any) {
    return this.http
      .post(sattUrl + '/campaigns', campagne, {
        headers: this.tokenStorageService.getHeader()
      })
      .pipe(
        mergeMap((data: any) => {
          this.campaignData = data.campaign;
          if (cover) {
            // let file = { file: cover, campaign: data.campaign.id };
            return this.addCover(cover, data.campaign._id);
          }
          return of(null);
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe();
  }

  removeKit(id_kit: any) {
    return this.http.delete(sattUrl + '/campaign/kit/' + id_kit, {
      headers: this.tokenStorageService.getHeader()
    });
  }

  getCampaignKitResource(campaignId: string, kitId: string) {
    return this.http.get(`${sattUrl}/campaigns/${campaignId}/kits/${kitId}`, {
      headers: this.tokenStorageService.getHeader()
    });
  }

  upsertbudget(campagne: any, campaign_id?: any) {
    if (campaign_id) {
      return this.http
        .put(sattUrl + '/campaigns' + '/' + campaign_id, campagne, {
          headers: this.tokenStorageService.getHeader()
        })
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data: any) => {
          this.campaignData = data.campaign;
        });
    } else {
      return this.http
        .put(sattUrl + '/campaigns' + '/' + this.campaignData.id, campagne, {
          headers: this.tokenStorageService.getHeader()
        })
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data: any) => {
          this.campaignData = data.campaign;
        });
    }
  }

  addCover(file: File, id?: any) {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('campaign', id);
    let _id = this.campaignData?.id || id;
    return this.http
      .post(sattUrl + '/campaign/' + _id + '/cover', formData, {
        //reportProgress: true,
        observe: 'events',
        headers: {
          Authorization: 'Bearer ' + this.tokenStorageService.getToken()
        }
      })
      .pipe(takeLast(1));
  }

  deleteCover(campaign_id: any) {
    this.http
      .delete(sattUrl + '/campaigns/' + campaign_id + '/covers', {
        headers: this.tokenStorageService.getHeader()
      })
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {});
  }

  checkForCover(campaign_id: any) {
    return this.http.get(sattUrl + '/campaign/' + campaign_id + '/cover', {
      headers: this.tokenStorageService.getHeader()
    });
  }

  verifyLink(linkApplication: any) {
    return this.http.get(
      sattUrl +
        '/profile/link/verify/' +
        linkApplication.typeSN +
        '/' +
        linkApplication.idUser +
        '/' +
        linkApplication.idPost,
      {
        headers: {
          Authorization: 'Bearer ' + this.tokenStorageService.getToken()
        }
      }
    );
  }

  applyLink(
    campaign: any,
    application: any,
    title: string,
    password: any,
    hash: string
  ) {
    // let token = this.tokenStorageService.getToken();
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      sattUrl + '/campaign/apply',
      {
        idCampaign: campaign,
        typeSN: application.typeSN,
        idPost: application.idPost,
        idUser: application.idUser,
        title,
        pass: password,
        hash
      },
      { headers: header }
    );
  }

  redirect(url: any) {
    return this.http.get(url, { observe: 'response' });
  }

  upsertKit(Kits: any) {
    Kits.forEach((element: any) => {
      if (element.file) {
        let formData = new FormData();
        formData.append('file', element.file);
        formData.append('campaign', element.campaign);
        return this.http
          .post(
            'https://wallet-preprod.iframe-apps.com:3014/api/v1/campaigns/' +
              this.campaignData.id +
              '/kits',
            formData,
            {
              reportProgress: true,
              observe: 'events',
              headers: {
                Authorization: 'Bearer ' + this.tokenStorageService.getToken()
              }
            }
          )
          .pipe(takeUntil(this.isDestroyed))
          .subscribe();
      } else {
        return this.http
          .post(
            'https://wallet-preprod.iframe-apps.com:3014/api/v1/campaigns/' +
              this.campaignData.id +
              '/kits',
            element,
            { headers: this.tokenStorageService.getHeader() }
          )
          .pipe(takeUntil(this.isDestroyed))
          .subscribe();
      }
    });
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
        observe: 'events',
        headers: {
          Authorization: 'Bearer ' + this.tokenStorageService.getToken()
        }
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
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get(sattUrl + '/campaign/kit/' + fileId, {
      responseType: 'blob',
      headers: httpHeaders
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

        values,

        {
          headers: this.tokenStorageService.getHeader()
        }
      )
      .pipe(
        catchError(() => of(null)),
        retry(1),
        shareReplay(1)
      );
  }

  modifier(modification: any, cover: any, campaign_id: any) {
    return this.http.put(
      sattUrl + '/campaigns' + '/' + campaign_id,
      modification,
      {
        headers: this.tokenStorageService.getHeader()
      }
    );
    // .subscribe(() => {
    //   if (cover) {
    //     this.addCover(cover, campaign_id);
    //   }
    // });
  }

  approvalERC20(erc20: any) {
    return this.http.post(
      sattUrl + '/campaign/erc20/approval',
      {
        tokenAddress: erc20.addr,
        campaignAddress: campaignSmartContractERC20
      },

      { headers: this.tokenStorageService.getHeader() }
    );
  }

  approveBEP20(bep20: any) {
    return this.http.post(
      sattUrl + '/campaign/bep20/approval',
      {
        tokenAddress: bep20.addr,
        campaignAddress: campaignSmartContractBEP20
      },

      { headers: this.tokenStorageService.getHeader() }
    );
  }

  approvePOLYGON(token: any) {
    return this.http.post(
      sattUrl + '/campaign/polygon/approval',
      {
        tokenAddress: token.addr,
        campaignAddress: campaignSmartContractPOLYGON
      },

      { headers: this.tokenStorageService.getHeader() }
    );
  }

  allowERC20(erc20: any, password: any) {
    let amount = '100000000000000000000000000000';
    return this.http.post(
      sattUrl + '/campaign/erc20/allow',
      {
        // access_token: this.tokenStorageService.getToken(),
        campaignAddress: campaignSmartContractERC20,
        amount: amount,
        tokenAddress: erc20.addr,
        pass: password
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  allowBEP20(bep20: any, password: any) {
    let amount = '100000000000000000000000000000';
    // const BEP20 = ListTokens["SATTBEP20"].contract;
    return this.http.post(
      sattUrl + '/campaign/bep20/allow',
      {
        campaignAddress: campaignSmartContractBEP20,
        amount: amount,
        pass: password,
        tokenAddress: bep20.addr
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  allowPOLYGON(token: any, password: any) {
    let amount = '100000000000000000000000000000';
    // const BEP20 = ListTokens["SATTBEP20"].contract;
    return this.http.post(
      sattUrl + '/campaign/polygon/allow',
      {
        campaignAddress: campaignSmartContractPOLYGON,
        amount: amount,
        pass: password,
        tokenAddress: token.addr
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  eRC20Fee(FeeObj: any) {
    return this.http.post(sattUrl + '/v2/erc20/transfer', FeeObj, {
      headers: this.tokenStorageService.getHeader()
    });
  }

  getCampaignRatios(campaign_id: any) {
    return this.http.get(sattUrl + '/campaign/' + campaign_id + '/ratios', {
      headers: this.tokenStorageService.getHeader()
    });
  }

  rejectedLinks(campaign_id: any) {
    return this.http.get(
      sattUrl +
        '/campaign/links?idCampaign=' +
        campaign_id +
        '&status=rejected',
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  getRequestOracleStatsByEditor(prom_id: any) {
    return this.http.get(sattUrl + '/prom/' + prom_id + '/results', {
      headers: this.tokenStorageService.getHeader()
    });
  }

  getPromStatsLive(prom_id: any) {
    return this.http.post(
      sattUrl + '/campaign/stats_live',
      { prom_id },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  validateLinks(prom: any, Password: any, id: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.post(
      sattUrl + '/campaign/validate',
      {
        idCampaign: prom.campaign._id || id,
        idProm: prom.hash,
        link: prom.link,
        email: prom.meta.email,
        idUser: prom.meta._id,
        pass: Password,
        lang: this.tokenStorageService.getLocalLang()
      },
      { headers: header }
    );
  }

  rejectLinks(
    prom: any,
    reason: any,
    campaignid: string,
    titleCampaign: string
  ) {
    return this.http.put(
      sattUrl + '/campaign/reject/' + prom.hash,

      {
        idCampaign: campaignid,
        reason: reason,
        title: titleCampaign,
        email: prom.meta.email,
        idUser: prom.meta._id,
        link: prom.link,
        lang: this.tokenStorageService.getLocalLang()
      },
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  getCampaignStatics(campaignId: string) {
    return this.http.get(`${sattUrl}/campaign/statistics/${campaignId}`, {
      headers: this.tokenStorageService.getHeader()
    });
  }

  verifyGains(idProm: any) {
    return this.http.get(`${sattUrl}/proms/verify/${idProm}`, {
      headers: this.tokenStorageService.getHeader()
    });
  }

  videoDescription(idPost: any) {
    return this.http.get(
      `https://www.youtube.com/oembed?url=https%3A//youtube.com/watch%3Fv%3D${idPost}&format=json`
    );
  }
  // twitterDescription(idPost: any) {
  //   let header = new HttpHeaders({
  //     Authorization:
  //       'Bearer' +
  //       'AAAAAAAAAAAAAAAAAAAAAJClVgEAAAAAv3WRQYQO7fY9gQoPNSAhrGcmT1c%3DnsS947JL5AzBZ3KBqaIXRTB12wtz9UG5WuOEKB6mLJHOQZWi6i',
  //     'Cache-Control': 'no-store',
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*'
  //   });
  //   return this.http.get(`https://api.twitter.com/2/tweets/${idPost}`, {
  //     headers: header
  //   });
  // }
  linkedinSharedid(idPost: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(
      sattUrl + '/profile/linkedin/ShareByActivity/' + idPost,
      {
        headers: header
      }
    );
  }

  public inProgressCampaign(id: any) {
    this.tokenStorageService.removeProgressCampaign();
    this.tokenStorageService.setProgressCampaign(id);
  }
  public getProgressCampaign() {
    return this.tokenStorageService.getProgressCampaign();
  }

  promsByInfluencer(walletId: any) {
    return this.http.get(`${sattUrl}/campaign/proms/influencer/${walletId}`, {
      headers: this.tokenStorageService.getHeader()
    });
  }
  getAllPromsStats(campaignId: string, isOwnedByUser: boolean) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    // return this.http.get(sattUrl + '/campaign/campaignPrompAll/' + campaignId, {
    //   headers: header
    // });
    //GET  /campaign/APaacgillmmnoppr / console.log(isOwnedByUser);
    if (!isOwnedByUser) {
      return this.http.get(
        sattUrl +
          '/campaign/campaignPrompAll/' +
          campaignId +
          '?influencer=' +
          this.tokenStorageService.getIdWallet(),
        {
          headers: header
        }
      );
    } else {
      return this.http.get(
        sattUrl + '/campaign/campaignPrompAll/' + campaignId,
        {
          headers: header
        }
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
      .set('limit', '' + size);
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    let walletId = this.tokenStorageService.getIdWallet();

    return this.http
      .get(sattUrl + '/campaign/filterLinks/' + walletId, {
        headers: header,
        params: campaignId ? queryParamsCamp : queryParams
      })
      .pipe(share());
  }

  allCampaigns2() {
    return this.http.get(
      `${sattUrl}/v2/campaigns/` + this.tokenStorageService.getIdWallet(),
      { headers: this.tokenStorageService.getHeader() }
    );
  }

  allCampaigns(
    page = 1,
    size = 10,
    queryParams: HttpParams = new HttpParams()
  ): Observable<ICampaignsListResponse> {
    // let idWallet = this.tokenStorageService.getIdWallet() || '';
    // let queryParams1 = queryParams
    //   .set('page', '' + page)
    //   .set('limit', '' + size);
    // let header1 = new HttpHeaders({
    //   'Cache-Control': 'no-store',
    //   'Content-Type': 'application/json',
    //   Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    // });
    const walletId = !!this.tokenStorageService.getToken()
      ? (this.tokenStorageService.getIdWallet() as string)
      : '';
    let queryParams2 = queryParams
      .set('idWallet', walletId)
      .set('page', '' + page)
      .set('limit', '' + size);

    let header2 = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    // if (authStoreService) {
    //   return this.http
    //     .get(` ${sattUrl}/v3/campaigns/` + this.tokenStorageService.getIdWallet(), {
    //       headers: header1,
    //       params: queryParams1
    //     })
    //     .pipe(share());
    // } else {

    return this.http
      .get<ICampaignsListResponse>(` ${sattUrl}/campaign/campaigns`, {
        headers: header2,
        params: queryParams2
      })
      .pipe(share());
    // }
  }
  getStatisticsCampaign(hash: any) {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(`${sattUrl}/campaign/statLinkCampaign/` + hash, {
      headers: header
    });
  }

  getWelcomePageStats() {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get(sattUrl + '/campaign/statistics', {
      headers: header
    });
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
