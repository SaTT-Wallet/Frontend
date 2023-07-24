import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { catchError, filter, mergeMap, mergeMapTo } from 'rxjs/operators';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { INotificationsResponse } from '@app/core/notifications-response.interface';
import { IApiResponse } from '@app/core/types/rest-api-responses';

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
    return this.http.get<INotificationsResponse>(
      sattUrl + '/profile/notifications'
    );
  }
  

  notificationSeen(): Observable<IApiResponse<{ [key: string]: string }>> {
    return this.http.get<IApiResponse<{ [key: string]: string }>>(
      sattUrl + '/profile/notification/issend/clicked'
    );
  }

  oneNotificationSeen(id: any) {
    return this.http.post(
      sattUrl + '/profile/notification/seen/' + id,
      {},
    );
  }

  saveAccessfcm(data: any) {
    return this.http.post(
      sattUrl + '/auth/save/firebaseAccessToken',
      data
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
