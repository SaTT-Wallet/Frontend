import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as http from 'http';
import { Observable } from 'rxjs';
import { IResponseWallet } from '../iresponse-wallet';
import { sattUrl } from '@app/config/atn.config';

@Injectable({
  providedIn: 'root'
})
export class CryptoInfoService {
  constructor(private http: HttpClient) {}
  getHighchartsData() {
    return this.http.get(
      'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json'
    );
  }

  listIdToken(): Observable<any[]> {
    const url = `  https://api.coingecko.com/api/v3/coins/list`;
    return this.http.get<any[]>(url);
  }

  historiqueToken(
    cryptoId: string,
    currency: string,
    from: number,
    to: number
  ) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`
    );
  }
  tokenMarketHistory(cryptoId: string, date: string) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}/history?date=${date}`
    );
  }

  getCharts(id:any, range:any) {
    return this.http.post<IResponseWallet>(sattUrl + '/wallet/getCharts', {
      id: id,
      range: range
    });
  }

  marketChartToken(cryptoId: string, currency: string, days: string) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currency}&days=${days}`
    );
  }
  getCryptoInfoById(cryptoId: string, currency: string) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${cryptoId}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
  }

  generalTokenInfos(cryptoId: string) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}?tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=true`
    );
  }
}
