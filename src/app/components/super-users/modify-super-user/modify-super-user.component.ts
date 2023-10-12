import { Component, Input, OnInit } from '@angular/core';
import { CreateSuperUser, ModifySuperUser, Permissions } from 'app/models/admin';
import { ModifyType, SuperUserType } from 'app/models/enums';
import { AdminService } from 'app/services/admin.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { emailExpression } from 'app/utils/consts';

@Component({
  selector: 'modify-super-user',
  templateUrl: './modify-super-user.component.html',
  styleUrls: ['./modify-super-user.component.css']
})
export class ModifySuperUserComponent implements OnInit {

  @Input() modifyType: ModifyType;
  @Input() superUserType: SuperUserType;
  @Input() superUser: ModifySuperUser;

  createType = ModifyType.Create;
  admintype = SuperUserType.Admin;

  username: string = "";
  email: string = "";
  password: string = "";
  passwordConfirm: string = "";

  photo: any;

  permissions = {
    users_ban: false,
    orgs_ban: false,
    page_add: false,
    pages_edit: false,
    pages_delete: false,
    blog_add: false,
    blog_edit: false,
    blog_delete: false,
    usercomments_edit: false,
    usercomments_delete: false
  } as Permissions;

  validPassword: string = "";
  validConfirmPassword: string = "";

  validateMessages: string[] = [];

  constructor(public activeModal: NgbActiveModal, private adminService: AdminService) { }

  ngOnInit(): void {
    if (this.modifyType !== this.createType) {
      this.username = this.superUser?.username;
      this.email = this.superUser?.email;
      this.photo = this.superUser?.photo;
    }
  }

  public save() {
    if (this.validate())
      this.modify().subscribe(() => this.activeModal.close('Close click'));
  }

  public validate(): boolean {
    this.validateMessages = [];
    this.validPassword = this.validConfirmPassword = "";

    if (!emailExpression.test(this.email)) {
      this.validateMessages.unshift("Wrong email format (mail@mail.com)");
    }

    if (this.password.length < 8) {
      this.validateMessages.push("Password could not be less than 8 characters");
    }

    if (this.password != this.passwordConfirm) {
      this.validPassword = this.validConfirmPassword = "validate-error";
      this.validateMessages.push("Passwords don't match");
    }

    return this.validateMessages.length > 0;
  }

  private modify(): Observable<any> {
    if (this.modifyType == this.createType) {
      var newUser = {
        email: this.email,
        username: this.username,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
        permissions: this.permissions
      } as CreateSuperUser;
      if (this.superUserType == SuperUserType.Admin) {
        return this.adminService.createAdmin(newUser);
      } else {
        return this.adminService.createModerator(newUser);
      }
    }
    var modified = {
      email: this.email,
      username: this.username,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
    } as ModifySuperUser;
    return this.adminService.editModerator(this.superUser.username, modified);
  }
}
