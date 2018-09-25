import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';

import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements OnInit, OnDestroy {
  dobValue;
  categorySub: any;
  modalRef: NgbModalRef;
  educationForm: FormGroup;
  formValues: any;
  contribution = '100';
  isSelfFormEnabled = true;
  childdob: string;
  childgender: string;
  selectedunivercityEntryAge = this.formValues && this.formValues.gender === 'male' ? '20' : '18';
  monthlyContribution = Array(9).fill(100).map((x, i) => x += i * 50);
  univercityEntryAge = Array(4).fill(18).map((x, i) => x += i);
  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder, private translate: TranslateService, private config: NgbDatepickerConfig) {
      const today: Date = new Date();
      config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
      config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
      config.outsideDays = 'collapsed';
     }

  ngOnInit() {
    this.directService.setProdCategoryIndex(5);
    this.formValues = this.directService.getEducationForm();
    this.formValues.smoker = this.formValues.smoker ? this.formValues.smoker : 'nonsmoker';
    this.formValues.premiumWaiver = this.formValues.premiumWaiver ? this.formValues.premiumWaiver : 'yes';
    this.educationForm = this.formBuilder.group({
      selfgender: [this.formValues.selfgender],
      childgender: [this.formValues.childgender, Validators.required],
      selfdob: [this.formValues.selfdob],
      childdob: [this.formValues.childdob, Validators.required],
      smoker: [this.formValues.smoker],
      contribution: [this.formValues.contribution],
      selectedunivercityEntryAge: [this.formValues.selectedunivercityEntryAge],
      premiumWaiver: [this.formValues.premiumWaiver, Validators.required]
    });
    if (this.formValues.contribution !== undefined ) {
       this.selectMonthlyContribution(this.formValues.contribution);
    }
    if (this.formValues.selectedunivercityEntryAge !== undefined ) {
       this.selectEntryAge(this.formValues.selectedunivercityEntryAge);
    }
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '') {
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

  selectMonthlyContribution(contribution) {
    this.contribution = contribution;
    this.educationForm.controls.contribution.setValue(this.contribution);
  }
  selectEntryAge(EntryAge) {
    this.selectedunivercityEntryAge = EntryAge;
    this.educationForm.controls.selectedunivercityEntryAge.setValue(this.selectedunivercityEntryAge);
  }
  setdefaultUniversityAge() {
    this.selectedunivercityEntryAge = this.educationForm.controls['childgender'].value === 'male' ? '20' : '18';
    this.educationForm.controls.selectedunivercityEntryAge.setValue(this.selectedunivercityEntryAge);
  }

  setselfform() {
    this.isSelfFormEnabled = this.educationForm.controls['premiumWaiver'].value === 'yes' ? true : false;
  }
  summarizeDetails() {
    let sum_string = '';
    sum_string += 'Save $' + this.educationForm.value.contribution + '/ mth, ';
    if (this.educationForm.value.selectedunivercityEntryAge) {
      sum_string += 'Uni Entry Age of ' + this.educationForm.value.selectedunivercityEntryAge;
    }
    if (this.isSelfFormEnabled) {
      sum_string += ', Premium Waiver Rider';
    }
    return sum_string;
  }
  save() {
    const form = this.educationForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.contribution = this.contribution;
    form.value.selectedunivercityEntryAge = this.selectedunivercityEntryAge;
    this.directService.setEducationForm(form.value);
    return true;
  }
  showPremiumWaiverModal() {
    this.directService.showToolTipModal(
      this.translate.instant('LIFE_PROTECTION.PREMIUM_WAIVER.TOOLTIP.TITLE'),
      this.translate.instant('LIFE_PROTECTION.PREMIUM_WAIVER.TOOLTIP.MESSAGE')
      );
  }
}