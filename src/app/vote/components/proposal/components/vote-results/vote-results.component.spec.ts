import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteResultsComponent } from './vote-results.component';

describe('VoteResultsComponent', () => {
  let component: VoteResultsComponent;
  let fixture: ComponentFixture<VoteResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
