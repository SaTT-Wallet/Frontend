import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private cryptoDetails: any = [];

  setCryptoDetails(data: any): void {
    this.cryptoDetails = data;
  }

  getCryptoDetails(): any {
    return this.cryptoDetails;
  }
}
