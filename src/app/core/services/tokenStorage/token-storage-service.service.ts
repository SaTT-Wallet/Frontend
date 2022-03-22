import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageRefService } from '../localstorage-ref/local-storage-ref-service.service';
import { sattUrl } from '@app/config/atn.config';
const TOKEN_KEY = 'access_token';
const isAuth = 'isAuthenticated';
const idWallet = 'wallet_id';
const expiresIn = 'expires_in';
const localLang = 'local';
const progCampaign = 'ProgressCampaign';
const userId = 'userId';
const idSn = 'idSn';
const url = 'url';
const phoneNumber = 'phoneNumber';
const valid2FA = 'valid2FA';
const enable = 'enabled';
const network = 'network';
const secure = 'secure';
const hideRedBloc = 'hideRedBloc';
const userIdPost = 'userIdPost';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(
    public cookie: CookieService,
    private localStorage: LocalStorageRefService,
    private http: HttpClient
  ) {}
  headers: any;
  imgheader: any;
  multiFileheader: any;
  expireToken: any;
  url: any;
  signOut(): void {
    this.localStorage.clear();
    this.logout().subscribe();
  }
  setHeader() {
    this.headers = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.localStorage.getItem('access_token')
    });
  }
  setImgheader() {
    this.imgheader = new HttpHeaders({
      accept: 'image/webp,image/*,*/*;q=0.8',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'ATN-Node': '0' + this.localStorage.getItem(userId),
      Authorization: 'Bearer ' + this.localStorage.getItem('access_token')
    });
  }
  getMultiFileheader() {
    this.multiFileheader = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Cache-Control': 'no-store',
      'ATN-Node': '0' + this.localStorage.getItem(userId),
      Authorization: 'Bearer ' + this.localStorage.getItem('access_token')
    });
  }
  getHeader() {
    return {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.localStorage.getItem('access_token')
    };
  }

  public saveToken(token: string): void {
    //this.localStorage.removeItem(TOKEN_KEY);
    this.localStorage.setItem(TOKEN_KEY, token);
    this.localStorage.setItem(isAuth, 'true');
  }
  public saveUserId(id: any) {
    this.localStorage.setItem(userId, id);
  }
  public saveUserEmail(userEmail: any) {
    this.localStorage.setItem('userEmail', userEmail);
  }

  public saveUrlCampaign(urlLink: any) {
    this.localStorage.removeItem(url);
    this.localStorage.setItem(url, urlLink);
  }
  public getUrlCampaign() {
    return this.localStorage.getItem(url);
  }
  public setUsernew() {
    this.localStorage.setItem('newUSer', 'false');
  }
  public getUserId() {
    return this.localStorage.getItem(userId);
  }
  public saveIdSn(id: string) {
    this.localStorage.setItem(idSn, id);
  }
  public getUserSn() {
    this.localStorage.getItem(idSn);
  }
  public setUserSn(id: string) {
    this.localStorage.setItem(idSn, id);
  }

  public getIsAuth() {
    return this.localStorage.getItem(isAuth);
  }

  public setIsAuth(value: string) {
    this.localStorage.setItem(isAuth, value);
  }

  public getToken() {
    return this.localStorage.getItem(TOKEN_KEY);
  }
  public getNetwork() {
    return this.localStorage.getItem(network);
  }
  public saveIdWallet(adress: string): void {
    this.localStorage.removeItem(idWallet);
    this.localStorage.setItem(idWallet, adress);
  }
  public getIdWallet() {
    return this.localStorage.getItem(idWallet);
  }

  public saveExpire(time: any): void {
    this.localStorage.setItem(expiresIn, time);
  }

  public getExpire() {
    return this.localStorage.getItem(expiresIn);
  }
  public getFillMyProfil() {
    return this.localStorage.getItem('Fill_my_profil');
  }
  public setFillMyProfil(value: string) {
    return this.localStorage.setItem('Fill_my_profil', value);
  }
  public getCookies() {
    return this.localStorage.getItem('Cookies');
  }
  public setCookies(value: string) {
    return this.localStorage.setItem('Cookies', value);
  }
  public setStateVisited(value: string) {
    return this.localStorage.setItem('visited', value);
  }
  public getStateVisited() {
    return this.localStorage.getItem('visited');
  }
  public setShowPopUp(value: string) {
    return this.localStorage.setItem('toggle', value);
  }
  public getShowPopUp() {
    return this.localStorage.getItem('toggle');
  }
  getLocale() {
    return this.localStorage.getItem('local');
  }
  public setSecureWallet(name: string, value: string) {
    return this.localStorage.setItem(name, value);
  }
  public getSecureWallet(name: string) {
    return this.localStorage.getItem(name);
  }

  public setIdPost(idPost: any) {
    return this.localStorage.setItem('idPost', idPost);
  }
  public getIdPost() {
    return this.localStorage.getItem('idPost');
  }
  public getIdUserPost() {
    return this.localStorage.getItem(userIdPost);
  }
  public setIdUserPost(id: any) {
    return this.localStorage.setItem(userIdPost, id);
  }
  public setIdUser(id: any) {
    return this.localStorage.setItem(userId, id);
  }
  public getIdUser() {
    return this.localStorage.getItem(userId);
  }

  public setTypeSN(typeSN: any) {
    return this.localStorage.setItem('typeSN', typeSN);
  }
  public getTypeSN() {
    return this.localStorage.getItem('typeSN');
  }
  public setItem(key: string, value: string) {
    return this.localStorage.setItem(key, value);
  }
  public removeItem(key: string) {
    this.localStorage.removeItem(key);
  }
  logout() {
    let header = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    });
    return this.http.get(sattUrl + '/logout', {
      headers: header
    });
  }
  public getLocalLang() {
    return this.localStorage.getItem(localLang);
  }
  public setLocalLang(lang: string): void {
    return this.localStorage.setItem(localLang, lang);
  }
  public removeLocalLang() {
    return this.localStorage.removeItem(localLang);
  }
  public getProgressCampaign() {
    return this.localStorage.getItem(progCampaign);
  }
  public setProgressCampaign(prog: string): void {
    return this.localStorage.setItem(progCampaign, prog);
  }
  public removeProgressCampaign() {
    return this.localStorage.removeItem(progCampaign);
  }
  public getPhoneNumber() {
    return this.localStorage.getItem(phoneNumber);
  }
  public setPhoneNumber(phone: string): void {
    return this.localStorage.setItem(phoneNumber, phone);
  }
  public removePhoneNumber() {
    return this.localStorage.removeItem(phoneNumber);
  }
  public getvalid2FA() {
    return this.localStorage.getItem(valid2FA);
  }
  public setvalid2FA(is2fa: string): void {
    return this.localStorage.setItem(valid2FA, is2fa);
  }
  public removevalid2FA() {
    return this.localStorage.removeItem(valid2FA);
  }
  public getEnabled() {
    return this.localStorage.getItem(enable);
  }
  public setEnabled(enab: string): void {
    return this.localStorage.setItem(enable, enab);
  }
  public removeEnabled() {
    return this.localStorage.removeItem(enable);
  }
  public getSecure() {
    return this.localStorage.getItem(secure);
  }
  public getHideRedBloc() {
    return this.localStorage.getItem(hideRedBloc);
  }
  public getPayementId() {
    return this.localStorage.getItem('payementId');
  }
  public getCrypto() {
    return this.localStorage.getItem('Crypto');
  }
  public getCryptoCryptoAmount() {
    return this.localStorage.getItem('CryptoCryptoAmount');
  }
  public getQuoteId() {
    return this.localStorage.getItem('quoteId');
  }
  public getWalletBtc() {
    return this.localStorage.getItem('wallet_btc');
  }
  public getCryptoClic() {
    return this.localStorage.getItem('cryptoClic');
  }
}
