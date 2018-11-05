import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { GuideMeService } from '../../guide-me.service';
import { IDependent } from './dependent.interface';
import { LifeProtectionModalComponent } from './life-protection-modal/life-protection-modal.component';

const Regexp = new RegExp('[,]', 'g');
const MAX_YEARS_NEEDED = 100;
const MAX_AGE = 100;

@Component({
  selector: 'app-life-protection-form',
  templateUrl: './life-protection-form.component.html',
  styleUrls: ['./life-protection-form.component.scss'],
  providers: [],
  encapsulation: ViewEncapsulation.None
})

export class LifeProtectionFormComponent implements OnInit, OnChanges {
  supportAmountTitle: string;
  supportAmountMessage: string;
  @Input('dependentCount') dependentCount;
  dependentFormCount = 1;
  @Output() dependentCountChange = new EventEmitter<boolean>();
  pageTitle: string;
  lifeProtectionForm: FormGroup;
  dependents: FormArray;
  isFormControlDisabled = true;
  activeFormIndex;
  isNavPrevEnabled;
  isNavNextEnabled;
  dependentCountOptions = [0, 1, 2, 3, 4, 5];
  genderOptions = [];
  relationshipOptions = [];
  ageOptions = [];
  yearsNeededOptions = [];
  eduSupportCourse = [];
  eduSupportCountry = [];
  eduSupportNationality = [];

  lifeProtectionFormValues = { dependents: [] as IDependent[] };

  dependentSliderConfig: any = {
    behaviour: 'snap',
    start: 0,
    connect: [true, false],
    format: {
      to: (value) => {
        return Math.round(value);
      },
      from: (value) => {
        return Math.round(value);
      }
    }
  };

