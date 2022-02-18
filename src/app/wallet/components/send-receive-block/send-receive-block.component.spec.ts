import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { SendReceiveBlockComponent } from './send-receive-block.component';

describe('SendReceiveBlockComponent', () => {
  let component: SendReceiveBlockComponent;
  let fixture: ComponentFixture<SendReceiveBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendReceiveBlockComponent,TranslatePipe],
      imports:[TranslateModule.forRoot(),]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReceiveBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
