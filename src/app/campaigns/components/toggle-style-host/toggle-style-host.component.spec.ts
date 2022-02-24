import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleStyleHostComponent } from './toggle-style-host.component';

describe('ToggleStyleHostComponent', () => {
  let component: ToggleStyleHostComponent;
  let fixture: ComponentFixture<ToggleStyleHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleStyleHostComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleStyleHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
