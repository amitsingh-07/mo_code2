import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-will-disclaimer',
  templateUrl: './will-disclaimer.component.html',
  styleUrls: ['./will-disclaimer.component.scss']
})
export class WillDisclaimerComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
