import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteComponent } from './vote.component';
import { CreateProposalComponent } from './components/create-proposal/create-proposal.component';
import { ProposalComponent } from './components/proposal/proposal.component';
import { SharedModule } from '@app/shared/shared.module';
import { VoteRoutingModule } from './vote-routing.module';
import { ProposalListComponent } from './components/proposal-list/proposal-list.component';
import { CastVoteComponent } from './components/proposal/components/cast-vote/cast-vote.component';
import { ProposalDetailsComponent } from './components/proposal/components/proposal-details/proposal-details.component';
import { VoteListComponent } from './components/proposal/components/vote-list/vote-list.component';
import { VoteResultsComponent } from './components/proposal/components/vote-results/vote-results.component';



@NgModule({
  declarations: [
    VoteComponent,
    CreateProposalComponent,
    ProposalComponent,
    ProposalListComponent,
    CastVoteComponent,
    ProposalDetailsComponent,
    VoteListComponent,
    VoteResultsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VoteRoutingModule
  ],
  exports: [
    VoteComponent,
    CreateProposalComponent,
    ProposalComponent,
    ProposalListComponent,
    CastVoteComponent,
    ProposalDetailsComponent,
    VoteListComponent,
    VoteResultsComponent
  ]
})
export class VoteModule { }
