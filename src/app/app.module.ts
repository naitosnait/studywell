import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { PagesnavbarModule } from './shared/pagesnavbar/pagesnavbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { OrgModule } from './components/org/org.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PagesModule } from './pages/pages/pages.module';
import { PageModule } from './pages/page/page.module';
import { CreatePageModule } from './pages/create-page/create-page.module';
import { EditPageModule } from './pages/edit-page/edit-page.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    SidebarModule,
    NavbarModule,
    FooterModule,
    HttpClientModule,
    PagesnavbarModule,
    ReactiveFormsModule,
    OrgModule,
    PagesModule,
    PageModule,
    CreatePageModule,
    EditPageModule,
    NgbModule,
    NgSelectModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
  ],
  bootstrap: [AppComponent],
  providers: [AuthGuard, AuthService]
})

export class AppModule { }
