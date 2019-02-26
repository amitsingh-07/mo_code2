import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
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
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  categorySub: any;
  modalRef: NgbModalRef;
  hospitalForm: FormGroup;
  formValues: any;
  selectedHospitalPlan: HospitalPlan;
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
    });
  }

  ngOnInit() {
    this.formValues = this.directService.getHospitalPlanForm();
    this.formValues.fullOrPartialRider = this.formValues.fullOrPartialRider;
    if (this.formValues.fullOrPartialRider !== undefined) {
      this.formValues.fullOrPartialRider = this.formValues.fullOrPartialRider ? 'true' : 'false';
    }
    this.selectedHospitalPlan = this.formValues.selectedPlan;
    if (!this.selectedHospitalPlan) {
      this.selectedHospitalPlan = { hospitalClass: '' } as HospitalPlan;
    }
    const selectedPlanName = this.selectedHospitalPlan.hospitalClass;
    this.hospitalForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      selectedPlan: [selectedPlanName, Validators.required],
      fullOrPartialRider: [this.formValues.fullOrPartialRider, Validators.required]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '4') {
        if (this.save()) {
          this.formSubmitted.emit(this.summarizeDetails());
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectHospitalPlan(plan, index) {
    index += 1;
    this.selectedHospitalPlan = { hospitalClass: plan, hospitalClassId: index } as HospitalPlan;
    this.hospitalForm.controls.selectedPlan.setValue(this.selectedHospitalPlan.hospitalClass);
  }
  summarizeDetails() {
    let sum_string = '';
    sum_string += this.hospitalForm.value.selectedPlan.hospitalClass;
    if (this.hospitalForm.value.fullOrPartialRider === 'true' || this.hospitalForm.value.fullOrPartialRider === true) {
      sum_string += ', Rider';
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
    this.hospitalForm.controls.selectedPlan.setValue(this.selectedHospitalPlan);
    form.value.fullOrPartialRider = (form.value.fullOrPartialRider === 'true' || form.value.fullOrPartialRider === true) ? true : false;
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
