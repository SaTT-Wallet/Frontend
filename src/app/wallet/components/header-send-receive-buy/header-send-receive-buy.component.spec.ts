import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSendReceiveBuyComponent } from './header-send-receive-buy.component';

describe('HeaderSendReceiveBuyComponent', () => {
  let component: HeaderSendReceiveBuyComponent;
  let fixture: ComponentFixture<HeaderSendReceiveBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderSendReceiveBuyComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSendReceiveBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
