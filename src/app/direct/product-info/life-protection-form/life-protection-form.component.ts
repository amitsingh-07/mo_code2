import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';

import { DirectService } from './../../direct.service';
import { DirectLifeProtectionFormData } from './life-protect-form-data';

@Component({
  selector: 'app-life-protection-form',
  templateUrl: './life-protection-form.component.html',
  styleUrls: ['./life-protection-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class LifeProtectionFormComponent implements OnInit, OnDestroy {
  dobValue;
  categorySub: any;
  modalRef: NgbModalRef;
  lifeProtectionForm: FormGroup;
  formValues: any;
  coverage_amt = '$50,000';
  duration = 'Till Age 65';

  coverageAmtValues = ['$500,000', '$1,000,000'];
  durationValues = ['Till Age 55', 'Till Age 60', 'Till Age 65'];

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
    // this.directService.setProdCategoryIndex(0);
    /* Building the form */
    this.formValues = this.directService.getDirectFormData();
    this.formValues.gender = this.formValues.gender ? this.formValues.gender : 'male';
    this.formValues.smoker = this.formValues.smoker ? this.formValues.smoker : 'nonsmoker';
    this.formValues.premiumWaiver = this.formValues.premiumWaiver ? this.formValues.premiumWaiver : 'yes';
    if (this.formValues.duration !== undefined ) {
      this.selectDuration(this.formValues.dependent);
    }
    if (this.formValues.coverageAmt !== undefined ) {
      this.selectCoverageAmt(this.formValues.coverageAmt);
    }
    this.lifeProtectionForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      smoker: [this.formValues.smoker, Validators.required],
      coverageAmt: [this.formValues.coverageAmt],
      duration: [this.formValues.duration],
      premiumWaiver: [this.formValues.premiumWaiver]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '') {
        this.save();
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

  showPremiumWaiverModal() {
    this.directService.showToolTipModal(
      'Premium Waiver Rider',
      // tslint:disable-next-line:max-line-length
      'In the event that you are diagnosed with Critical Illness, your remaining premiums will be waived without affecting the payout benefit to you.'
      );
  }

  save() {
    this.lifeProtectionForm.value.coverageAmt = this.coverage_amt;
    this.lifeProtectionForm.value.duration = this.duration;
    this.directService.setLifeProtectionForm(this.lifeProtectionForm);
  }
}
