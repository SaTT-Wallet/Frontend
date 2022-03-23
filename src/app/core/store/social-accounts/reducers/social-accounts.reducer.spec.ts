import { reducer, socialAccountinitialState } from './social-accounts.reducer';

describe('SocialAccounts Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(socialAccountinitialState, action);

      expect(result).toBe(socialAccountinitialState);
    });
  });
});
