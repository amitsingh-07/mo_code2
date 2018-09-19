import { DIRECT_ROUTE_PATHS } from './../../direct-routes.constants';
import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from './../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-critical-illness-form',
  templateUrl: './critical-illness-form.component.html',
  styleUrls: ['./critical-illness-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})

export class CriticalIllnessFormComponent implements OnInit, OnDestroy {
  categorySub: any;
  modalRef: NgbModalRef;
  criticalIllnessForm: FormGroup;
  formValues: any;
  coverage_amt = '100,000';
  duration = 'Till Age 65';

  coverageAmtValuesTemp = Array(10).fill(100000).map((x, i) => x += i * 100000);
  coverageAmtValues = Array(10);
  durationValues = ['5 Years', '10 Years', 'Till Age 55', 'Till Age 60', 'Till Age 65', 'Till Age 70', 'Till Age 99',
    'Whole Life', 'Whole Life w/Multiplier'];

  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter, private translate: TranslateService,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig, private currencyPipe: CurrencyPipe,
    private router: Router) {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
    this.translate.use('en');
  }

  ngOnInit() {
    this.directService.setProdCategoryIndex(1);
    /* Building the form */
    this.coverageAmtValuesTemp.forEach((element, index) => {
      this.coverageAmtValues[index] = this.directService.convertToCurrency(element);
    });
    this.formValues = this.directService.getDirectFormData();
    this.formValues.gender = this.formValues.gender ? this.formValues.gender : 'male';
    this.formValues.smoker = this.formValues.smoker ? this.formValues.smoker : 'non-smoker';
    this.formValues.earlyCI = this.formValues.earlyCI ? this.formValues.earlyCI : 'yes';
    if (this.formValues.duration !== undefined) {
      this.selectDuration(this.formValues.dependent);
    }
    if (this.formValues.coverageAmt !== undefined) {
      this.selectCoverageAmt(this.formValues.coverageAmt);
    }
    this.criticalIllnessForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      smoker: [this.formValues.smoker, Validators.required],
      coverageAmt: [this.formValues.coverageAmt],
      duration: [this.formValues.duration],
      earlyCI: [this.formValues.earlyCI]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '') {
        if (this.save()) {
          this.directService.setMinProdInfo(this.summarizeDetails());
          this.router.navigate([DIRECT_ROUTE_PATHS.RESULTS]);
        }
        this.directService.triggerSearch('');
      }
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectCoverageAmt(in_coverage_amt) {
    this.coverage_amt = in_coverage_amt;
  }

  selectDuration(in_duration) {
    this.duration = in_duration;
  }

  summarizeDetails() {
    let sum_string = '';
    sum_string += this.translate.instant('CRITICAL_ILLNESS.COVERAGE_AMT.DOLLAR') + this.coverage_amt + ', ';
    sum_string += this.duration;
    if (this.criticalIllnessForm.value.earlyCI === 'yes') {
      sum_string += ', Early CI';
    }
    return sum_string;
  }

  save() {
    const form = this.criticalIllnessForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.coverageAmt = this.coverage_amt;
    form.value.duration = this.duration;
    this.directService.setCriticalIllnessForm(form);
    return true;
  }
}
