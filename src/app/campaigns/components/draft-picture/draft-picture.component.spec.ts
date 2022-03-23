import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftPictureComponent } from './draft-picture.component';

describe('DraftPictureComponent', () => {
  let component: DraftPictureComponent;
  let fixture: ComponentFixture<DraftPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraftPictureComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
