import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateArtcleComponent } from './create-artcle/create-artcle.component';
import { ModifyType } from 'app/models/enums';

@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent {

  constructor(private modalService: NgbModal){}

  public create() {
    var modal = this.modalService.open(CreateArtcleComponent, { size: 'lg' });
    modal.componentInstance.modifyType = ModifyType.Create;
  }

  public edit() {
    var modal = this.modalService.open(CreateArtcleComponent, { size: 'lg' });
    modal.componentInstance.modifyType = ModifyType.Edit;
  }
}
