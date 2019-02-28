import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from '../../direct.service';

@Component({
  selector: 'app-retirement-income-form',
  templateUrl: './retirement-income-form.component.html',
  styleUrls: ['./retirement-income-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class RetirementIncomeFormComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  retirementIncomeForm: FormGroup;
  categorySub: any;
  formValues: any;
  payoutFeature = '';
  payoutDuration = '';
  retirementIncomeList = Array(11).fill(500).map((x, i) => x += i * 100);
  selectedRetirementIncome = '';
  payoutAgeList = [50, 55, 60, 65];
  selectedPayoutAge = '';
  payoutDurationList;
  payoutFeatureList;
  doberror = false;

  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private translate: TranslateService,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.payoutDurationList = this.translate.instant('RETIREMENT_INCOME.PAYOUT_DURATION_LIST');
      this.payoutFeatureList = this.translate.instant('RETIREMENT_INCOME.PAYOUT_FEATURE_LIST');
    });
  }

  ngOnInit() {
    this.formValues = this.directService.getRetirementIncomeForm();
    this.formValues.smoker = this.formValues.smoker;

    this.retirementIncomeForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      smoker: [this.formValues.smoker],
      retirementIncome: [this.formValues.retirementIncome, Validators.required],
      payoutAge: [this.formValues.payoutAge, Validators.required],
      payoutDuration: [this.formValues.payoutDuration, Validators.required],
      payoutFeature: [this.formValues.payoutFeature, Validators.required]
    });
    if (this.formValues.retirementIncome !== undefined) {
      this.selectRetirementIncome(this.formValues.retirementIncome);
    }
    if (this.formValues.payoutAge !== undefined) {
      this.selectPayoutAge(this.formValues.payoutAge);
    }
    if (this.formValues.payoutDuration !== undefined) {
      this.selectPayoutDuration(this.formValues.payoutDuration);
    }
    if (this.formValues.payoutFeature !== undefined) {
      this.selectPayoutFeature(this.formValues.payoutFeature);
    }
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '7') {
        if (this.save()) {
          this.formSubmitted.emit(this.summarizeDetails());
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectRetirementIncome(selectedRetirementIncome) {
    this.selectedRetirementIncome = selectedRetirementIncome;
    this.retirementIncomeForm.controls.retirementIncome.setValue(this.selectedRetirementIncome);
  }

  selectPayoutAge(selectedPayoutAge) {
    this.selectedPayoutAge = selectedPayoutAge;
    this.retirementIncomeForm.controls.payoutAge.setValue(this.selectedPayoutAge);
  }

  selectPayoutDuration(payoutDuration) {
    this.payoutDuration = payoutDuration;
    this.retirementIncomeForm.controls.payoutDuration.setValue(this.payoutDuration);
  }
  selectPayoutFeature(payoutFeature) {
    this.payoutFeature = payoutFeature;
    this.retirementIncomeForm.controls.payoutFeature.setValue(this.payoutFeature);
  }

  showPayoutFeatureModal() {
    this.directService.showToolTipModal(
      this.translate.instant('RETIREMENT_INCOME.FIXED_TOOLTIP.TITLE'),
      this.translate.instant('RETIREMENT_INCOME.FIXED_TOOLTIP.MESSAGE'));
  }

  summarizeDetails() {
    let sum_string = '';
    sum_string += '$' + this.selectedRetirementIncome + ' / mth,  ';
    sum_string += 'Payout Age ' + this.selectedPayoutAge + ', ';
    sum_string += 'Payout For ' + this.payoutDuration;
    return sum_string;
  }

  save() {
    const form = this.retirementIncomeForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      if (!form.controls['dob'].valid && form.controls['gender'].valid) {
        this.doberror = true;
      }
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.retirementIncome = this.selectedRetirementIncome;
    form.value.payoutAge = this.selectedPayoutAge;
    form.value.payoutDuration = this.payoutDuration;
    form.value.payoutFeature = this.payoutFeature;
    this.directService.setRetirementIncomeForm(form.value);
    return true;
  }
}
