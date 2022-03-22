import { ConvertFromWei } from './wei-to-sa-tt.pipe';

describe('ConvertFromWei', () => {
  it('create an instance', () => {
    const pipe = new ConvertFromWei();
    expect(pipe).toBeTruthy();
  });
});
