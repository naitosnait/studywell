import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";

export abstract class BaseComponent {

  public role: string;

  constructor(public authService: AuthService, public router: Router) {
    this.role = this.authService.getRole();
  }

  public hasPermission(name: string): boolean {
    return this.authService.checkPermissions(name);
  }
}
