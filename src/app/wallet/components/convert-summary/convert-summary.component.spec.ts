import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertSummaryComponent } from './convert-summary.component';

describe('ConvertSummaryComponent', () => {
  let component: ConvertSummaryComponent;
  let fixture: ComponentFixture<ConvertSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
