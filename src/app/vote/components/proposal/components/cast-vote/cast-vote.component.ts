import { Component, Input, OnInit } from '@angular/core';
import { SnapshotService } from '@app/core/services/vote/snapshot.service';
import axios from 'axios';
import { Console } from 'console';
import { environment as env } from '../../../../../../environments/environment';

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.scss']
})
export class CastVoteComponent implements OnInit {

  @Input() proposalID!: string;
  choices: string[] = [];
  voteButtonDisabled = true;
  selectedChoice: number | undefined;

  constructor(private snapshotService: SnapshotService) { }

  async ngOnInit(): Promise<void> {
    await this.loadChoices(this.proposalID);
    this.voteButtonDisabled = true;
  }
  

  async loadChoices(proposalID: string) {
    const response = await axios.post(env.url_subgraph_vote, {
      query: `
      query loadChoices {
        proposal(id:"${proposalID}") {
          id
          choices
        }
      }
    `,
    });
    this.choices = response.data.data.proposal.choices;
  }

  async submitVote() {
    if (this.selectedChoice !== undefined && this.selectedChoice !== null) {
      const proposalData = {
        id: this.proposalID,
        choiceNumber: (this.selectedChoice - 1)
      };
      // console.log("choice",this.selectedChoice)
      // console.log(proposalData)
      const receipt = await this.snapshotService.castVote(proposalData);
      console.log(receipt);
    }
  }
}




// import { Component, Input, OnInit } from '@angular/core';
// import { SnapshotService } from '@app/core/services/vote/snapshot.service';
// import axios from 'axios';
// import { environment as env } from '../../../../../../environments/environment.prod';

// @Component({
//   selector: 'app-cast-vote',
//   templateUrl: './cast-vote.component.html',
//   styleUrls: ['./cast-vote.component.scss']
// })
// export class CastVoteComponent implements OnInit {

//   @Input() proposalID!: string;
//   choices!: any[];
//   voteButtonDisabled = true;
//   selectedChoice!: number;

//   constructor(private snapshotService: SnapshotService) { }

//   async ngOnInit(): Promise<void> {
//     await this.loadChoices(this.proposalID);
//   }

//   async loadChoices(proposalID: string) {
//     const response = await axios.post(env.url_subgraph_vote, {
//       query: `
//       query loadChoices {
//         proposal(id:"${proposalID}") {
//           id
//           choices
//         }
//       }
//     `,
//     });
//     this.choices = response.data.data.proposal.choices;
//   }

//   async submitVote() {
    
//     const proposalData = {
//       id: this.proposalID,
//       choiceNumber: this.selectedChoice
//     };
//     const receipt = await this.snapshotService.castVote(proposalData);
//     console.log(receipt);
//   }
// }
