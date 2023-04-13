import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';
import { environment as env } from '../../../../../../environments/environment';

@Component({
  selector: 'app-vote-list',
  templateUrl: './vote-list.component.html',
  styleUrls: ['./vote-list.component.scss']
})
export class VoteListComponent implements OnInit {
  @Input() proposalID!: string;
  votes: any[] = [];
  voteCounts: { [key: string]: { voteCount: number, percentage: string } } = {};

  async ngOnInit() {
    await this.loadVotes(this.proposalID);
  }

  async loadVotes(proposalID: string) {
    try {
      let result = await axios.post(env.url_subgraph_vote, {
        query: `
        query loadVotes{
          votes (
            first: 1000
            skip: 0
            where: {
              proposal: "${proposalID}"
            }
            orderBy: "created",
            orderDirection: desc
          ) {
            voter
            choice
          }
        }
        `,
        variables: {
          proposalID: this.proposalID
        }
      });
      this.votes = result.data.data.votes;

      for (let i = 0; i < this.votes.length; i++) {
        let vote = this.votes[i];
        let resultvp = await axios.post(env.url_subgraph_vote, {
          query: `
          query loadVotingPower {
            votes(
              where: {
                proposal: "${proposalID}"
                voter: "${vote.voter}"
              }
            ) {
              voter
              vp(
                space: $space
              )
            }
          }
          `,
        });
        vote.vp = resultvp.data.data.votes[0].vp;
      }

      const voteCounts: { [key: string]: { voteCount: number, percentage: string } } = {};
      for (let vote of this.votes) {
        if (!this.voteCounts[vote.choice]) {
          this.voteCounts[vote.choice] = {
            voteCount: 0,
            percentage: '0%'
          };
        }
        this.voteCounts[vote.choice].voteCount++;
      }
      const totalCount = this.votes.length;
      for (let choice in this.voteCounts) {
        this.voteCounts[choice].percentage = `${Math.round((this.voteCounts[choice].voteCount / totalCount) * 100)}%`;
      }
      this.voteCounts = voteCounts;

    } catch (error) {
      console.error(error);
    }
  }
}

// async loadVotes() {
//   try {
//     let result = await axios.post(env.url_subgraph_vote, {
//       query: `
//       query loadVotes {
//         votes (
//           first: 1000
//           skip: 0
//           where: {
//             proposal: "${this.proposalID}"
//           }
//           orderBy: "created",
//           orderDirection: desc
//         ) {
//           voter
//           choice
//         }
//       }
//       `,
//       variables: {
//         proposalID: this.proposalID
//       }
//     });
//     this.votes = result.data.data.votes;

//     for (let i = 0; i < this.votes.length; i++) {
//       let vote = this.votes[i];
//       let resultvp = await axios.post(env.url_subgraph_vote, {
//         query: `
//         query loadVotingPower($proposalID: String!, $space: String!) {
//           votes(
//             where: {
//               proposal: $proposalID
//               voter: "${vote.voter}"
//             }
//           ) {
//             voter
//             vp(
//               space: $space
//             )
//           }
//         }
//         `,
//         variables: {
//           voter: vote.voter,
//           space: env.space_name,
//           proposalID: this.proposalID
//         }
//       });
//       vote.vp = resultvp.data.data.vp;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

  // async loadVotes() {
  //   const result = await axios.post(env.url_subgraph_vote, {
  //     query: `
  //       query ($proposalID: String!) {
  //         votes (
  //           first: 1000
  //           skip: 0
  //           where: {
  //             proposal: $proposalID
  //           }
  //           orderBy: "created",
  //           orderDirection: desc
  //         ) {
  //           voter
  //           choice
  //         }
  //       }
  //     `,
  //     variables: {
  //       proposalID: this.proposalID
  //     }
  //   });

  //   const voters = result.data.data.votes.map((vote: any) => vote.voter);

  //   const resultvp = await axios.post(env.url_subgraph_vote, {
  //     query: `
  //       query ($voters: [String!]) {
  //         vp (
  //           voters: $voters
  //           space: "${env.space_name}"
  //           proposal: "${this.proposalID}"
  //         ) {
  //           voter
  //           vp
  //         }
  //       }
  //     `,
  //     variables: {
  //       voters
  //     }
  //   });

  //   const vpMap = new Map<string, number>();
  //   resultvp.data.data.vp.forEach((vp: any) => {
  //     vpMap.set(vp.voter, vp.vp);
  //   });

  //   this.votes = result.data.data.votes.map((vote: any) => {
  //     return {
  //       ...vote,
  //       vp: vpMap.get(vote.voter)
  //     };
  //   });
  // }

  // ngOnInit() {
  //   this.loadVotes();
  // }

