import { Component } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { BaseComponent } from '../base-component/base-component.component';
import { Router } from '@angular/router';

@Component({
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent extends BaseComponent {

    constructor(public authService: AuthService, public router: Router) {
      super(authService, router);
    }

    public logout() {
        this.authService.logout().subscribe();
    }
}
