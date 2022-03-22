import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCoverBtnComponent } from './edit-cover-btn.component';

describe('EditCoverBtnComponent', () => {
  let component: EditCoverBtnComponent;
  let fixture: ComponentFixture<EditCoverBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCoverBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCoverBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
