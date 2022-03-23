import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSocialMediaComponent } from './select-social-media.component';

describe('SelectSocialMediaComponent', () => {
  let component: SelectSocialMediaComponent;
  let fixture: ComponentFixture<SelectSocialMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectSocialMediaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSocialMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
