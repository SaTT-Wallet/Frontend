import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoiModalComponent } from './roi-modal.component';

describe('RoiModalComponent', () => {
  let component: RoiModalComponent;
  let fixture: ComponentFixture<RoiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
