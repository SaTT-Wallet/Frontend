import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePerformanceComponent } from './toggle-performance.component';

describe('TogglePerformanceComponent', () => {
  let component: TogglePerformanceComponent;
  let fixture: ComponentFixture<TogglePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TogglePerformanceComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TogglePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