// }


  //   votes: any[] = [];

//   async loadVotes(proposalID: string) {
//     let result = await axios.post(env.url_subgraph_bsc, {
//       query: `
//         query ($proposalID: String!) {
//           votes (
//             first: 1000
//             skip: 0
//             where: {
//               proposal: $proposalID
//             }
//             orderBy: "created",
//             orderDirection: desc
//           ) {
//             voter
//             choice
//             vp
//           }
//         }
//       `,
//       variables: {
//         proposalID: proposalID
//       }
//     });
//     this.votes = result.data;
//   }

//   ngOnInit() {
//     this.loadVotes("your-proposal-id");
//   }
// }

// export class VoteListComponent implements OnInit {
//   votes!: any[];

//   constructor() { }

//   async ngOnInit() {
//     const proposalID = '123'; // replace with your proposal ID
//     const votes = await this.loadVotes(proposalID);
//     this.votes = votes.data.data.votes;
//   }

//   async loadVotes(proposalID: string) {
//     const votes = await axios.post(env.url_subgraph_bsc, {
//       query: `
//         query ($proposalID: String!) {
//           votes (
//             first: 1000
//             skip: 0
//             where: {
//               proposal: $proposalID
//             }
//             orderBy: "created",
//             orderDirection: desc
//           ) {
//             voter
//             choice
//             vp
//           }
//         }
//       `,
//       variables: {
//         proposalID: proposalID
//       }
//     });
//     return votes;
//   }
// }

//   ngOnInit(): void {
//   }

//   // async loadVotes(proposalID: string) { 
//   //   let votes = axios.post(env.url_subgraph_vote, {
//   //     query: `
//   //     {
//   //       votes (
//   //         first: 1000
//   //         skip: 0
//   //         where: {
//   //           proposal: 
//   //         }
//   //         orderBy: "created",
//   //         orderDirection: desc
//   //       ) {
//   //         id
//   //         voter
//   //         vp
//   //         vp_by_strategy
//   //         vp_state
//   //         created
//   //         proposal {
//   //           id
//   //         }
//   //         choice
//   //         space {
//   //           id
//   //         }
//   //       }
//   //     }
//   //     `
//   //   })
//   // }
//   async loadVotes(proposalID: string) { 
//     let votes = await axios.post(env.url_subgraph_bsc, {
//       query: `
//       query ($proposalID: String!) {
//         votes (
//           first: 1000
//           skip: 0
//           where: {
//             proposal: $proposalID
//           }
//           orderBy: "created",
//           orderDirection: desc
//         ) {
//           voter
//           choice
//           vp
//         }
//       }
//       `,
//       variables: {
//         proposalID: proposalID
//       }
//     });
//     return votes;
//   }

//   // = await loadVotes(proposalID);

// }


// async loadVotes() {
  //   try {
  //     let result = await axios.post(env.url_subgraph_vote, {
  //       query: `
  //       query loadVotes {
  //         votes (
  //           first: 1000
  //           skip: 0
  //           where: {
  //             proposal: "${this.proposalID}"
  //           }
  //           orderBy: "created",
  //           orderDirection: desc
  //         ) {
  //           voter
  //           choice
  //         }
  //       }
  //       `,
  //       variables: {
  //         proposalID: this.proposalID
  //       }
  //     });
  //     this.votes = result.data.data.votes;

  //     const voteCounts: { [key: string]: number } = {};
  //     for (let i = 0; i < this.votes.length; i++) {
  //       let vote = this.votes[i];
  //       let resultvp = await axios.post(env.url_subgraph_vote, {
  //         query: `
  //         query loadVotingPower($proposalID: String!, $space: String!) {
  //           votes(
  //             where: {
  //               proposal: $proposalID
  //               voter: "${vote.voter}"
  //             }
  //           ) {
  //             voter
  //             vp(
  //               space: $space
  //             )
  //           }
  //         }
  //         `,
  //         variables: {
  //           voter: vote.voter,
  //           space: env.space_name,
  //           proposalID: this.proposalID
  //         }
  //       });
  //       vote.vp = resultvp.data.data.votes[0].vp;

  //       if (!voteCounts[vote.choice]) {
  //         voteCounts[vote.choice] = 0;
  //       }
  //       voteCounts[vote.choice] += Number(vote.vp);
  //     }

  //     const totalVotingPower = Object.values(voteCounts).reduce((acc, count) => acc + count, 0);
  //     for (const choice in voteCounts) {
  //       const voteCount = voteCounts[choice];
  //       const percentage = ((voteCount / totalVotingPower) * 100).toFixed(2);
  //       voteCounts[choice] = {
  //         voteCount,
  //         percentage
  //       };
  //     }
  //     this.voteCounts = voteCounts;

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }