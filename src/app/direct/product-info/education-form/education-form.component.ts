import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';

import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements OnInit {
  dobValue;
  categorySub: any;
  modalRef: NgbModalRef;
  educationForm: FormGroup;
  formValues: any;
  contribution = '$100';
  EntryAge = this.formValues && this.formValues.gender === 'male' ? '20' : '18';
  monthlyContribution = ['$100', '$150', '$200', '$250', '$300', '$350', '$400', '$450', '$500'];
  univercityEntryAge = ['18', '19', '20', '21'];
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
    //this.formValues.gender = this.formValues.gender ? this.formValues.gender : 'male';
    this.formValues.smoker = this.formValues.smoker ? this.formValues.smoker : 'nonsmoker';
    this.formValues.premiumWaiver = this.formValues.premiumWaiver ? this.formValues.premiumWaiver : 'yes';
    if (this.formValues.duration !== undefined ) {
      //this.selectDuration(this.formValues.dependent);
    }
    if (this.formValues.monthlyContribution !== undefined ) {
      this.selectCoverageAmt(this.formValues.monthlyContribution);
    }
    if (this.formValues.univercityEntryAge !== undefined ) {
      this.selectEntryAge(this.formValues.univercityEntryAge);
    }
    this.educationForm = this.formBuilder.group({
      selfgender: [this.formValues.selfgender, Validators.required],
      childgender: [this.formValues.childgender, Validators.required],
      selfdob: [this.formValues.selfdob, Validators.required],
      childdob: [this.formValues.childdob, Validators.required],
      smoker: [this.formValues.smoker, Validators.required],
      monthlyContribution: [this.formValues.monthlyContribution],
      univercityEntryAge: [this.formValues.univercityEntryAge],
      premiumWaiver: [this.formValues.premiumWaiver]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '') {
        //this.save();
        this.directService.triggerSearch('');
      }
      this.EntryAge = this.formValues && this.formValues.gender === 'male' ? '20' : '18';
    });
  }
  selectCoverageAmt(contribution) {
    this.contribution = contribution;
  }
  selectEntryAge(EntryAge) {
    this.EntryAge = EntryAge;
  }

}
