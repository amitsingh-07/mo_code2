import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transfer-withdrawal-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DecimalPipe]
})
export class TransferModalComponent implements OnInit {
  currentDate;
  @Input() TransferAmount: any;
  @Input() transferTo: any;
  @Input() transferFrom: any;
  @Output() confirmed: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.currentDate = Date.now();
  }

  confirmWithdrawal(event) {
    this.confirmed.emit();
  }

}
