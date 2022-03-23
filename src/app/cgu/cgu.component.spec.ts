import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CguComponent } from './cgu.component';

describe('CguComponent', () => {
  let component: CguComponent;
  let fixture: ComponentFixture<CguComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CguComponent ],
      imports: [TranslateModule.forRoot()]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CguComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
