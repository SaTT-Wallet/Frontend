// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { switchMap, map } from 'rxjs/operators';
// import axios from 'axios';
// import { environment as env } from '../../../../environments/environment.prod';
// import { loadProposals, loadProposalsSuccess } from '../actions/proposals.actions';


// @Injectable()
// export class ProposalsEffects {
//   loadProposals$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(loadProposals),
//       switchMap(() =>
//         axios.post(env.url_subgraph_vote, {
//           query: `
//             query  {
//               proposals (
//                 first: 20,
//                 skip: 0,
//                 where: {
//                   space_in: "${env.space_name}",
//                 },
//                 orderBy: "created",
//                 orderDirection: desc
//               ) {
//                 id
//                 title
//                 body
//                 choices
//                 start
//                 end
//                 snapshot
//                 state
//                 scores
//                 scores_by_strategy
//                 scores_total
//                 scores_updated
//                 author
//                 space {
//                   id
//                   name
//                 }
//               }
//             }
//           `
//         })
//           .then(response => loadProposalsSuccess({ proposals: response.data.data.proposals }))
//           .catch(error => console.error(error))
//       )
//     )
//   );

//   constructor(private actions$: Actions) {}
// }
