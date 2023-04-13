import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss']
})
export class VoteResultsComponent implements OnInit {
  @Input() voteCounts: { [key: string]: { voteCount: number, percentage: string } } = {};
  constructor() { }

  getObjectKeys(): string[] {
    this.voteCounts = {};
    return Object.keys(this.voteCounts);
  }

  ngOnInit(): void {
  }
}









//   import axios from 'axios';
// import { environment as env } from '../../../../../../environments/environment.prod';
// @Input() proposalID!: string;
//   votes: any[] = [];
//   voteCounts: { [key: string]: { voteCount: number, percentage: string } } = {};

//   async ngOnInit() {
//     await this.loadVotes(this.proposalID);
//   }

//   async loadVotes(proposalID: string) {
//     try {
//       let result = await axios.post(env.url_subgraph_vote, {
//         query: `
//         query loadVotes{
//           votes (
//             first: 1000
//             skip: 0
//             where: {
//               proposal: "${proposalID}"
//             }
//             orderBy: "created",
//             orderDirection: desc
//           ) {
//             voter
//             choice
//           }
//         }
//         `,
//         variables: {
//           proposalID: this.proposalID
//         }
//       });
//       this.votes = result.data.data.votes;

//       for (let i = 0; i < this.votes.length; i++) {
//         let vote = this.votes[i];
//         let resultvp = await axios.post(env.url_subgraph_vote, {
//           query: `
//           query loadVotingPower {
//             votes(
//               where: {
//                 proposal: "${proposalID}"
//                 voter: "${vote.voter}"
//               }
//             ) {
//               voter
//               vp(
//                 space: $space
//               )
//             }
//           }
//           `,
//         });
//         vote.vp = resultvp.data.data.votes[0].vp;
//       }

//       const voteCounts: { [key: string]: { voteCount: number, percentage: string } } = {};
//       for (let vote of this.votes) {
//         if (!this.voteCounts[vote.choice]) {
//           this.voteCounts[vote.choice] = {
//             voteCount: 0,
//             percentage: '0%'
//           };
//         }
//         this.voteCounts[vote.choice].voteCount++;
//       }
//       const totalCount = this.votes.length;
//       for (let choice in this.voteCounts) {
//         this.voteCounts[choice].percentage = `${Math.round((this.voteCounts[choice].voteCount / totalCount) * 100)}%`;
//       }
//       this.voteCounts = voteCounts;

//     } catch (error) {
//       console.error(error);
//     }
//   }