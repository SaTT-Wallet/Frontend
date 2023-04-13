import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastVoteComponent } from './cast-vote.component';

describe('CastVoteComponent', () => {
  let component: CastVoteComponent;
  let fixture: ComponentFixture<CastVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CastVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CastVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
