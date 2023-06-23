import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ContactMessageService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

 
  //////////////solde satt
  // factory($http: any, $q: any, localStorage: any) {
  //   let token = false;
  //   let accounts: any = [];
  //   let friends = false;
  //   let address = false;
  //   let eth = 0;

  //   let factory = {
  //     getToken: function () {
  //       return token || localStorage.fbAccessToken;
  //     },
  //     setToken: function (tk: any) {
  //       token = tk;
  //     },
  //     getAccounts: function () {
  //       return accounts;
  //     },
  //     setAccounts: function (acc: any) {
  //       accounts = acc;
  //     },
  //     getAddress: function () {
  //       return address;
  //     },
  //     setAddress: function (addr: any) {
  //       address = addr;
  //     },
  //     getEthUsd: function () {
  //       return eth;
  //     },
  //     setEthUsd: function (price: any) {
  //       eth = price;
  //     },
  //     getFriends: function () {
  //       return friends || localStorage.fbFriends;
  //     },
  //     setFriends: function (frds: any) {
  //       friends = frds;
  //     }
  //   };
  // }

  

  reveiveMoney(contact: any) {
    return this.http.post(sattUrl + '/profile/receiveMoney', contact);
  }
}
