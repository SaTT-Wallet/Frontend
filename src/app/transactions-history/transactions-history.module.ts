import { NgModule } from '@angular/core';
import { TransactionsHistoryComponent } from './transactions-history.component';
import { SharedModule } from '@shared/shared.module';
import { TransactionHistoryRoutingModule } from './transaction-history-routing.module';

@NgModule({
  declarations: [TransactionsHistoryComponent],
  imports: [SharedModule, TransactionHistoryRoutingModule]
})
export class TransactionsHistoryModule {}
