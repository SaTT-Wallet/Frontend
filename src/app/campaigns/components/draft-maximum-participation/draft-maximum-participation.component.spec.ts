import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftMaximumParticipationComponent } from './draft-maximum-participation.component';

describe('DraftMaximumParticipationComponent', () => {
  let component: DraftMaximumParticipationComponent;
  let fixture: ComponentFixture<DraftMaximumParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftMaximumParticipationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftMaximumParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
