import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { HospitalPlan } from './../../../guide-me/hospital-plan/hospital-plan';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-hospital-plan-form',
  templateUrl: './hospital-plan-form.component.html',
  styleUrls: ['./hospital-plan-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class HospitalPlanFormComponent implements OnInit, OnDestroy {
  categorySub: any;
  modalRef: NgbModalRef;
  hospitalForm: FormGroup;
  formValues: any;
  selectedPlan: HospitalPlan;
  planType;
  doberror = false;
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
      this.planType = this.translate.instant('DIRECT_HOSPITAL_PLAN.HOSPITAL_PLANS');
      this.selectedPlan = { hospitalClass: '' } as HospitalPlan;
    });
  }

  ngOnInit() {
    this.formValues = this.directService.getHospitalPlanForm();
    this.formValues.fullOrPartialRider = this.formValues.fullOrPartialRider;
    this.selectedPlan = this.formValues.selectedPlan;
    this.hospitalForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      selectedPlan: [this.formValues.selectedPlan, Validators.required],
      fullOrPartialRider: [this.formValues.fullOrPartialRider, Validators.required]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '4') {
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

  selectHospitalPlan(plan, index) {
    index += 1;
    this.selectedPlan = { hospitalClass: plan, hospitalClassId: index } as HospitalPlan;
    this.hospitalForm.controls.selectedPlan.setValue(this.selectedPlan.hospitalClass);
  }
  summarizeDetails() {
    let sum_string = '';
    sum_string += this.hospitalForm.value.selectedPlan.hospitalClass;
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
      if (!form.controls['dob'].valid && form.controls['gender'].valid) {
        this.doberror = true;
      }
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    this.hospitalForm.controls.selectedPlan.setValue(this.selectedPlan);
    this.directService.setHospitalPlanForm(form.value);
    return true;
  }

  showFullOrPartialRider() {
    this.directService.showToolTipModal(
      this.translate.instant('DIRECT_HOSPITAL_PLAN.FULL_OR_PARTIAL_RIDER.TOOLTIP.FULL_OR_PARTIAL_RIDER.TITLE'),
      this.translate.instant('DIRECT_HOSPITAL_PLAN.FULL_OR_PARTIAL_RIDER.TOOLTIP.FULL_OR_PARTIAL_RIDER.MESSAGE')
    );
  }
}
