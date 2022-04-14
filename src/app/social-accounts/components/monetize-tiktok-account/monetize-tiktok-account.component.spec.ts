import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizeTiktokAccountComponent } from './monetize-tiktok-account.component';

describe('MonetizeTiktokAccountComponent', () => {
  let component: MonetizeTiktokAccountComponent;
  let fixture: ComponentFixture<MonetizeTiktokAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonetizeTiktokAccountComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonetizeTiktokAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
