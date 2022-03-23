import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export class ControlInput {
  constructor(
    public genUrl?: any,
    public firstConfirmUrl?: any,
    public showPuzzle?: boolean
  ) {
    this.genUrl = genUrl || '/api/gen';
    this.firstConfirmUrl = firstConfirmUrl || '/api/firstConfirm';
    this.showPuzzle = showPuzzle || false;
  }
}

export interface Result {
  success: boolean;
  code: string;
  msg: string;
  errorMsg: string;
  data: any;
}

export interface VertifyQuery {
  move: number | undefined;
  action: number[] | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class ControlService {
  constructor(private http: HttpClient) {}

  getHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true //  it's important to keep session !
  };

  getAuthImage(url: string): Observable<Result> {
    return this.http.get<Result>(url, this.getHttpOptions).pipe();
  }

  vertifyAuthImage(url: string, query: VertifyQuery): Observable<Result> {
    return this.http.post<Result>(url, query, this.getHttpOptions).pipe();
  }
}
