import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';

import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-life-protection-form',
  templateUrl: './life-protection-form.component.html',
  styleUrls: ['./life-protection-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class LifeProtectionFormComponent implements OnInit {
  dobValue;
  formValues: any;

  coverage_amt = '$50,000';
  duration = 'Till Age 65';

  coverageAmtValues = ['$500,000', '$1,000,000'];
  durationValues = ['Till Age 55', 'Till Age 60', 'Till Age 65'];

  constructor(
    private directService: DirectService,
    private parserFormatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder) {
    }

  ngOnInit() {
    this.directService.setProdCategoryIndex(0);
  }

  selectCoverageAmt(in_coverage_amt) {
    this.coverage_amt = in_coverage_amt;
  }

  selectDuration(in_duration) {
    this.duration = in_duration;
  }

}
