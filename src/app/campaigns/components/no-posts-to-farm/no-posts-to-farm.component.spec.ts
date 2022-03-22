import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPostsToFarmComponent } from './no-posts-to-farm.component';

describe('NoPostsToFarmComponent', () => {
  let component: NoPostsToFarmComponent;
  let fixture: ComponentFixture<NoPostsToFarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoPostsToFarmComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPostsToFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
