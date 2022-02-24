import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideControlComponent } from './slide-control.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('SlideControlComponent', () => {
  let component: SlideControlComponent;
  let fixture: ComponentFixture<SlideControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideControlComponent ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
