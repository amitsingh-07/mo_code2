import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../../../config/config.service';
import { Formatter } from '../../../shared/utils/formatter.util';
import { InvestmentAccountService } from '../../investment-account-service';

@Component({
  selector: 'app-confirm-withdrawal-modal',
  templateUrl: './confirm-withdrawal-modal.component.html',
  styleUrls: ['./confirm-withdrawal-modal.component.scss']
})
export class ConfirmWithdrawalModalComponent implements OnInit {

  @Input() withdrawAmount: any;
  @Input() withdrawType: any;

  @Output() confirmed: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit() {

  }

  confirmWithdrawal() {
    this.confirmed.emit();
  }

}
