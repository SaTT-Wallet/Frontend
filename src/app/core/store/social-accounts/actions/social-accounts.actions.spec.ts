import * as fromSocialAccounts from './social-accounts.actions';

describe('loadSocialAccountss', () => {
  it('should return an action', () => {
    expect(fromSocialAccounts.loadSocialAccountss().type).toBe(
      '[SocialAccounts] Load SocialAccountss'
    );
  });
});
