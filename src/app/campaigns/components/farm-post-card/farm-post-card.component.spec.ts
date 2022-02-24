import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FarmPostCardComponent } from './farm-post-card.component';

describe('FarmPostCardComponent', () => {
  let component: FarmPostCardComponent;
  let fixture: ComponentFixture<FarmPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FarmPostCardComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [{ provide: AngularFireMessaging, useValue: undefined }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
