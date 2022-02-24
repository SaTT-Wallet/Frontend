import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoInfoComponent } from './crypto-info.component';

describe('CryptoInfoComponent', () => {
  let component: CryptoInfoComponent;
  let fixture: ComponentFixture<CryptoInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CryptoInfoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
