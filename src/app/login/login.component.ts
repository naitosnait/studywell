import { Credentials } from '../models/login';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    public test: Date = new Date();

    public credentials: Credentials;;

    constructor(private authService: AuthService, private router: Router) {
        this.redirectToPages();

        this.credentials = {
            email: "",
            password: ""
        }
    }

    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit() {
        this.checkFullPageBackgroundImage();

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    public onSubmit() {
        this.authService.login(this.credentials).subscribe(_ => {
            if (this.authService.isLoggedIn) {
                this.redirectToPages();
            }
        });
    }

    public emailChange(value) {
    }

    private redirectToPages() {
        if (this.authService.isLoggedIn) {
            this.router.navigate(["/pages/all"]);
        }
    }
}
