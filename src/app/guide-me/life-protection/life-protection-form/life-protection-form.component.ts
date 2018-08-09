import { Component, EventEmitter, Input, Output, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { GuideMeService } from './../../guide-me.service';
import {
  LifeProtectionModalComponent
} from './../../life-protection/life-protection-form/life-protection-modal/life-protection-modal.component';

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
  genderOptions = ['Male', 'Female'];
  relationshipOptions = ['Dad', 'Mother', 'Spouse', 'Child'];
  ageOptions = ['18', '19', '20', '21', '22', '23', '24', '25', '26'];
  yearsNeededOptions = ['20', '30', '40', '50'];

  constructor(
    private router: Router,
    private guideMeService: GuideMeService,
    public modal: NgbModal,
    public translate: TranslateService,
    private formBuilder: FormBuilder) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.supportAmountTitle = this.translate.instant('LIFE_PROTECTION.SUPPORT_AMOUNT_TITLE');
      this.supportAmountMessage = this.translate.instant('LIFE_PROTECTION.SUPPORT_AMOUNT_MESSAGE');
    });
  }

  ngOnInit() {
    this.lifeProtectionForm = this.formBuilder.group({
      dependents: this.formBuilder.array([this.createDependentForm()])
    });
    this.activeFormIndex = 0;
    //this.dependentFormCount = this.dependentCount;
    this.refreshDependentForm();
  }

  ngOnChanges() {
    this.refreshDependentForm();
  }

  showLifeProtectionModal() {
    const ref = this.modal.open(LifeProtectionModalComponent, {
      centered: true,
      windowClass: 'help-modal-dialog'
    });
  }

  setDropDownDependentCount(value, i) {
    this.dependentCount = value;
    this.dependentCountChange.emit(value);
    this.refreshDependentForm();
  }

  refreshDependentForm() {
    if (this.lifeProtectionForm) {
      // no of existing form less than selected dependent count
      if (this.dependentFormCount <= this.dependentCount) {
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
      yearsNeeded: this.yearsNeededOptions[0],
      otherIncome: '',
      educationSupport: false
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

  showLifeProtectionSupportAmountModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.supportAmountTitle;
    ref.componentInstance.errorMessage = this.supportAmountMessage;
    return false;
  }

  updateNavLinks() {
    this.isNavPrevEnabled = (this.activeFormIndex) ? true : false;
    this.isNavNextEnabled = ((this.dependentCount > 1) && (this.activeFormIndex < this.dependentCount - 1)) ? true : false;
  }

  save() {
    console.log(this.lifeProtectionForm.value.dependents);
    return true;
  }

  submitDependentForm() {
    if (this.save()) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.protectionNeedsPageIndex++;
      });
    }
  }

  getPageIndicatorCount() {
    const count = this.lifeProtectionForm.controls.dependents['controls'].length;
    return Array(count).map((x, i) => i);
  }


  isChild(age){
    return age <= 23;
  }
}
