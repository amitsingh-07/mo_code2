import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from '../../direct.service';

@Component({
  selector: 'app-retirement-income-form',
  templateUrl: './retirement-income-form.component.html',
  styleUrls: ['./retirement-income-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class RetirementIncomeFormComponent implements OnInit {
  retirementIncomeForm: FormGroup;
  categorySub: any;
  formValues: any;
  payoutFeature = 'Guaranteed';
  payoutDuration = 'Lifetime';
  retirementIncomeList = Array(16).fill(500).map((x, i) => x += i * 100);
  selectedRetirementIncome = 500;
  payoutAgeList = Array(16).fill(55).map((x, i) => x += i * 1);
  selectedPayoutAge = 55;
  payoutDurationList = [ 'Lifetime', 'Limited Years' ];
  payoutFeatureList = [ 'Guaranteed', 'Variable', 'Increasing'];

  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig) {
      const today: Date = new Date();
      config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
      config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
      config.outsideDays = 'collapsed';
    }

    ngOnInit() {
      this.formValues = this.directService.getDirectFormData();
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
          this.save();
          this.directService.triggerSearch('');
        }
      });
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
      'Payout Feature',
      // tslint:disable-next-line:max-line-length
      'In the event that you are diagnosed with Critical Illness, your remaining premiums will be waived without affecting the payout benefit to you.'
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
    this.retirementIncomeForm.value.retirementIncome = this.selectedRetirementIncome;
    this.retirementIncomeForm.value.payoutAge = this.selectedPayoutAge;
    this.retirementIncomeForm.value.payoutDuration = this.payoutDuration;
    this.retirementIncomeForm.value.payoutFeature = this.payoutFeature;
    this.directService.setRetirementIncomeForm(this.retirementIncomeForm);
    this.directService.setMinProdInfo(this.summarizeDetails());
  }
}
