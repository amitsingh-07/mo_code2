import {
  Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  IInvestmentCriteria
} from '../../../investment/investment-common/investment-common-form-data';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS
} from '../../../investment/investment-engagement-journey/investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../../../investment/investment-engagement-journey/investment-engagement-journey.service';

@Component({
  selector: 'app-edit-investment-modal',
  templateUrl: './edit-investment-modal.component.html',
  styleUrls: ['./edit-investment-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditInvestmentModalComponent implements OnInit {

  @Input() investmentData: any;
  @Input() investmentCriteria: IInvestmentCriteria;
  @Output() modifiedInvestmentData: EventEmitter<any> = new EventEmitter();
  editInvestmentForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService) {
  }

  ngOnInit() {
    this.editInvestmentForm = new FormGroup({
      oneTimeInvestment: new FormControl(this.investmentData.oneTimeInvestment > 0 ? this.investmentData.oneTimeInvestment : null),
      monthlyInvestment: new FormControl(this.investmentData.monthlyInvestment > 0 ? this.investmentData.monthlyInvestment : null)
    }, [this.validateAtleastOne.bind(this)]);
    this.editInvestmentForm.controls['oneTimeInvestment'].setValidators(
      [this.validateInitialAmount.bind(this)]
    );
    this.editInvestmentForm.controls['monthlyInvestment'].setValidators(
      [this.validateMonthlyAmount.bind(this)]
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
      if (value > 0 && value < this.investmentCriteria.oneTimeInvestmentMinimum) {
        return { minInitialAmount: true };
      }
    }
    return null;
  }

  validateMonthlyAmount(control: AbstractControl) {
    const value = parseInt(control.value, 10);
    if (value !== undefined && value !== null) {
      if (value > 0 && value < this.investmentCriteria.monthlyInvestmentMinimum) {
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

  showCPFText() {
    const portfolioSelected = this.investmentEngagementJourneyService.getSelectPortfolioType();
    return portfolioSelected === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.CPF_PORTFOLIO;
  }
}
