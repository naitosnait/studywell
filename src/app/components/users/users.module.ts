import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserService } from 'app/services/user.service';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule,
    NgbModule,
    NgSelectModule],
    providers: [UserService]
})
export class UsersModule { }
