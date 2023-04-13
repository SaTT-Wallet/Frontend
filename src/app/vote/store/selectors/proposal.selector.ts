import { createSelector } from '@ngrx/store';
import { ProposalState, proposalAdapter } from '../reducers/proposal.reducer'
export const selectProposalState = (state: any) => state.proposal;

export const selectProposalFilter = createSelector(
    selectProposalState,
    (state: ProposalState) => state.filter
);

export const selectFilteredProposals = createSelector(
    selectProposalState,
    selectProposalFilter,
    (state: ProposalState, filter) => {
        const proposals = proposalAdapter.getSelectors().selectAll(state);

        const core = ['0x942051828f586303e1FB143B6B4723d46b06fb98', '0x942051324f586505e1CD143B6B4723d46b06fb98'];

        return proposals.filter(proposal => {
            const { type, status } = filter;
            const isTypeMatch = type === 'ALL' || (type === 'CORE' && proposal.author in core);
            const isStatusMatch = status === 'ACTIVE' || (status === 'SOON' && proposal.start > Date.now()) || (status === 'CLOSED' && proposal.end < Date.now());

            return isTypeMatch && isStatusMatch;
        });
    }
);
