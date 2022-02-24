import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPoolFilterComponent } from './ad-pool-filter.component';

describe('AdPoolFilterComponent', () => {
  let component: AdPoolFilterComponent;
  let fixture: ComponentFixture<AdPoolFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdPoolFilterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPoolFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
