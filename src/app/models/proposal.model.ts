type ProposalType = 'single-choice' | 'approval' | 'quadratic' | 'ranked-choice' | 'weighted' | 'basic';

export interface Proposal {
    from?: string;
    space?: string;
    timestamp?: number;
    type?: ProposalType;
    title?: string;
    body?: string;
    discussion?: string;
    choices?: string[];
    start?: number;
    end?: number;
    snapshot?: number;
    plugins?: string;
    app?: string;
}
