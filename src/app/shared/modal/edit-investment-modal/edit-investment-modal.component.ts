import {
    Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../../../config/config.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../../investment/investment-engagement-journey/investment-engagement-journey.constants';
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
    }, [this.validateAtleastOne.bind(this)]);
    this.editInvestmentForm.controls['oneTimeInvestment'].setValidators(
      [this.validateInitialAmount]
    );
    this.editInvestmentForm.controls['monthlyInvestment'].setValidators(
      [this.validateMonthlyAmount]
    );
  }

  dataUpdated(form) {
    if (form.valid) {
      this.modifiedInvestmentData.emit(this.editInvestmentForm.value);
    }
  }

  validateInitialAmount(control: AbstractControl) {
    const value = parseInt(control.value, 10);
    if (value !== undefined && value !== null) {
      if (value > 0 && value < 100) {
        return { minInitialAmount: true };
      }
    }
    return null;
  }

  validateMonthlyAmount(control: AbstractControl) {
    const value = parseInt(control.value, 10);
    if (value !== undefined && value !== null) {
      if (value > 0 && value < 50) {
        return { minMonthlyAmount: true };
      }
    }
    return null;
  }

  validateAtleastOne(control: AbstractControl) {
    if (control.value.oneTimeInvestment > 0 ||
      control.value.monthlyInvestment > 0) {
        return null;
    } else {
        return { atleastOne: true };
    }
  }

}
