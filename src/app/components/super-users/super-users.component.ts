import { AuthService } from 'app/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExistSuperUser, ModifySuperUser, Permissions } from 'app/models/admin';
import { AdminService } from 'app/services/admin.service';
import { BaseComponent } from 'app/shared/base-component/base-component.component';
import { tap } from 'rxjs/operators';
import { ModifySuperUserComponent } from './modify-super-user/modify-super-user.component';
import { ModifyType, SuperUserType } from 'app/models/enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'super-users',
  templateUrl: './super-users.component.html',
  styleUrls: ['./super-users.component.css']
})
export class SuperUsersComponent extends BaseComponent {

  private permissions: Map<string, Permissions> = new Map<string, Permissions>();

  public superUsers: ExistSuperUser[];

  public disabled: Map<string, boolean> = new Map<string, boolean>();

  constructor(private modalService: NgbModal, private adminService: AdminService, public authService: AuthService, public router: Router) {
    super(authService, router);
    this.getSuperUsers();
  }

  public getSuperUsers() {
    this.adminService.getList()
      .pipe(
        tap(res => {
          this.superUsers = res;

          res.forEach(x => {
            this.permissions.set(x.username, x.permissions);
            this.disabled.set(x.username, true);
          })
        })
      ).subscribe();
  }

  public chahgePermission(userName: string) {
    this.disabled.set(userName, false);
  }

  public editPermissions(userName: string) {
    var permissions: Permissions = this.permissions.get(userName);
    this.adminService.editPermissions(userName, permissions).subscribe(_ => this.disabled.set(userName, true));
  }

  public cancel(userName: string) {
    this.disabled.set(userName, true);
  }

  public createModerator() {
    var modal = this.modalService.open(ModifySuperUserComponent, { size: 'lg' });
    modal.componentInstance.modifyType = ModifyType.Create;
    modal.componentInstance.superUserType = SuperUserType.Moderator;
  }

  public createAdmin() {
    var modal = this.modalService.open(ModifySuperUserComponent, { size: 'lg' });
    modal.componentInstance.modifyType = ModifyType.Create;
    modal.componentInstance.superUserType = SuperUserType.Admin;
  }

  public editModerator(user: ExistSuperUser) {
    var modify = {
      email: user.email,
      username: user.username,
      photo: user.photo
    } as ModifySuperUser;
    var modal = this.modalService.open(ModifySuperUserComponent, { size: 'lg' });
    modal.componentInstance.modifyType = ModifyType.Edit;
    modal.componentInstance.superUserType = SuperUserType.Moderator;
    modal.componentInstance.superUser = modify;
  }

  public delete(userName: string) {
    this.adminService.deleteModerator(userName).subscribe();
  }

  public getDisabledValue(userName: string) {
    return this.disabled.get(userName);
  }
}
