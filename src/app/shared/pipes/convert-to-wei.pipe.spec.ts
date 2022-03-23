import { ConvertToWeiPipe } from './convert-to-wei.pipe';

describe('ConvertToWeiPipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertToWeiPipe();
    expect(pipe).toBeTruthy();
  });
  it('should return the right converted value', () => {
    let rawValueInSaTT = '2550';
    const pipe = new ConvertToWeiPipe();
    let valueInWei = pipe.transform(rawValueInSaTT,"SATT")
   // console.log(valueInWei,"value")
    expect(valueInWei).toEqual('2550000000000000000000');
  })
});
