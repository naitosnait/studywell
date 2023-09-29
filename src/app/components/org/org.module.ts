import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgComponent } from './org.component';
import { OrgService } from '../../services/org.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { SetPageComponent } from './set-page/set-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [OrgComponent, SetPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule,
    NgbModule
  ],
  providers: [OrgService],
  entryComponents: [SetPageComponent]
})
export class OrgModule { }
