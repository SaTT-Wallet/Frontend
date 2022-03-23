import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailTransferComponent } from './fail-transfer.component';

describe('FailTransferComponent', () => {
  let component: FailTransferComponent;
  let fixture: ComponentFixture<FailTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FailTransferComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
