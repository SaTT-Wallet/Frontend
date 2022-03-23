import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatSelectComponent } from './filter-campaign.component';

describe('FlatSelectComponent', () => {
  let component: FlatSelectComponent;
  let fixture: ComponentFixture<FlatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
