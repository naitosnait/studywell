import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { OrgComponent } from './components/org/org.component';
import { CreatePageComponent } from './pages/create-page/create-page.component';
import { PageComponent } from './pages/page/page.component';
import { PagesComponent } from './pages/pages/pages.component';
import { UsersComponent } from './components/users/users.component';
import { SuperUsersComponent } from './components/super-users/super-users.component';
import { PermissionsGuard } from './guards/permissions.guard';
import { AdminGuard } from './guards/admin.guard';
import { CommentsComponent } from './components/comments/comments.component';
import { ArticlesComponent } from './components/articles/articles.component';

export const AppRoutes: Routes = [{
    path: '',
    redirectTo: 'login'
  }, {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [{
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'orgs',
        component: OrgComponent
    },
    {
        path: 'moderators',
        component: SuperUsersComponent,
        canActivate: [AdminGuard]
    },
    {
      path: 'comments/:userName',
      component: CommentsComponent,
    },
    {
      path: 'articles',
      component: ArticlesComponent
  },
  ],
}, {
    path: 'pages',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [{
        path: 'create',
        component: CreatePageComponent,
        canActivate: [PermissionsGuard],
        data: {permission: 'page_add'}
    }, {
        path: 'page/:id',
        component: PageComponent
    }, {
        path: 'edit/:id',
        component: EditPageComponent,
        canActivate: [PermissionsGuard],
        data: {permission: 'pages_edit'}
    }, {
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
