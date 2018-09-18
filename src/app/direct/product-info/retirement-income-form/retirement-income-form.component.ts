import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
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
  retirementIncomeForm: FormGroup;
  categorySub: any;
  formValues: any;
  payoutFeature;
  payoutDuration;
  retirementIncomeList = Array(16).fill(500).map((x, i) => x += i * 100);
  selectedRetirementIncome = 500;
  payoutAgeList = Array(16).fill(55).map((x, i) => x += i * 1);
  selectedPayoutAge = 55;
  payoutDurationList;
  payoutFeatureList;

  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private translate: TranslateService,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    this.payoutDurationList = this.translate.instant('RETIREMENT_INCOME.PAYOUT_DURATION_LIST');
    this.payoutDuration = this.payoutDurationList[0];
    this.payoutFeatureList = this.translate.instant('RETIREMENT_INCOME.PAYOUT_FEATURE_LIST');
    this.payoutFeature = this.payoutFeatureList[0];
    });
    }

    ngOnInit() {
      this.directService.setProdCategoryIndex(6);
      this.formValues = this.directService.getRetirementIncomeForm();
      this.formValues.smoker = this.formValues.smoker ? this.formValues.smoker : 'nonsmoker';
      if (this.formValues.retirementIncome !== undefined ) {
        this.selectRetirementIncome(this.formValues.retirementIncome);
      }
      if (this.formValues.payoutAge !== undefined ) {
        this.selectPayoutAge(this.formValues.payoutAge);
      }
      if (this.formValues.payoutDuration !== undefined ) {
        this.selectPayoutDuration(this.formValues.payoutDuration);
      }
      if (this.formValues.payoutFeature !== undefined ) {
        this.selectPayoutFeature(this.formValues.payoutFeature);
      }
      this.retirementIncomeForm = this.formBuilder.group({
        gender: [this.formValues.gender, Validators.required],
        dob: [this.formValues.dob, Validators.required],
        smoker: [this.formValues.smoker, Validators.required],
        retirementIncome: [this.formValues.retirementIncome],
        payoutAge: [this.formValues.payoutAge],
        payoutDuration: [this.formValues.payoutDuration],
        payoutFeature: [this.formValues.payoutFeature]
      });
      this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '') {
        if (this.save()) {
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
        this.directService.triggerSearch('');
      }
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

    selectRetirementIncome(selectedRetirementIncome) {
    this.selectedRetirementIncome = selectedRetirementIncome;
  }

  selectPayoutAge(selectedPayoutAge) {
    this.selectedPayoutAge = selectedPayoutAge;
  }

  selectPayoutDuration(payoutDuration) {
    this.payoutDuration = payoutDuration;
  }
  selectPayoutFeature(payoutFeature) {
    this.payoutFeature = payoutFeature;
  }

  showPayoutFeatureModal() {
    this.directService.showToolTipModal(
      this.translate.instant('RETIREMENT_INCOME.TOOLTIP.TITLE'),
      this.translate.instant('RETIREMENT_INCOME.TOOLTIP.MESSAGE')
      );
  }

  summarizeDetails() {
    let sum_string = '';
    sum_string += '$' + this.selectedRetirementIncome + ', ';
    sum_string += '$' + this.selectedPayoutAge + ', ';
    sum_string += this.payoutDuration + ', ';
    sum_string += this.payoutFeature;
    return sum_string;
  }

  save() {
    const form = this.retirementIncomeForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

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
