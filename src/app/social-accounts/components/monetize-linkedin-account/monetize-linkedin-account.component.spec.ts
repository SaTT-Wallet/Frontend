import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizeLinkedinAccountComponent } from './monetize-linkedin-account.component';

describe('MonetizeLinkedinAccountComponent', () => {
  let component: MonetizeLinkedinAccountComponent;
  let fixture: ComponentFixture<MonetizeLinkedinAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonetizeLinkedinAccountComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonetizeLinkedinAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
