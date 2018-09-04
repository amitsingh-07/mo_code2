import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { GuideMeService } from '../../guide-me.service';
import {
  LifeProtectionModalComponent
} from './life-protection-modal/life-protection-modal.component';

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
  genderOptions;
  relationshipOptions;
  ageOptions;
  yearsNeededOptions;
  eduSupportCourse;
  eduSupportCountry;
  eduSupportNationality;

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
    });

    this.yearsNeededOptions = Array(MAX_YEARS_NEEDED).fill(0).map((e, i) => i);
    this.ageOptions = Array(MAX_AGE).fill(0).map((e, i) => i);
  }

  ngOnInit() {
    this.lifeProtectionForm = this.formBuilder.group({
      dependents: this.formBuilder.array([this.createDependentForm()])
    });
    this.activeFormIndex = 0;
    this.refreshDependentForm();
  }

  ngOnChanges() {
    this.refreshDependentForm();
  }

  onNoUiSliderChange(sliderValue, index) {
    let value = sliderValue;
    if (value !== null) {
      value = value.toString().replace(Regexp, '');
    }
    let amount = this.currencyPipe.transform(value, 'USD');
    if (amount !== null) {
      amount = amount.split('.')[0].replace('$', '');
      this.lifeProtectionForm.controls.dependents['controls'][index].controls['supportAmount'].setValue(amount);
      this.lifeProtectionForm.controls.dependents['controls'][index].controls['supportAmountValue'].setValue(parseInt(amount, 10));
    }
  }

  updateSlider(slider, index) {
    let sliderValue = this.lifeProtectionForm.controls.dependents['controls'][index].controls['supportAmount'].value;
    if (sliderValue === null) {
      sliderValue = 0;
    }
    sliderValue = (sliderValue + '').replace(Regexp, '');
    slider.writeValue(sliderValue);

    this.lifeProtectionForm.controls.dependents['controls'][index].controls['supportAmountValue'].setValue(parseInt(sliderValue, 10));
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
          this.lifeProtectionForm.controls.dependents['controls'].push(this.createDependentForm());
          this.dependentFormCount++;
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

  createDependentForm(): FormGroup {
    return this.formBuilder.group({
      gender: this.genderOptions[0],
      relationship: this.relationshipOptions[0],
      age: 24,
      supportAmount: '',
      supportAmountValue: 0,
      yearsNeeded: this.yearsNeededOptions[0],
      educationSupport: false,
      supportAmountRange: 0,
      eduSupportCourse: this.eduSupportCourse[0],
      eduSupportCountry: this.eduSupportCountry[0],
      eduSupportNationality: this.eduSupportNationality[0],
      eduFormSaved: false
    });
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
    this.guideMeService.setLifeProtection(form.value);
    return true;
  }

  submitDependentForm(form) {
    if (this.save(form)) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.protectionNeedsPageIndex++;
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

