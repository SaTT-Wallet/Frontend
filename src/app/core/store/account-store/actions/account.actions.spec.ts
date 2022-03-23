import * as fromAccount from './account.actions';

describe('loadAcccounts', () => {
  it('should return an action', () => {
    expect(fromAccount.loadAccount().type).toBe('[Account] Load Account');
  });
});
