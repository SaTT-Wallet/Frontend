import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRoiModalComponent } from './input-roi-modal.component';

describe('InputRoiModalComponent', () => {
  let component: InputRoiModalComponent;
  let fixture: ComponentFixture<InputRoiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputRoiModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputRoiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
