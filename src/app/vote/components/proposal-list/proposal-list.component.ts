import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment as env } from '../../../../environments/environment';
import { Proposal } from '@app/models/proposal.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProposalState, proposalAdapter } from '../../store/reducers/proposal.reducer'

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss']
})
export class ProposalListComponent implements OnInit {
  proposals: any[] = [];
  core = ['0x942051828f586303e1FB143B6B4723d46b06fb98', '0x942051324f586505e1CD143B6B4723d46b06fb98'];
  proposals$: Observable<Proposal[]> | undefined;
  core$: Observable<string[]> | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<{ proposals: ProposalState }>) { }

  async ngOnInit(): Promise<void> {
    await this.loadProposals();

    this.proposals$ = this.store.select((state) => {
      const filter = state.proposals.filter;
      const proposals = proposalAdapter.getSelectors().selectAll(state.proposals);

      if (filter.type === 'CORE') {
        return proposals.filter((proposal) => state.proposals.core.includes(proposal.from));
      } else if (filter.type === 'COMMUNITY') {
        return proposals.filter((proposal) => !state.proposals.core.includes(proposal.from));
      } else {
        return proposals;
      }
    });

  }

  activeButton = 'CORE';

  onButtonClick(button: string) {
    this.activeButton = button;
  }
  goToProposal(id: string) {
    this.router.navigate(['/vote/proposal', id]);
  }

  proposal(id: string): any {
    // this.router.navigateByUrl(`/proposal/${id}`), { relativeTo: this.route };

    // this.router.navigate(
    //   ['/proposal'],
    //   { queryParams: { id: id } }
    // );
  }


  async loadProposals() {
    try {
      const response = await axios.post(env.url_subgraph_vote, {
        query: `
        query  {
          proposals (
            first: 20,
            skip: 0,
            where: {
              space_in: "${env.space_name}",
            },
            orderBy: "created",
            orderDirection: desc
          ) {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            scores
            scores_by_strategy
            scores_total
            scores_updated
            author
            space {
              id
              name
            }
          }
        }
        `

      });
      this.proposals = response.data.data.proposals;
    } catch (error) {
      console.error(error);
    }
  }
}
