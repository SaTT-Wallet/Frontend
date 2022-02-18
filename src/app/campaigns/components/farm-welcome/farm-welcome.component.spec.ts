import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmWelcomeComponent } from './farm-welcome.component';
import {RouterTestingModule} from "@angular/router/testing";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('FarmWelcomeComponent', () => {
  let component: FarmWelcomeComponent;
  let fixture: ComponentFixture<FarmWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmWelcomeComponent ],
      imports: [RouterTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
