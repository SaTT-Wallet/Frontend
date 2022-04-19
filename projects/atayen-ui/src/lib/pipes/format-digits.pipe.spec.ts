import { FormatDigitsPipe } from './format-digits.pipe';
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';

describe('FormatDigitsPipe', () => {

  let pipe: FormatDigitsPipe;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });
  it('create an instance', inject([LOCALE_ID], (locale: string) => {
    pipe = new FormatDigitsPipe(locale);
    expect(pipe).toBeTruthy();
  }));

  it('should return 8 digits after the point when given a number between 0 and 0.1', inject([LOCALE_ID], (locale: string) => {
    let value = '0.0024562136455878'
    let result = pipe.transform(value);
    expect(result).toEqual('0.00245621')
  }));

  it('should return 6 digits after the point when given a number between 0.1 and 1.9', inject([LOCALE_ID], (locale: string) => {
    let value = '1.0024562136455878'
    let result = pipe.transform(value);
    expect(result).toEqual('1.002456')
  }));

  it('should return 4 digits after the point when given a number between 2 and 9.999', inject([LOCALE_ID], (locale: string) => {
    let value = '3.0024562136455878'
    let result = pipe.transform(value);
    expect(result).toEqual('3.0025')
  }));

  it('should return 2 digits after the point when given a number between 10 and 9,999.99', inject([LOCALE_ID], (locale: string) => {
    let value = '10.5024562136455878'
    let result = pipe.transform(value);
    expect(result).toEqual('10.5')
    value = '10.0524562136455878'
    result = pipe.transform(value);
    expect(result).toEqual('10.05')
  }));

  it('should return no digits after the point when given a number is more than 10000', inject([LOCALE_ID], (locale: string) => {
    
    let value = '10000'
    let result = pipe.transform(value);
    expect(result).toEqual('10000')
    value = '90126585'
    result = pipe.transform(value);
    expect(result).toEqual('90126585')
  }));

 
});
