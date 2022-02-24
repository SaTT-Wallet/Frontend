import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonBoySocialMediasComponent } from './moon-boy-social-medias.component';

describe('MoonBoySocialMediasComponent', () => {
  let component: MoonBoySocialMediasComponent;
  let fixture: ComponentFixture<MoonBoySocialMediasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoonBoySocialMediasComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoonBoySocialMediasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
