import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyTransactionHashComponent } from './copy-transaction-hash.component';

describe('CopyTransactionHashComponent', () => {
  let component: CopyTransactionHashComponent;
  let fixture: ComponentFixture<CopyTransactionHashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyTransactionHashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyTransactionHashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
