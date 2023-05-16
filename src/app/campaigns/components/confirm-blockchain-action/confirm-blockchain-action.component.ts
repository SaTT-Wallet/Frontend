import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GazConsumedByCampaign } from '@app/config/atn.config';
import { WalletFacadeService } from '@app/core/facades/wallet-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { BlockchainActionsService } from '@core/services/blockchain-actions.service';
import { Subject, forkJoin } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';



@Component({
  selector: 'app-confirm-blockchain-action',
  templateUrl: './confirm-blockchain-action.component.html',
  styleUrls: ['./confirm-blockchain-action.component.scss']
})
export class ConfirmBlockchainActionComponent implements OnInit {
  @Output() onSuccess = new EventEmitter();
  @Output() onFail = new EventEmitter();
  network: any;
  form = new UntypedFormGroup({
    password: new UntypedFormControl(null, Validators.required)
  });
  isLoading = false;
  cryptodata: any;
  bnb: any;
  eth: any;
  gazsend: any;
  erc20Gaz: any;
  bepGaz: any;
  bttGaz:any;
  btt:any;
  matic: any;
  polygonGaz: any;
  errorMessage: string = '';
  actionResults$ = this.service.performAction();
  isDestroyed = new Subject();

  constructor(
    private service: BlockchainActionsService, 
    private tokenStorageService: TokenStorageService,
    public router: Router,
    private route: ActivatedRoute,
    private walletFacade: WalletFacadeService) {
    this.route.queryParams
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((params: any) => {
        if(!!params['network']) {
          this.network = params['network']
        } else this.network = "";
        
      });
  }

  ngOnInit(): void {
   
    this.walletFacade
      .getCryptoPriceList()
      .pipe(
        map((response: any) => response.data),
        takeUntil(this.isDestroyed)
      )
      .subscribe((data: any) => {
        this.cryptodata = data;
      });
    this.actionResults$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response) => {
        this.isLoading = false;

        // in case of success
        if (response.data && response.data.transactionHash) {
          this.service.setTrnxStatus({
            status: 'succeeded',
            transactionHash: response.data.transactionHash,
            message: 'success',
            action: response.action
          });
          this.onSuccess.emit(response.data.transactionHash);
        }
        // if (!response.data){
        //   this.errorMessage = 'wrong_password';

        // }
        // in case of error
        if (response.error) {
          if (
            response.error ===
            'Harvest will be available only 24 hours after the link validation from the Ad Pool manager'
          ) {
            this.errorMessage =
              'Harvest will be available only 24 hours after the link validation from the Ad Pool manager';
          } else if (
            response.error ===
            'Harvest will be available only 24 hours after the last get gains'
          ) {
            this.errorMessage =
              'Harvest will be available only 24 hours after the last get gains';
          } else if (response.error === 'Wrong password') {
            this.errorMessage = 'Wrong password';
          } else if (
            response.error ===
            'Returned error: insufficient funds for gas * price + value'
          ) {
            this.errorMessage = 'out_of_gas_error';
          } else {
            this.service.setTrnxStatus({
              status: 'failed',
              message: response.error
            });
            this.onFail.emit(response.error);
          }

          setTimeout(() => {
            this.errorMessage = '';
          }, 6000);
        }
      });



      this.feesData().subscribe();
  }

  get password() {
    return this.form.get('password') as UntypedFormControl;
  }

  feesData() {
    return this.walletFacade.getCryptoPriceList().pipe(
      map((response: any) => response.data),
      take(1),
      map((data: any) => {
        this.bnb = data['BNB'].price;
        this.eth = data['ETH'].price;
        this.matic = data['MATIC'].price;
        this.btt = data['BTT'].price;
        return {
          bnb: this.bnb,
          Eth: this.eth,
          matic: this.matic,
          btt:this.btt
        };
      }),
      switchMap(({ bnb, Eth, matic }) => {
        return forkJoin([
          this.walletFacade.getEtherGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;
              this.gazsend = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                Eth
              ).toFixed(2);
              this.erc20Gaz = this.gazsend;
            })
          ),
          this.walletFacade.getBnbGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price = gaz.data.gasPrice;
              this.bepGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                bnb
              ).toFixed(2);

              if (this.gazsend === 'NaN') {
                this.gazsend = '';
                let price = gaz.data.gasPrice;
                this.bepGaz = (
                  ((price * GazConsumedByCampaign) / 1000000000) *
                  this.bnb
                ).toFixed(2);
              }
            })
          ),

          

          this.walletFacade.getPolygonGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.polygonGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                matic
              ).toFixed(8);
            })
          ),

          this.walletFacade.getBttGaz().pipe(
            take(1),
            tap((gaz: any) => {
              let price;
              price = gaz.data.gasPrice;

              this.bttGaz = (
                ((price * GazConsumedByCampaign) / 1000000000) *
                this.btt
              ).toFixed(8);
            })
          )
        ]);
      })
    );
  }

  expiredSession() {
    this.tokenStorageService.clear();
    window.open(environment.domainName + '/auth/login', '_self');
  }

  onFormSubmit() {
    
    this.isLoading = true;
    
    if (this.form.valid) {
      this.walletFacade.verifyUserToken().subscribe((res:any) => {
        if(res.message === "success") {
          this.service.onConfirmButtonClick(this.password.value);
          this.form.reset();
        } else this.expiredSession();
      })
      
    } else {
      this.form.markAllAsTouched();
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
