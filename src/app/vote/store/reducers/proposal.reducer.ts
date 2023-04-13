import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Proposal } from '../../../../app/models/proposal.model';
import { loadProposalsSuccess, setProposalFilter } from '../actions/proposals.actions';


export interface ProposalState extends EntityState<Proposal> {
    core: any;
    filter: { type: 'ALL' | 'CORE' | 'COMMUNITY', status: 'SOON' | 'ACTIVE' | 'CLOSED' };
}

export const proposalAdapter = createEntityAdapter<Proposal>();

export const initialProposalState = proposalAdapter.getInitialState({
    filter: { type: 'ALL', status: 'ACTIVE' }
});
export const proposalReducer = createReducer(
    initialProposalState,
    on(loadProposalsSuccess, (state, { proposals }) => proposalAdapter.setAll(proposals, state)),
    on(setProposalFilter, (state, { filter }) => ({ ...state, filter })),
);

export function reducer(state: ProposalState | undefined, action: any) {
    return proposalReducer(state, action);
}
