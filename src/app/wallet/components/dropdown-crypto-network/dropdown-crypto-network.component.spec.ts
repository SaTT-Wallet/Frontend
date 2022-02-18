import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCryptoNetworkComponent } from './dropdown-crypto-network.component';

describe('DropdownCryptoNetworkComponent', () => {
  let component: DropdownCryptoNetworkComponent;
  let fixture: ComponentFixture<DropdownCryptoNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownCryptoNetworkComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownCryptoNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
