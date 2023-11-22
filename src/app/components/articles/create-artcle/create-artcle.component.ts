import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModifyType } from 'app/models/enums';

@Component({
  selector: 'create-artcle',
  templateUrl: './create-artcle.component.html',
  styleUrls: ['./create-artcle.component.css']
})
export class CreateArtcleComponent {
  @Input() modifyType: ModifyType;

  createType = ModifyType.Create;

  titile: string = "";
  content: string = "";

  constructor(public activeModal: NgbActiveModal){}

  public save() {

  }
}
