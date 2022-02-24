import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInfoService {
  constructor(private http: HttpClient) {}
  listIdToken() {
    return this.http.get('https://api.coingecko.com/api/v3/coins/list');
  }
  historiqueToken(
    cryptoName: string,
    currency: string,
    from: number,
    to: number
  ) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoName}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`
    );
  }
  marketChartToken(
    cryptoName: string,
    currency: string,
    days: number,
    interval: any
  ) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/coins/${cryptoName}/market_chart?vs_currency=${currency}&days=${days}&interval=${interval}`
    );
  }
}
