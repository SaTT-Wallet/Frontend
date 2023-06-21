import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from '@environments/environment';




@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  // List of public API endpoints
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
    // Add more private endpoints here /wallet/export-keystore /campaign/statLinkCampaign/
  ]; 

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    console.log({request})
    console.log({publicEndPoints: this.privateEndPoints})
    // Check if the URL of the current request is not in the list of public endpoints
    if (this.privateEndPoints.some(url => request.url.startsWith(url))) {
      
      // If the URL is not in the list, clone the request and add the token
      const modifiedRequest = request.clone({
        setHeaders: this.getHeader()
      });

      // Pass the modified request to the next handler
      return next.handle(modifiedRequest);
    }

    // If the URL is in the list of public endpoints, pass the original request to the next handler
    return next.handle(request);
  }


  getHeader() {
    let headers: { [header: string]: string } = {
      'Cache-Control': 'no-store',
      
    };
      
    const token = window.localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return headers;
  }
}

