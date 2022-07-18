import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { GazConsumedByCampaign } from '@config/atn.config';

@Component({
  selector: 'app-buy-gas',
  templateUrl: './buy-gas.component.html',
  styleUrls: ['./buy-gas.component.scss']
})
export class BuyGasComponent implements OnInit, OnChanges {
  bnb: any;
  eth: any;
  matic: any;
  gazsend: any;
  networkGas: any;
  @Input() networkName: any;
  networkProtocol: any;
  activatedRoute: ActivatedRoute | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private walletFacade: WalletFacadeService,
    private router: Router
  ) {}

  ngOnChanges(): void {
    if (!!this.networkName) {
      this.getGasPrice(this.networkName).subscribe();
    }
  }

  ngOnInit(): void {
    /*  this.route.queryParams
      .pipe(
        mergeMap((params) => {
          this.networkName = params.network;
          return this.getGasPrice(params.network);
        })
      )
      .subscribe((res) => {
        console.log(res);
      });*/
  }

  getGasPrice(network: string) {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      take(1),
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        this.matic = data['MATIC'].price;
        return {
          bnb: this.bnb,
          eth: this.eth,
          matic: this.matic
        };
      }),
      switchMap(({ bnb, eth, matic }) => {
        return this.walletFacade.getGazByNetwork(network).pipe(
          take(1),
          tap((gaz: any) => {
            let price;
            price = gaz.data.gasPrice;
            switch (network.toLowerCase()) {
              case 'bep20': {
                this.networkProtocol = 'BNB';
                this.gazsend = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  bnb
                ).toFixed(2);
                this.networkGas = this.gazsend;
                break;
              }
              case 'erc20': {
                this.networkProtocol = 'ETH';

                this.gazsend = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  eth
                ).toFixed(2);
                this.networkGas = this.gazsend;
                break;
              }
              case 'polygon': {
                this.networkProtocol = 'MATIC';
                this.gazsend = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  matic
                ).toFixed(2);
                this.networkGas = this.gazsend;
                break;
              }
              default: {
                this.gazsend = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  bnb
                ).toFixed(2);
                this.networkGas = this.gazsend;
              }
            }
          })
        );
      })
    );
  }

  buyGas() {
    if (
      this.networkProtocol.toUpperCase() === 'SATT' &&
      this.networkName.toUpperCase() === 'ERC20'
    ) {
      this.networkProtocol = 'SATT-ERC20';
    }
    if (
      this.networkProtocol.toUpperCase() === 'SATT' &&
      this.networkName.toUpperCase() === 'BEP20'
    ) {
      this.networkProtocol = 'SATT-SC';
    }
    this.router.navigate(['/wallet/buy-token'], {
      queryParams: {
        id: this.networkProtocol.toUpperCase(),
        network: this.networkName.toUpperCase()
      },
      relativeTo: this.activatedRoute
    });
  }
}
