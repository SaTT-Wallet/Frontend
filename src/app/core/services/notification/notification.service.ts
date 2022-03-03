import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { BehaviorSubject, of } from 'rxjs';
import { __values } from 'tslib';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { catchError, filter, mergeMap, mergeMapTo } from 'rxjs/operators';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  httpOptions: any;
  private currentMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  public newNotification: BehaviorSubject<any> = new BehaviorSubject(false);

  readonly notifications$ = this.currentMessage
    .asObservable()
    .pipe(filter((message) => message !== null));
  constructor(
    private http: HttpClient,
    private angularFireMessaging: AngularFireMessaging,
    private tokenStorageService: TokenStorageService
  ) {}

  getAllNotifications() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.tokenStorageService.getToken()
      })
    };
    return this.http.get<any>(sattUrl + '/notifications', this.httpOptions);
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
    return this.http.put(
      sattUrl + '/profile/notification/issend/clicked',
      {},
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
      sattUrl + '/notification/seen/' + id,
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
      sattUrl + '/profile/save-fcm-accessToken',
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
        .subscribe((response: any) => {});
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
