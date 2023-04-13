import { createAction, props } from '@ngrx/store';
import { Proposal } from '../../../../app/models/proposal.model';

export const loadProposals = createAction('[Proposals] Load Proposals');

export const loadProposalsSuccess = createAction(
    '[Proposals] Load Proposals Success',
    props<{ proposals: Proposal[] }>()
);

export const setProposalFilter = createAction(
    '[Proposals] Set Proposal Filter',
    props<{ filter: { type: 'ALL' | 'CORE' | 'COMMUNITY', status: 'SOON' | 'ACTIVE' | 'CLOSED' } }>()
);
