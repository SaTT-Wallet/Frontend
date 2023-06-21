import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassphraseCheckedGuard } from '@app/core/services/passphrase-checked.guard';
import { AuthGuardService } from '@core/services/auth-guard.service';
import { AddTokenComponent } from './components/add-token/add-token.component';
import { BuyTokenComponent } from './components/buy-token/buy-token.component';
import { ConvertSummaryComponent } from './components/convert-summary/convert-summary.component';
import { ConvertComponent } from './components/convert/convert.component';
import { FailTransferComponent } from './components/fail-transfer/fail-transfer.component';
import { ReceiveComponent } from './components/receive/receive.component';
import { SendComponent } from './components/send/send.component';
import { SuccessTransferComponent } from './components/success-transfer/success-transfer.component';
import { WalletComponent } from './wallet.component';
import { CryptoInfoComponent } from '@wallet/components/crypto-info/crypto-info.component';
import{ CryptoMarketCapComponent} from '@wallet/components/crypto-market-cap/crypto-market-cap.component';
const routes: Routes = [
  {
    path: '',
    component: WalletComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-token',
    component: AddTokenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'buy-token',
    component: BuyTokenComponent
    //canActivate: [AuthGuardService]
  },
  {
    path: 'token-info',
    component:  CryptoMarketCapComponent,
    
  },
   {
        path: 'coin-detail',
        component:  CryptoInfoComponent
       
      },

  {
    path: 'summary',
    component: ConvertSummaryComponent
    // canActivate: [AuthGuardService]
  },
  {
    path: 'success',
    component: SuccessTransferComponent
  },
  {
    path: 'fail',
    component: FailTransferComponent
  },
  {
    path: 'send',
    component: SendComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'receive',
    component: ReceiveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'convert',
    component: ConvertComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule {}
