import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyGasComponent } from './buy-gas.component';

describe('BuyGasComponent', () => {
  let component: BuyGasComponent;
  let fixture: ComponentFixture<BuyGasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyGasComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyGasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
