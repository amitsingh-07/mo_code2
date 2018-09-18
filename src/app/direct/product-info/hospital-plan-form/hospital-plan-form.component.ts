import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';

import { TranslateService } from '@ngx-translate/core';
import { DirectService } from './../../direct.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';

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
  selectedPlan;
  planType;
  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder, private translate: TranslateService, private config: NgbDatepickerConfig) {
      const today: Date = new Date();
      config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
      config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
      config.outsideDays = 'collapsed';
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
      this.planType = this.translate.instant('HOSPITAL_PLAN.HOSPITAL_PLANS');
      this.selectedPlan = this.planType[0];
    });
     }

  ngOnInit() {
    this.directService.setProdCategoryIndex(3);
    this.formValues = this.directService.getHospitalPlanForm();
    this.formValues.fullOrPartialRider = this.formValues.fullOrPartialRider ? this.formValues.fullOrPartialRider : 'yes';
    this.hospitalForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      fullOrPartialRider: [this.formValues.fullOrPartialRider, Validators.required],
      selectedPlan: [this.formValues.selectedPlan]
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
  selectHospitalPlan(plan) {
    this.selectedPlan = plan;
    this.hospitalForm.controls.selectedPlan.setValue(this.selectedPlan);
  }
  summarizeDetails() {
    let sum_string = '';
    sum_string += this.hospitalForm.value.selectedPlan;
    if (this.hospitalForm.value.fullOrPartialRider === 'yes') {
      sum_string += ', Full / Partial Rider';
    }
    return sum_string;
  }
  save() {
    const form = this.hospitalForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.selectedPlan = this.selectedPlan;
    this.directService.setHospitalPlanForm(form.value);
    return true;
  }

  showFullOrPartialRider() {
    this.directService.showToolTipModal(
      this.translate.instant('LIFE_PROTECTION.PREMIUM_WAIVER.TOOLTIP.TITLE'),
      this.translate.instant('LIFE_PROTECTION.PREMIUM_WAIVER.TOOLTIP.MESSAGE')
      );
  }
}
