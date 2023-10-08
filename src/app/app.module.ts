import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { OrgModule } from './components/org/org.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PagesModule } from './pages/pages/pages.module';
import { PageModule } from './pages/page/page.module';
import { CreatePageModule } from './pages/create-page/create-page.module';
import { EditPageModule } from './pages/edit-page/edit-page.module';
import { UsersModule } from './components/users/users.module';
import { SuperUsersModule } from './components/super-users/super-users.module';
import { ArticlesModule } from './components/articles/articles.module';
import { PermissionsGuard } from './guards/permissions.guard';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    NavbarModule,
    FooterModule,
    HttpClientModule,
    ReactiveFormsModule,
    OrgModule,
    PagesModule,
    PageModule,
    CreatePageModule,
    EditPageModule,
    NgbModule,
    NgSelectModule,
    UsersModule,
    SuperUsersModule,
    ArticlesModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
  ],
  bootstrap: [AppComponent],
  providers: [AuthGuard, AdminGuard, AuthService, PermissionsGuard]
})

export class AppModule { }
