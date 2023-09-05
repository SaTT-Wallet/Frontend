import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as http from 'http';

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

  listIdToken() {
    return this.http.get('https://api.coingecko.com/api/v3/coins/list');
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

  marketChartToken(
    cryptoId: string,
    currency: string,
    days: string
  ) {
  
    
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
