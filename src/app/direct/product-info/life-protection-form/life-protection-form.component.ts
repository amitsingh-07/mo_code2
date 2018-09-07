import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
export class LifeProtectionFormComponent implements OnInit {
  dobValue;
  lifeProtectionForm: FormGroup;
  formValues: any;
  coverage_amt = '$50,000';
  duration = 'Till Age 65';

  coverageAmtValues = ['$500,000', '$1,000,000'];
  durationValues = ['Till Age 55', 'Till Age 60', 'Till Age 65'];

  constructor(
    private directService: DirectService,
    private parserFormatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig) {
      const today: Date = new Date();
      config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
      config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
      config.outsideDays = 'collapsed';
    }

  ngOnInit() {
    this.buildLifeProtectionForm();
    this.directService.setProdCategoryIndex(0);
  }

  selectCoverageAmt(in_coverage_amt) {
    this.coverage_amt = in_coverage_amt;
  }

  selectDuration(in_duration) {
    this.duration = in_duration;
  }

  /* Form Handling */
  buildLifeProtectionForm() {
    this.lifeProtectionForm = this.formBuilder.group({
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      smoker: [''],
      coverageAmt: [''],
      duration: [''],
      premiumWaiver: ['']
    });
    console.log('Form Built');
  }
  submitLifeProtectionForm() {
  }
}
