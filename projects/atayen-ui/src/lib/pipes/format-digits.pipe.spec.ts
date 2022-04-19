import { FormatDigitsPipe } from './format-digits.pipe';
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';

describe('FormatDigitsPipe', () => {

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });
  it('create an instance', inject([LOCALE_ID], (locale: string) => {
    const pipe = new FormatDigitsPipe(locale);
    expect(pipe).toBeTruthy();
  }));
 
});
