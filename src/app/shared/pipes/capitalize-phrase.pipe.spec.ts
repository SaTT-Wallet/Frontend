import { CapitalizePhrasePipe } from './capitalize-phrase.pipe';

describe('CapitalizePhrasePipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizePhrasePipe();
    expect(pipe).toBeTruthy();
  });
});
