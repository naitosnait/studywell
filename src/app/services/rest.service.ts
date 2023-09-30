import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Observable } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private readonly url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json',
    }),
    withCredentials: true
  };

  httpOptionsPost = {
    headers: new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.url + url, this.httpOptions);
  }

  public post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.url + url, body, this.httpOptionsPost)
      .pipe(catchError(this.handleError));
  }

  public put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(this.url + url, body, this.httpOptionsPost)
      .pipe(catchError(this.handleError));
  }

  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.url + url, this.httpOptions);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
