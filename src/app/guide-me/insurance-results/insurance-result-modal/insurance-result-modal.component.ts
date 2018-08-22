import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-insurance-result-modal',
  templateUrl: './insurance-result-modal.component.html',
  styleUrls: ['./insurance-result-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceResultModalComponent implements OnInit {
  @Input() data: string;

  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit() {
  }

}
