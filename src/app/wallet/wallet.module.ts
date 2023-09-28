import { NgModule } from '@angular/core';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { CryptoListComponent } from './components/crypto-list/crypto-list.component';
import { SendReceiveBlockComponent } from './components/send-receive-block/send-receive-block.component';
import { SharedModule } from '@shared/shared.module';
import { AddTokenComponent } from './components/add-token/add-token.component';
import { BuyTokenComponent } from './components/buy-token/buy-token.component';
import { ConvertSummaryComponent } from './components/convert-summary/convert-summary.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SuccessTransferComponent } from './components/success-transfer/success-transfer.component';
import { FailTransferComponent } from './components/fail-transfer/fail-transfer.component';
import { SendComponent } from './components/send/send.component';
import { ReceiveComponent } from './components/receive/receive.component';
import { ConvertComponent } from './components/convert/convert.component';
import { HeaderSendReceiveBuyComponent } from './components/header-send-receive-buy/header-send-receive-buy.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ChartModule } from 'angular-highcharts';
import { CryptoInfoComponent } from './components/crypto-info/crypto-info.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FilterBynamePipe } from '@shared/pipes/filter-byname.pipe';
import { MigrationComponent } from './components/migration/migration.component';
import { CryptoMarketCapComponent } from './components/crypto-market-cap/crypto-market-cap.component';
import { cryptoReducer } from './store/reducers/crypto.reducer'; 
import { CryptoEffects } from './store/effects/crypto.effects'; 
import { StoreModule } from '@ngrx/store'; 
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common'; 
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { cryptoInfoReducer } from './store/reducers/crypto-info.reducer';
import { CryptoInfoEffects } from './store/effects/crypto-info.effects';


@NgModule({
  declarations: [
    WalletComponent,
    CryptoListComponent,
    SendReceiveBlockComponent,
    AddTokenComponent,
    BuyTokenComponent,
    ConvertSummaryComponent,
    SuccessTransferComponent,
    FailTransferComponent,
    SendComponent,
    ReceiveComponent,
    ConvertComponent,
    HeaderSendReceiveBuyComponent,
    CryptoInfoComponent,
    MigrationComponent,
    CryptoMarketCapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ScrollingModule,
    ChartsModule,
    WalletRoutingModule,
    NgxIntlTelInputModule,
    ChartModule,
    TranslateModule.forChild(),
    ZXingScannerModule,
    StoreModule.forFeature('crypto', cryptoReducer), 
    EffectsModule.forFeature([CryptoEffects]),
    StoreModule.forFeature('cryptoInfo', cryptoInfoReducer),
    EffectsModule.forFeature([CryptoInfoEffects]),

  ],
  providers: [DecimalPipe, DatePipe, FilterBynamePipe]
})
export class WalletModule {}
