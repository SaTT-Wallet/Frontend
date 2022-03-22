import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonetizeFacebookAccountComponent } from './monetize-facebook-account.component';

describe('MonetizeFacebookAccountComponent', () => {
  let component: MonetizeFacebookAccountComponent;
  let fixture: ComponentFixture<MonetizeFacebookAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonetizeFacebookAccountComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonetizeFacebookAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
