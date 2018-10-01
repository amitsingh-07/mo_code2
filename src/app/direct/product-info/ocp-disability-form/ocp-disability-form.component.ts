import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';

import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from '../../direct.service';

@Component({
  selector: 'app-ocp-disability-form',
  templateUrl: './ocp-disability-form.component.html',
  styleUrls: ['./ocp-disability-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class OcpDisabilityFormComponent implements OnInit, AfterViewInit, OnDestroy {
  defaultEmployee;
  categorySub: any;
  @ViewChild('ocpDisabilityFormSlider') ocpDisabilityFormSlider: NouisliderComponent;
  ocpDisabilityForm: FormGroup;
  formValues: any;
  employmentTypeList;
  duration;
  durationValues;
  coverageMax = 75;
  coveragePercent = 75;

  ciSliderConfig: any = {
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
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private translate: TranslateService,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.employmentTypeList = this.translate.instant('OCCUPATIONAL_DISABILITY.EMPLOYMENT_TYPE_LIST');
      this.defaultEmployee = this.employmentTypeList[0];
      this.durationValues = this.translate.instant('OCCUPATIONAL_DISABILITY.DURATION_VALUES');
      this.duration = this.durationValues[0];
    });
  }

  ngOnInit() {
    this.formValues = this.directService.getOcpDisabilityForm();
    if (this.formValues.employmentType !== undefined) {
      this.selectEmployeeType(this.formValues.employmentType, true);
    }
    if (this.formValues.duration !== undefined) {
      this.selectDuration(this.formValues.duration);
    }
    this.ocpDisabilityForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      smoker: [this.formValues.smoker, Validators.required],
      employmentType: [this.formValues.employmentType],
      monthlySalary: [this.formValues.monthlySalary],
      percentageCoverage: [this.formValues.percentageCoverage],
      duration: [this.formValues.duration]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '2') {
        if (this.save()) {
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
        this.directService.triggerSearch('');
      }
    });
  }

  ngAfterViewInit() {
    this.ocpDisabilityFormSlider.writeValue(this.coveragePercent);
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectDuration(selectedDuration) {
    this.duration = selectedDuration;
  }

  onSliderChange(value) {
    this.coveragePercent = value;
  }

  selectEmployeeType(status, setSlider) {
    this.defaultEmployee = status;
    this.coverageMax = this.defaultEmployee === 'Salaried' ? 75 : 65;
    if (setSlider) {
      this.setSliderValues(this.coverageMax);
    }
  }

  setSliderValues(value) {
    this.onSliderChange(value);
    this.ocpDisabilityFormSlider.writeValue(value);
    this.ocpDisabilityFormSlider.slider.updateOptions({ range: { min: 0, max: value } });
  }

  summarizeDetails() {
    let sum_string = '';
    let monthlySalaryValue = this.ocpDisabilityForm.controls['monthlySalary'].value;
    if (!monthlySalaryValue) {
      monthlySalaryValue = 0;
    }
    sum_string += '$' + monthlySalaryValue +  ' / mth, ';
    sum_string += this.duration;
    return sum_string;
  }

  save() {
    const form = this.ocpDisabilityForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.employmentType = this.selectEmployeeType;
    form.value.duration = this.duration;
    form.value.percentageCoverage = this.coveragePercent;
    this.directService.setOcpDisabilityForm(form.value);
    return true;
  }

}
