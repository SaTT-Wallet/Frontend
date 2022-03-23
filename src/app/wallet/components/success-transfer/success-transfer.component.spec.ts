import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessTransferComponent } from './success-transfer.component';

describe('SuccessTransferComponent', () => {
  let component: SuccessTransferComponent;
  let fixture: ComponentFixture<SuccessTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessTransferComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
