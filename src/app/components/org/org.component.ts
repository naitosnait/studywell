import { AuthService } from 'app/services/auth.service';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Org } from '../../models/org';
import { OrgService } from '../../services/org.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageComponent } from './set-page/set-page.component';
import { BaseComponent } from 'app/shared/base-component/base-component.component';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})
export class OrgComponent extends BaseComponent {

  public orgs: Observable<Org[]>;
  public page = 1;
  public size = 10;
  public totalItems: number;

  public showDescription = false;
  public showPaging = false;


  constructor(private orgService: OrgService, private modalService: NgbModal, public authService: AuthService, public router: Router) {
    super(authService, router);
    this.getOrgs(this.page);
  }

  public getOrgs(page: number) {
    this.orgs = this.orgService.getOrgs(page, this.size).pipe(
      tap(res => {
        this.showPaging = true;
        this.totalItems = res.c_orgs;
        // if(this.asyncIndex < 150){
        //   this.asyncIndex += 10; // increment index to show total changing
        // }
        this.page = page;
      }),
      map(res => res.orgs));
  }

  public onClickShow() {
    this.showDescription = !this.showDescription;
  }

  public setPage(email: string) {
    var modal = this.modalService.open(SetPageComponent, { size: 'lg' });
    modal.componentInstance.email = email;
  }

  public activate(email: string, value: boolean) {
    this.orgService.activateOrg(email, value).subscribe();
  }

  public delete(email: string) {
    this.orgService.deleteOrg(email).subscribe();
  }
}
