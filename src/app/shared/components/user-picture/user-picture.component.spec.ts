import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPictureComponent } from './user-picture.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('UserPictureComponent', () => {
  let component: UserPictureComponent;
  let fixture: ComponentFixture<UserPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPictureComponent ],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
