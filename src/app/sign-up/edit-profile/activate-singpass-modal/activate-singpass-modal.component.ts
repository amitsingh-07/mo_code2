import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-activate-singpass-modal',
  templateUrl: './activate-singpass-modal.component.html',
  styleUrls: ['./activate-singpass-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivateSingpassModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
