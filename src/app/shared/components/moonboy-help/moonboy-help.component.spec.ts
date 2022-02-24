import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonboyHelpComponent } from './moonboy-help.component';

describe('MoonboyHelpComponent', () => {
  let component: MoonboyHelpComponent;
  let fixture: ComponentFixture<MoonboyHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoonboyHelpComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoonboyHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
