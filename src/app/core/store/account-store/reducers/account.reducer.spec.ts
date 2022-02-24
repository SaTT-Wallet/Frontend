import { reducer, initialAccountState } from './account.reducer';

describe('Account Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialAccountState, action);

      expect(result).toBe(initialAccountState);
    });
  });
});
