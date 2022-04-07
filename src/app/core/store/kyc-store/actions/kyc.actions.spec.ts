import * as fromKyc from './kyc.actions';

describe('yKycs', () => {
  it('should return an action', () => {
    expect(fromKyc.yKycs().type).toBe('[Kyc] Y Kycs');
  });
});
