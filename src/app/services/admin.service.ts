import { Injectable } from '@angular/core';
import { CreateSuperUser, ExistSuperUser, ModifySuperUser, Permissions } from "app/models/admin";
import { RestService } from "./rest.service";

@Injectable()
export class AdminService {
    constructor(private restService: RestService) { }

    public createAdmin(user: CreateSuperUser) {
        var url = "/admin/create_admin";
        return this.restService.post<any>(url, user);
    }

    public createModerator(user: CreateSuperUser) {
        var url = "/admin/create_moderator";
        return this.restService.post<any>(url, user);
    }

    public editModerator(userName: string, user: ModifySuperUser) {
        var url = `/admin/edit_moderator?username=${userName}`;
        return this.restService.put<any>(url, user);
    }

    public deleteModerator(userName: string) {
        var url = `/admin/delete_moderator?username=${userName}`;
        return this.restService.delete<string>(url);
    }

    public editPermissions(userName: string, permissions: Permissions) {
        var url = `/admin/edit_moderator_permissions?username=${userName}`;
        return this.restService.put<any>(url, permissions);
    }

    public getList() {
        var url = "/admin/list_moderators";
        return this.restService.get<ExistSuperUser[]>(url);
    }

    public getMyProfile() {
        var url = "/admin/profile";
        return this.restService.get<ExistSuperUser>(url);
    }
}
