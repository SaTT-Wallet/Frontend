import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  // List of private API endpoints
  privateEndPoints = [
    // AUTH API
    `${environment.API_URL}/auth/purge`,
    `${environment.API_URL}/auth/changePassword`,
    `${environment.API_URL}/auth/save/firebaseAccessToken`,
    `${environment.API_URL}/auth/updateLastStep`,
    `${environment.API_URL}/auth/disconnect`,
    `${environment.API_URL}/auth/qrCode`,
    `${environment.API_URL}/auth/verifyQrCode`,
    `${environment.API_URL}/auth/verify-token`,

    // WALLET API
    `${environment.API_URL}/wallet/mywallet`,
    `${environment.API_URL}/wallet/allwallets`,
    `${environment.API_URL}/wallet/userBalance`,
    `${environment.API_URL}/wallet/totalBalance`,
    `${environment.API_URL}/wallet/checkWalletToken`,
    `${environment.API_URL}/wallet/addNewToken`,
    `${environment.API_URL}/wallet/transferTokens`,
    `${environment.API_URL}/wallet/getMnemo`,
    `${environment.API_URL}/wallet/verifyMnemo`,
    `${environment.API_URL}/wallet/verifySign`,
    `${environment.API_URL}/wallet/create/v2`,
    `${environment.API_URL}/wallet/add-tron-wallet`,
    `${environment.API_URL}/wallet/removeToken`,
    `${environment.API_URL}/wallet/stats`,
    `${environment.API_URL}/wallet/transfertTokensBep20`,
    `${environment.API_URL}/wallet/checkUserWalletV2`,
    `${environment.API_URL}/wallet/checkIsNewUser`,
    `${environment.API_URL}/wallet/code-export-keystore`,
    `${environment.API_URL}/wallet/export-keystore`,
    `${environment.API_URL}/wallet/getQuote`,
    `${environment.API_URL}/wallet/payementRequest`,
    `${environment.API_URL}/wallet/getBalance`,

    // CAMPAIGN API
    `${environment.API_URL}/campaign/btt/approval`,
    `${environment.API_URL}/campaign/BTT/allow`,
    `${environment.API_URL}/campaign/tron/approval`,
    `${environment.API_URL}/campaign/tron/allow`,
    `${environment.API_URL}/campaign/bep20/approval`,
    `${environment.API_URL}/campaign/bep20/allow`,
    `${environment.API_URL}/campaign/polygon/approval`,
    `${environment.API_URL}/campaign/polygon/allow`,
    `${environment.API_URL}/campaign/erc20/approval`,
    `${environment.API_URL}/campaign/erc20/allow`,
    `${environment.API_URL}/campaign/launch/performance`,
    `${environment.API_URL}/campaign/launchBounty`,
    `${environment.API_URL}/campaign/ipfs`,
    `${environment.API_URL}/campaign/campaignPrompAll/`,
    `${environment.API_URL}/campaign/apply`,
    `${environment.API_URL}/campaign/linkNotification`,
    `${environment.API_URL}/campaign/validate`,
    `${environment.API_URL}/campaign/gains`,
    `${environment.API_URL}/campaign/invested`,
    `${environment.API_URL}/campaign/save`,
    `${environment.API_URL}/campaign/kit`,
    `${environment.API_URL}/campaign/addKits`,
    `${environment.API_URL}/campaign/update`,
    `${environment.API_URL}/campaign/filterLinks`,
    `${environment.API_URL}/campaign/remaining`,
    `${environment.API_URL}/campaign/statLinkCampaign`,
    `${environment.API_URL}/campaign/reject`,
    `${environment.API_URL}/campaign/deleteDraft`,
    `${environment.API_URL}/campaign/generate-brief`,

    // PROFILE API
    `${environment.API_URL}/profile/picture`,
    `${environment.API_URL}/profile/UpdateProfile`,
    `${environment.API_URL}/profile/UserLegal`,
    `${environment.API_URL}/profile/UserIntersts`,
    `${environment.API_URL}/profile/AddUserIntersts`,
    `${environment.API_URL}/profile/UpdateUserIntersts`,
    `${environment.API_URL}/profile/RemoveTwitterChannels`,
    `${environment.API_URL}/profile/RemoveTwitterChannel`,
    `${environment.API_URL}/profile/RemoveGoogleChannels`,
    `${environment.API_URL}/profile/RemoveGoogleChannel`,
    `${environment.API_URL}/profile/RemoveFacebookchannels`,
    `${environment.API_URL}/profile/RemoveFacebookChannel`,
    `${environment.API_URL}/profile/RemoveLinkedInChannels`,
    `${environment.API_URL}/profile/remove`,
    `${environment.API_URL}/profile/RemoveTiktokChannels`,
    `${environment.API_URL}/profile/RemoveTiktokChannel`,
    `${environment.API_URL}/profile/socialAccounts`,
    `${environment.API_URL}/profile/onBoarding`,
    `${environment.API_URL}/profile/receiveMoney`,
    `${environment.API_URL}/profile/add/Legalprofile`,
    `${environment.API_URL}/profile/legalUserUpload`,
    `${environment.API_URL}/profile/notification/seen`,
    `${environment.API_URL}/profile/notification/issend/clicked`,
    `${environment.API_URL}/profile/notifications`,
    `${environment.API_URL}/profile/changeEmail`,
    `${environment.API_URL}/profile/confirmChangeEmail`,
    `${environment.API_URL}/profile/linkedin/ShareByActivity`,
    `${environment.API_URL}/profile/link/verify`,
    `${environment.API_URL}/profile/Tiktok/ProfilPrivacy`,
    `${environment.API_URL}/profile/account`,
    `${environment.API_URL}/profile/check/threads-account`,
    `${environment.API_URL}/profile/add/threads-account`,
    `${environment.API_URL}/profile/remove/threads-account`,
    `${environment.API_URL}/profile/notifications/decision`  
  ]; 

  constructor() { }


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Check if the URL of the current request is in the list of private endpoints
    if (this.privateEndPoints.some((url) => request.url.startsWith(url))) {
      // If the URL is not in the list, clone the request and add the token
      const condition =
        request.url.includes('ipfs') ||
        request.url.includes('addKits') ||
        (request.url.includes('profile/picture') &&
          request.method === 'POST') ||
        request.url.includes('add/Legalprofile');
      const modifiedRequest = request.clone({
        setHeaders: this.getHeader('private', condition)
      });

      // Pass the modified request to the next handler
      return next.handle(modifiedRequest);
    } else {
      const modifiedRequest = request.clone({
        setHeaders: this.getHeader('public')
      });
      return next.handle(modifiedRequest);
    }
  }

  getHeader(type: string, contentType?: boolean) {
    let headers: { [header: string]: string } = {
      'Cache-Control': 'no-store'
    };
    if (type === 'private') {
      if (!contentType) headers['Content-Type'] = 'application/json';
      const token = window.localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }
    } else {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }
}
