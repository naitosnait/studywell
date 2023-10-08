import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperUsersComponent } from './super-users.component';
import { AdminService } from 'app/services/admin.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SuperUsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    NgSelectModule
  ],
  providers: [AdminService]
})
export class SuperUsersModule { }
