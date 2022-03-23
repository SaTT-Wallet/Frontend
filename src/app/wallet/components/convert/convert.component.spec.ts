import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertComponent } from './convert.component';

describe('ConvertComponent', () => {
  let component: ConvertComponent;
  let fixture: ComponentFixture<ConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
