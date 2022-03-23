import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownaldJSONFileComponent } from './downald-jsonfile.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DownaldJSONFileComponent', () => {
  let component: DownaldJSONFileComponent;
  let fixture: ComponentFixture<DownaldJSONFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownaldJSONFileComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
        HttpClientTestingModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownaldJSONFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
