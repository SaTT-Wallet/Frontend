import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalComponent } from './components/proposal/proposal.component';
import { CreateProposalComponent } from './components/create-proposal/create-proposal.component';
import { VoteComponent } from './vote.component';

const routes: Routes = [
  { path: '', component: VoteComponent },
  { path: 'proposal/create', component: CreateProposalComponent },
  { path: 'proposal/:id', component: ProposalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoteRoutingModule {}
