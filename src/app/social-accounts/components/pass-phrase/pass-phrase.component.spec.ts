import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassPhraseComponent } from './pass-phrase.component';

describe('PassPhraseComponent', () => {
  let component: PassPhraseComponent;
  let fixture: ComponentFixture<PassPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassPhraseComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
