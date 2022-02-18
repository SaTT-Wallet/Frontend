import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeInputAuthComponent } from './code-input-auth.component';

describe('CodeInputAuthComponent', () => {
  let component: CodeInputAuthComponent;
  let fixture: ComponentFixture<CodeInputAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeInputAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeInputAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
