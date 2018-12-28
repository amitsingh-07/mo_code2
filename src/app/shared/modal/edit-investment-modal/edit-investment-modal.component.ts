import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../../../config/config.service';
import { Formatter } from '../../../shared/utils/formatter.util';

@Component({
  selector: 'app-edit-investment-modal',
  templateUrl: './edit-investment-modal.component.html',
  styleUrls: ['./edit-investment-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditInvestmentModalComponent implements OnInit {

  @Input() investmentData: any;
  @Output() modifiedInvestmentData: EventEmitter<any> = new EventEmitter();
  editInvestmentForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
    this.editInvestmentForm = new FormGroup({
      oneTimeInvestment: new FormControl(this.investmentData.oneTimeInvestment),
      monthlyInvestment: new FormControl(this.investmentData.monthlyInvestment)
    });
  }

  dataUpdated() {
    this.modifiedInvestmentData.emit(this.editInvestmentForm.value);
  }

}
