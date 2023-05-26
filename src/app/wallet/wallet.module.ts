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
    SharedModule,
    WalletRoutingModule,
    NgxIntlTelInputModule,
    ChartModule,
    ZXingScannerModule
  ],
  providers: [DecimalPipe, DatePipe, FilterBynamePipe]
})
export class WalletModule {}
