import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProposalComponent } from './create-proposal.component';

describe('CreateProposalComponent', () => {
  let component: CreateProposalComponent;
  let fixture: ComponentFixture<CreateProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
