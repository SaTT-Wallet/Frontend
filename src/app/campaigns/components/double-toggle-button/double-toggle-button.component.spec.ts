import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleToggleButtonComponent } from './double-toggle-button.component';

describe('DoubleToggleButtonComponent', () => {
  let component: DoubleToggleButtonComponent;
  let fixture: ComponentFixture<DoubleToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoubleToggleButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
