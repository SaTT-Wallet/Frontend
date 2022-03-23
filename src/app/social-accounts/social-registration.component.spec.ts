import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialRegistrationComponent } from './social-registration.component';
import {RouterTestingModule} from "@angular/router/testing";

describe('SocialRegistrationComponent', () => {
  let component: SocialRegistrationComponent;
  let fixture: ComponentFixture<SocialRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialRegistrationComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
