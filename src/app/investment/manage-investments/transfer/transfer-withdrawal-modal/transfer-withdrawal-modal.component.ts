import {  Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../../manage-investments.constants';

@Component({
  selector: 'app-transfer-withdrawal-modal',
  templateUrl: './transfer-withdrawal-modal.component.html',
  styleUrls: ['./transfer-withdrawal-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DecimalPipe]
})
export class TransferWithdrawalModalComponent implements OnInit {
  currentDate;
  @Input() TransferAmount: any;
  @Input() transferTo: any;
  @Input() transferFrom: any;
  @Output() confirmed: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
  
    private decimalPipe: DecimalPipe) { 
     
    }

  ngOnInit() {
    this.currentDate = Date.now();
    console.log(this.currentDate);
  
  }

  confirmWithdrawal(event) {
    this.confirmed.emit();
    
  }
  
}







