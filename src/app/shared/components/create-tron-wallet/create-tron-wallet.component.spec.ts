import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTronWalletComponent } from './create-tron-wallet.component';

describe('CreateTronWalletComponent', () => {
  let component: CreateTronWalletComponent;
  let fixture: ComponentFixture<CreateTronWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTronWalletComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTronWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
