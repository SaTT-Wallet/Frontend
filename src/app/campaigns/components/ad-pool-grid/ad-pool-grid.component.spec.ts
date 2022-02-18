import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPoolGridComponent } from './ad-pool-grid.component';

describe('AdPoolGridComponent', () => {
  let component: AdPoolGridComponent;
  let fixture: ComponentFixture<AdPoolGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdPoolGridComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPoolGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
