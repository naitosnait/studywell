import { Injectable } from '@angular/core';
import { CreateSuperUser, ExistSuperUser, ModifySuperUser, Permissions } from "app/models/admin";
import { RestService } from "./rest.service";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ModeratorsListResponse } from 'app/models/response';

@Injectable()
export class AdminService {
  constructor(private restService: RestService) { }

  public createAdmin(user: CreateSuperUser): Observable<any> {
    var url = "/admin/create_admin";
    return this.restService.post<any>(url, user);
  }

  public createModerator(user: CreateSuperUser): Observable<any> {
    var url = "/admin/create_moderator";
    return this.restService.post<any>(url, user);
  }

  public editModerator(userName: string, user: ModifySuperUser): Observable<any> {
    var url = `/admin/edit_moderator?username=${userName}`;
    return this.restService.put<any>(url, user);
  }

  public deleteModerator(userName: string): Observable<string> {
    var url = `/admin/delete_moderator?username=${userName}`;
    return this.restService.delete<string>(url);
  }

  public editPermissions(userName: string, permissions: Permissions): Observable<any> {
    var url = `/admin/edit_moderator_permissions?username=${userName}`;
    return this.restService.put<any>(url, { permissions });
  }

  public getList(): Observable<ExistSuperUser[]> {
    var url = "/admin/list_moderators";
    return this.restService.get<ModeratorsListResponse>(url)
      .pipe(map(res => res.moderators));
  }
}
