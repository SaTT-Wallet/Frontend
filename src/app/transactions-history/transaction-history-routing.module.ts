import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@app/core/services/auth-guard.service';
import { TransactionsHistoryComponent } from './transactions-history.component';

const routes: Routes = [
  {
    path: '',
    //dashboard
    component: TransactionsHistoryComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionHistoryRoutingModule {}
