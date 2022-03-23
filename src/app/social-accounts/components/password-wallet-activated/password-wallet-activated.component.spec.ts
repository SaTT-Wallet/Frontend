import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PasswordWalletActivatedComponent } from './password-wallet-activated.component';

describe('PasswordWalletActivatedComponent', () => {
  let component: PasswordWalletActivatedComponent;
  let fixture: ComponentFixture<PasswordWalletActivatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordWalletActivatedComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordWalletActivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
