import { UserResponse } from "app/models/response";
import { RestService } from "./rest.service";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from "app/models/user";
import { map } from "rxjs/operators";

@Injectable()
export class UserService {
    constructor(private rest: RestService) { }

    public getUsers(page: number,size: number): Observable<User[]>{
        var url = `/admin/user/list?page=${page}&size=${size}`;
        return this.rest.get<UserResponse>(url)
          .pipe(map(res => res.users));
    }

    public userBan(userName: string, trigger: boolean) {
        var url = `/admin/user/ban?username==${userName}&ban_status=${trigger}`;
        return this.rest.post<string>(url, {});
    }
}
