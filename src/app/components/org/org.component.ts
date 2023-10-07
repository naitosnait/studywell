import { Component, OnInit } from '@angular/core';
import { Org } from '../../models/org';
import { OrgService } from '../../services/org.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageComponent } from './set-page/set-page.component';

declare var $: any;

@Component({
  selector: 'org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})
export class OrgComponent implements OnInit {

  public orgs: Org[] = [];
  public page = 1;
  public size = 10;

  public showDescription = false;

  state_plain: boolean = true;

  constructor(private orgService: OrgService, private modalService: NgbModal) {
    this.orgService.getOrgs(this.page, this.size).subscribe(res => this.orgs = res);
  }

  ngOnInit(): void { }

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
