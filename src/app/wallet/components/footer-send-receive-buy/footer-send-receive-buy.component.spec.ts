import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSendReceiveBuyComponent } from './footer-send-receive-buy.component';

describe('FooterSendReceiveBuyComponent', () => {
  let component: FooterSendReceiveBuyComponent;
  let fixture: ComponentFixture<FooterSendReceiveBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterSendReceiveBuyComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterSendReceiveBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
