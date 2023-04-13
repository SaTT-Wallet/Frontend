import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';
import { environment as env } from '../../../../../../environments/environment';
// import { environment as env } from '../../../../../../environments/environment';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.scss']
})
export class ProposalDetailsComponent implements OnInit {
  @Input() proposalID!: string;
  proposal: any = {};
  start: any;
  end: any;
  ipfsHash!: any;

  constructor() {}

  async ngOnInit() {
    await this.loadProposal(this.proposalID);
    await this.getIpfsHash(this.proposalID);
  }

  async getIpfsHash(proposalID: string) {
    const response = await axios.post(env.url_subgraph_vote, {
      query: `
      query getIpfs {
        messages (
          where: { space: "${env.space_name}" ,id:"${proposalID}" }
        ) {
          ipfs
        }
      }
  `
    });
    this.ipfsHash = response.data.data.messages[0].ipfs;
  }

  async loadProposal(proposalID: string) {
    try {
      const response = await axios.post(env.url_subgraph_vote, {
        query: `
          query loadProposal {
            proposal(id:"${proposalID}") {
              id
              start
              end
              snapshot
              author
              state
            }
          }
        `
      });

      this.proposal = response.data.data.proposal;
      const startDate = new Date(this.proposal.start * 1000);
      const endDate = new Date(this.proposal.end * 1000);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      this.start = formatter.format(startDate);
      this.end = formatter.format(endDate);
    } catch (error) {
      console.error(error);
    }
  }
}

// import { Component, Input, OnInit } from '@angular/core';
// import axios from 'axios';
// import { environment as env } from '../../../../../../environments/environment.prod';

// @Component({
//   selector: 'app-proposal-details',
//   templateUrl: './proposal-details.component.html',
//   styleUrls: ['./proposal-details.component.scss']
// })
// export class ProposalDetailsComponent implements OnInit {
//   @Input() proposalID!: string;
//   proposal!: any;

//   async loadProposals() {
//     let result = await axios.post(env.url_subgraph_vote, {
//       query: `
//         query {
//           proposal(id:$proposalID) {
//             id
//             start
//             end
//             snapshot
//             author
//           }
//         }
//       `,
//       variables: {
//         proposalID: this.proposalID
//       }
//     });
//     this.proposal = result.data;
//   }

//   ngOnInit() {
//     this.loadProposals();
//   }
// }

// query ($proposalID: String!) {
//   votes (
//     first: 1000
//     skip: 0
//     where: {
//       proposal: $proposalID
//     }
//     orderBy: "created",
//     orderDirection: desc
//   ) {
//     voter
//     choice
//     vp
//   }
// }
