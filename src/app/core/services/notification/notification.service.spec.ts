import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Type } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AngularFireMessaging, useValue: undefined }]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.get(
      HttpTestingController as Type<HttpTestingController>
    );
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
