import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { __values } from 'tslib';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { catchError, filter, mergeMap, mergeMapTo } from 'rxjs/operators';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { INotificationsResponse } from '@app/core/notifications-response.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  httpOptions: any;
  public currentMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  public newNotification: BehaviorSubject<any> = new BehaviorSubject(false);
  public triggerFireBaseNotifications = new Subject();

  readonly notifications$ = this.currentMessage.asObservable().pipe(
    filter((message) => {
      return message !== null;
    })
  );
  constructor(
    private http: HttpClient,
    private angularFireMessaging: AngularFireMessaging,
    private tokenStorageService: TokenStorageService
  ) {}

  getAllNotifications(): Observable<INotificationsResponse> {
    this.httpOptions = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get<INotificationsResponse>(
      sattUrl + '/profile/notifications',
      {
        headers: this.httpOptions
      }
    );
  }
  notifIsSendRes() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.tokenStorageService.getToken()
      })
    };
    return this.http.patch(sattUrl + '/issend', {}, this.httpOptions);
  }

  notificationSeen() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.tokenStorageService.getToken()
      })
    };
    return this.http.get(
      sattUrl + '/profile/notification/issend/clicked',
      this.httpOptions
    );
  }

  oneNotificationSeen(id: any) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.tokenStorageService.getToken()
      })
    };
    return this.http.post(
      sattUrl + '/profile/notification/seen/' + id,
      {},
      this.httpOptions
    );
  }

  saveAccessfcm(data: any) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.tokenStorageService.getToken()
      })
    };
    return this.http.post(
      sattUrl + '/auth/save/firebaseAccessToken',
      data,
      this.httpOptions
    );
  }

  requestPermission() {
    if (!!this.angularFireMessaging) {
      this.angularFireMessaging.requestToken
        .pipe(
          catchError((err: any) => {
            return of(err);
          }),
          mergeMap((token: any) => {
            if (token) {
              return this.saveAccessfcm({ fb_accesstoken: token });
            } else {
              this.noToken();
            }
            return of(null);
          })
        )
        .pipe(filter((res) => res !== null))
        .subscribe(() => {});
    }
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      this.currentMessage.next(payload);
    });
  }

  noToken() {
    this.angularFireMessaging.requestPermission.pipe(
      mergeMapTo(this.angularFireMessaging.tokenChanges),
      mergeMap((token: any) => {
        return this.saveAccessfcm({ fb_accesstoken: token });
      })
    );
  }
}