  constructor(
    private router: Router,
    private guideMeService: GuideMeService,
    public modal: NgbModal,
    public translate: TranslateService,
    private formBuilder: FormBuilder, private currencyPipe: CurrencyPipe) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.supportAmountTitle = this.translate.instant('LIFE_PROTECTION.SUPPORT_AMOUNT_TITLE');
      this.supportAmountMessage = this.translate.instant('LIFE_PROTECTION.SUPPORT_AMOUNT_MESSAGE');
      this.genderOptions = this.translate.instant('LIFE_PROTECTION.DROP_DOWN_OPTIONS.GENDER');
      this.relationshipOptions = this.translate.instant('LIFE_PROTECTION.DROP_DOWN_OPTIONS.RELATIONSHIP');
      this.eduSupportCourse = this.translate.instant('LIFE_PROTECTION.DROP_DOWN_OPTIONS.EDU_SUPPORT_COURSE');
      this.eduSupportCountry = this.translate.instant('LIFE_PROTECTION.DROP_DOWN_OPTIONS.EDU_SUPPORT_COUNTRY');
      this.eduSupportNationality = this.translate.instant('LIFE_PROTECTION.DROP_DOWN_OPTIONS.EDU_SUPPORT_NATIONALITY');
      this.dependentCountOptions = this.translate.instant('LIFE_PROTECTION.DEPENDENT_COUNT_OPTIONS');
    });

    this.yearsNeededOptions = Array(MAX_YEARS_NEEDED).fill(0).map((e, i) => i);
    this.ageOptions = Array(MAX_AGE).fill(0).map((e, i) => i);
    this.lifeProtectionFormValues = this.guideMeService.getLifeProtection();
  }

  ngOnInit() {
    this.dependentCount = this.guideMeService.getUserInfo().dependent ? this.guideMeService.getUserInfo().dependent : 0;
    this.lifeProtectionForm = this.formBuilder.group({
      dependents: this.formBuilder.array([this.createDependentForm()])
    });
    this.activeFormIndex = 0;
    this.refreshDependentForm();
  }

  ngOnChanges() {
    this.refreshDependentForm();
  }

  showLifeProtectionModal() {
    const ref = this.modal.open(LifeProtectionModalComponent, {
      centered: true
    });
  }

  setDropDownDependentCount(value, i) {
    this.dependentCount = value;
    this.dependentCountChange.emit(value);
    this.refreshDependentForm();
    this.guideMeService.updateDependentCount(value);
  }

  // tslint:disable-next-line:cognitive-complexity
  refreshDependentForm() {
    if (this.lifeProtectionForm) {
      // no of existing form less than selected dependent count
      if (this.dependentCount === 0) {
        this.lifeProtectionForm = this.formBuilder.group({
          dependents: this.formBuilder.array([this.createDependentForm()])
        });
        this.activeFormIndex = 0;
        this.dependentFormCount = 1;
        this.isFormControlDisabled = true;
      } else if (this.dependentFormCount <= this.dependentCount) {
        while (this.dependentFormCount < this.dependentCount) {
          this.dependentFormCount++;
          this.lifeProtectionForm.controls.dependents['controls'].push(this.createDependentForm());
        }
      } else { // no of existing form higher than selected dependent count
        while ((this.dependentFormCount > this.dependentCount) && (this.dependentFormCount > 1)) {
          this.lifeProtectionForm.controls.dependents['controls'].pop();
          this.dependentFormCount--;
        }
        // set focus to last dependent
        this.activeFormIndex = this.dependentCount ? this.dependentCount - 1 : this.dependentCount;
      }
      this.isFormControlDisabled = (!this.dependentCount) ? true : null;
    }
    this.updateNavLinks();
  }

  // tslint:disable-next-line:cognitive-complexity
  createDependentForm(): FormGroup {
    let formGroup;
    if (this.dependentCount <= 0) {
      formGroup = this.formBuilder.group({
        gender: this.genderOptions[0],
        relationship: this.relationshipOptions[0],
        age: 24,
        supportAmount: 0,
        supportAmountValue: 0,
        yearsNeeded: this.yearsNeededOptions[0],
        educationSupport: false,
        supportAmountRange: 0,
        eduSupportCourse: this.eduSupportCourse[0],
        eduSupportCountry: this.eduSupportCountry[0],
        eduSupportNationality: this.eduSupportNationality[0],
        eduFormSaved: false
      });
    } else {
      const thisDependent = this.lifeProtectionFormValues.dependents[this.dependentFormCount - 1];
      formGroup = this.formBuilder.group({
        gender: thisDependent && thisDependent.gender ? thisDependent.gender : this.genderOptions[0],
        relationship: thisDependent && thisDependent.relationship ? thisDependent.relationship : this.relationshipOptions[0],
        age: thisDependent && thisDependent.age ? thisDependent.age : 24,
        supportAmount: thisDependent && thisDependent.supportAmount ? thisDependent.supportAmount : 0,
        supportAmountValue: thisDependent && thisDependent.supportAmountValue ? thisDependent.supportAmountValue : 0,
        yearsNeeded: thisDependent && thisDependent.yearsNeeded ? thisDependent.yearsNeeded : this.yearsNeededOptions[0],
        educationSupport: thisDependent && thisDependent.educationSupport ? thisDependent.educationSupport : false,
        supportAmountRange: thisDependent && thisDependent.supportAmountRange ? thisDependent.supportAmountRange : 0,
        eduSupportCourse: thisDependent && thisDependent.eduSupportCourse ? thisDependent.eduSupportCourse : this.eduSupportCourse[0],
        eduSupportCountry: thisDependent && thisDependent.eduSupportCountry ? thisDependent.eduSupportCountry : this.eduSupportCountry[0],
        eduSupportNationality: thisDependent && thisDependent.eduSupportNationality
          ? thisDependent.eduSupportNationality : this.eduSupportNationality[0],
        eduFormSaved: thisDependent && thisDependent.eduFormSaved ? thisDependent.eduFormSaved : false
      });
    }
    return formGroup;
  }

  addDependent(): void {
    this.dependents = this.lifeProtectionForm.get('dependents') as FormArray;
    this.dependents.push(this.createDependentForm());
  }

  setDropDownValue(key, value, i) {
    this.lifeProtectionForm.controls.dependents['controls'][i].controls[key].setValue(value);
  }

  navigateDependentForm(dir) {
    (dir === 'next') ? this.activeFormIndex++ : this.activeFormIndex--;
    this.updateNavLinks();
  }

  showSupportAmountModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.supportAmountTitle;
    ref.componentInstance.errorMessage = this.supportAmountMessage;
    return false;
  }

  updateNavLinks() {
    this.isNavPrevEnabled = (this.activeFormIndex) ? true : false;
    this.isNavNextEnabled = ((this.dependentCount > 1) && (this.activeFormIndex < this.dependentCount - 1)) ? true : false;
  }

  save(form: any) {
    const formValues = [];
    form.controls.dependents.controls.forEach((formData) => {
      if (!formData.value['supportAmount'] || isNaN(formData.value['supportAmount'])) {
        formData.value['supportAmount'] = 0;
      }
      if (formData.value['educationSupport'] === false) {
        formData.value['eduSupportCountry'] = null;
        formData.value['eduSupportCourse'] = null;
        formData.value['eduSupportNationality'] = null;
      }
      formValues.push(formData.value);
    });
    this.guideMeService.setLifeProtection({ dependents: formValues });
    return true;
  }

  submitDependentForm(form) {
    if (this.save(form)) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.incrementProtectionNeedsIndex();
      });
    }
  }

  getPageIndicatorCount() {
    const count = this.lifeProtectionForm.controls.dependents['controls'].length;
    return Array(count).map((x, i) => i);
  }

  isChild(age) {
    return age <= 23;
  }
}
