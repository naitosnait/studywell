import { Component, NgZone, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'set-page',
  templateUrl: './set-page.component.html',
  styleUrls: ['./set-page.component.css']
})
export class SetPageComponent implements OnInit {

  public users: any;

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone) { }

  ngOnInit() {

  }


}
