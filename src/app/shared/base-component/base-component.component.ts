import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";

export abstract class BaseComponent {

  public role: string;

  constructor(public authService: AuthService, public router: Router) {
    this.role = this.authService.getRole();
    if (!this.authService.isLoggedIn)
      this.router.navigate(['/login']);
  }

  public hasPermission(name: string): boolean {
    return this.authService.checkPermissions(name);
  }
}
