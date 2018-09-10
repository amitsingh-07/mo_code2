import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltip-modal',
  templateUrl: './tooltip-modal.component.html',
  styleUrls: ['./tooltip-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolTipModalComponent implements OnInit {
  @Input() tooltipTitle: any;
  @Input() tooltipMessage: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
