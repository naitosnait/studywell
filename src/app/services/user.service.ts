import { UserResponse } from "app/models/response";
import { RestService } from "./rest.service";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class UserService {
  constructor(private rest: RestService) { }

  public getUsers(page: number, size: number): Observable<UserResponse> {
    var url = `/admin/user/list?page=${page}&size=${size}`;
    return this.rest.get<UserResponse>(url)
  }

  public userBan(userName: string, trigger: boolean) {
    var url = `/admin/user/ban?username==${userName}&ban_status=${trigger}`;
    return this.rest.get<string>(url);
  }
}
