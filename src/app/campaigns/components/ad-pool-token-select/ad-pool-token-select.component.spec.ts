import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPoolTokenSelectComponent } from './ad-pool-token-select.component';

describe('AdPoolTokenSelectComponent', () => {
  let component: AdPoolTokenSelectComponent;
  let fixture: ComponentFixture<AdPoolTokenSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdPoolTokenSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPoolTokenSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
