import { LoginResponse, ProfileResponse } from 'app/models/response';
import { Credentials } from '../models/login';
import { Injectable } from "@angular/core";
import { RestService } from "app/services/rest.service";
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ExistSuperUser } from 'app/models/admin';
import { isNullOrUndefined } from 'app/utils/utils';

@Injectable()
export class AuthService {

  public isLoggedIn = false;

  private profile: ExistSuperUser;

  constructor(private rest: RestService) { }

  public login(credentials: Credentials): Observable<any> {
    var url = "/admin/login";
    return this.rest.post<LoginResponse>(url, credentials)
      .pipe(
        switchMap(res => {
          this.isLoggedIn = res.status == "success";
          if (this.isLoggedIn)
            return this.getMyProfile();
          return of(null);
        }),
        tap(res => {
          if (!isNullOrUndefined(res))
            this.profile = res.moderator;
        })
      );
  }

  public logout(): Observable<any> {
    var url = "/admin/logout";
    return this.rest.get(url)
      .pipe(tap(_ => this.isLoggedIn = false));
  }

  public getRole(): string {
    return this.profile.role;
  }

  public hasPermissions(component): boolean {
    return this.checkPermissions[component?.data?.permission];
  }

  public checkPermissions(name: string): boolean {
    return this.profile?.permissions[name];
  }

  private getMyProfile(): Observable<ProfileResponse> {
    var url = "/admin/profile";
    return this.rest.get<ProfileResponse>(url);
  }
}
