import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoMarketCapComponent } from './crypto-market-cap.component';

describe('CryptoMarketCapComponent', () => {
  let component: CryptoMarketCapComponent;
  let fixture: ComponentFixture<CryptoMarketCapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoMarketCapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoMarketCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
