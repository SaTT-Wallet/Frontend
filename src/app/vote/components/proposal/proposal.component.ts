import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
import { VoteListComponent } from './components/vote-list/vote-list.component';
import { CastVoteComponent } from './components/cast-vote/cast-vote.component';
import { ProposalDetailsComponent } from './components/proposal-details/proposal-details.component';
import { VoteResultsComponent } from './components/vote-results/vote-results.component';



@Component({
  selector: 'app-proposal',
  templateUrl: `./proposal.component.html`,
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {
  @Input() proposalID!: string;
  @Input() voteCounts: any;
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.proposalID = id;
    });
  }

  constructor(private route: ActivatedRoute) {}
}
