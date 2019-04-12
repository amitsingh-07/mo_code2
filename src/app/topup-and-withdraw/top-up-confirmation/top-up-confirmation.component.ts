import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-top-up-confirmation',
  templateUrl: './top-up-confirmation.component.html',
  styleUrls: ['./top-up-confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopUpConfirmationComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
  }

}
