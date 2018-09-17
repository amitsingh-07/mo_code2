import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';

import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-hospital-plan-form',
  templateUrl: './hospital-plan-form.component.html',
  styleUrls: ['./hospital-plan-form.component.scss']
})
export class HospitalPlanFormComponent implements OnInit {
  dobValue;
  categorySub: any;
  modalRef: NgbModalRef;
  hospitalForm: FormGroup;
  formValues: any;
  selectedPlan = 'Private';
  planType = [ 'Private', 'Govt Ward A', 'Govt Ward B1', 'Govt Ward B2/C', 'Global Healthcare' ];
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
    this.formValues.fullOrPartialRider = this.formValues.fullOrPartialRider ? this.formValues.fullOrPartialRider : 'yes';
    this.hospitalForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      fullOrPartialRider: [this.formValues.fullOrPartialRider, Validators.required],
      selectedPlan: [this.formValues.selectedPlan]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '') {
        this.save();
        this.directService.triggerSearch('');
      }
    });
  }
  selectHospitalPlan(plan) {
    this.selectedPlan = plan;
    this.hospitalForm.controls.selectedPlan.setValue(this.selectedPlan);
  }
  summarizeDetails() {
    let sum_string = '';
    sum_string += this.hospitalForm.value.gender + ', ';
    sum_string += this.hospitalForm.value.selectedPlan;
    if (this.hospitalForm.value.fullOrPartialRider === 'yes') {
      sum_string += ', Full / Partial Rider';
    }
    return sum_string;
  }
  save() {
    this.directService.setLifeProtectionForm(this.hospitalForm);
    this.directService.setMinProdInfo(this.summarizeDetails());
  }
}
