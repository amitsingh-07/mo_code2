import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../../../config/config.service';
import { Formatter } from '../../../shared/utils/formatter.util';
import { InvestmentAccountService } from '../../investment-account-service';

@Component({
  selector: 'app-edit-investment-modal',
  templateUrl: './edit-investment-modal.component.html',
  styleUrls: ['./edit-investment-modal.component.scss']
})
export class EditInvestmentModalComponent implements OnInit {

  formValues;

  @Input() investmentData: any;
  @Output() modifiedInvestmentData: EventEmitter<any> = new EventEmitter();
  editInvestmentForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private investmentAccountService: InvestmentAccountService,
    private config: ConfigService) {

  }

  ngOnInit() {
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();

    this.editInvestmentForm = new FormGroup({
      investmentPeriod: new FormControl(this.investmentData.investmentPeriod),
      oneTimeInvestment: new FormControl(this.investmentData.oneTimeInvestment),
      monthlyInvestment: new FormControl(this.investmentData.monthlyInvestment)
    });
  }

  dataUpdated() {
    this.modifiedInvestmentData.emit(this.editInvestmentForm.value);
  }

}
