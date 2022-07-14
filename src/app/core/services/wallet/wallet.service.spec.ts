import { TestBed } from '@angular/core/testing';
import { WalletService } from './wallet.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { Type } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { sattUrl } from '@app/config/atn.config';
import {
  IApiResponse,
  ITransferTokensResponse
} from '@app/core/types/rest-api-responses';

describe('WalletService', () => {
  let service: WalletService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [WalletService]
    });
    service = TestBed.inject(WalletService);
    httpMock = TestBed.get(
      HttpTestingController as Type<HttpTestingController>
    );
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('call endpoint with POST method', () => {
    service.transferTokens({
      network: 'polygon',
      tokenAddress: '0x0000000000000000000000000000000000001010',
      from: '0x7ccf8e6b1ea2c018ec133299b4d41de4e5b28304',
      to: '0xc8640bc88b5751674e3535ecd398962b69ba9845',
      amount: '100000000000000000',
      walletPassword: '65465456454',
      tokenSymbol: 'MATIC'
    });
    let httpRequest = httpMock.expectOne(`${sattUrl}/wallet/transferTokens`);

    expect(httpRequest.request.method).toBe('POST');
  });

  it('should return a transaction hash indicating that the transfer request was successful', () => {
    let httpResponseBody: IApiResponse<ITransferTokensResponse> = {
      code: 200,
      message: 'success',
      data: {
        transactionHash:
          '0xda1621a8e37d8bac107b3e85767fd9501aaddc311f50973bd0aa4b0275909fdf',
        address: '0x7ccf8e6b1ea2c018ec133299b4d41de4e5b28304',
        to: '0xc8640bc88b5751674e3535ecd398962b69ba9845',
        amount: '100000000000000000'
      }
    };
    service
      .transferTokens({
        network: 'polygon',
        tokenAddress: '0x0000000000000000000000000000000000001010',
        from: '0x7ccf8e6b1ea2c018ec133299b4d41de4e5b28304',
        to: '0xc8640bc88b5751674e3535ecd398962b69ba9845',
        amount: '100000000000000000',
        walletPassword: '65465456454',
        tokenSymbol: 'MATIC'
      })
      .subscribe((responseBody) => {
        expect(responseBody).toEqual(httpResponseBody);
      });

    let httpRequest = httpMock.expectOne(`${sattUrl}/wallet/transferTokens`);
    httpRequest.flush(httpResponseBody);
  });
});
