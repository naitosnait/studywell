import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './components/users/users.component';
import { OrgComponent } from './components/org/org.component';
import { CreatePageComponent } from './pages/create-page/create-page.component';
import { PageComponent } from './pages/page/page.component';
import { PagesComponent } from './pages/pages/pages.component';

export const AppRoutes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
}, {
    path: 'components',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    children: [{
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'orgs',
        component: OrgComponent
    },],
}, {
    path: 'pages',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    children: [{
        path: 'create',
        component: CreatePageComponent
    }, {
        path: 'page/:id',
        component: PageComponent
    }, {
    //     path: 'edit/:id',
    //     component: EditPageComponent
    // }, {
        path: 'all',
        component: PagesComponent
    }
    ]
}, {
    path: '',
    component: AuthLayoutComponent,
    children: [{
        path: 'login',
        component: LoginComponent
    }]
}];
