import { LoginResponse } from 'app/models/response';
import { Credentials } from '../models/login';
import { Injectable } from "@angular/core";
import { RestService } from "app/services/rest.service";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  public isLoggedIn = false;

  constructor(private rest: RestService) { }

  public login(credentials: Credentials): Observable<LoginResponse> {
    var url = "/admin/login";
    return this.rest.post<LoginResponse>(url, credentials)
      .pipe(tap(res => {
        this.isLoggedIn = res.status == "success";
      }));
  }

  public logout(): Observable<any> {
    var url = "/admin/logout";
    return this.rest.get(url)
      .pipe(tap(_ => this.isLoggedIn = false));
  }
}
