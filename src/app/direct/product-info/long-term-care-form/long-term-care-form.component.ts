import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from '../../direct.service';

@Component({
  selector: 'app-long-term-care-form',
  templateUrl: './long-term-care-form.component.html',
  styleUrls: ['./long-term-care-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class LongTermCareFormComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  categorySub: any;
  formValues: any;
  longTermCareForm: FormGroup;
  monthlyPayoutList = Array(21).fill(500).map((x, i) => x += i * 100);
  selectedMonthlyPayout = '';
  doberror = false;
  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private config: NgbDatepickerConfig) {
    this.translate.use('en');
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
  }

  ngOnInit() {
    this.formValues = this.directService.getLongTermCareForm();
    this.formValues.gender = this.formValues.gender;
    if (this.formValues.monthlyPayout) {
      this.selectedMonthlyPayout = this.formValues.monthlyPayout;
    }
    this.longTermCareForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      monthlyPayout: [this.formValues.monthlyPayout, Validators.required]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '5') {
        if (this.save()) {
          this.formSubmitted.emit(this.summarizeDetails());
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
      }
    });
    this.directService.userInfoSet.subscribe((data) => {
      this.longTermCareForm.controls.gender.setValue(data['gender']);
      this.longTermCareForm.controls.dob.setValue(data['dob']);
    });
  }

  onGenderDobChange() {
    const userInfo = this.directService.getUserInfo();
    userInfo.dob = this.longTermCareForm.controls.dob.value;
    userInfo.gender = this.longTermCareForm.controls.gender.value;
    this.directService.updateUserInfo(userInfo);
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectMonthlyPayout(selectedMonthlyPayout) {
    this.selectedMonthlyPayout = selectedMonthlyPayout;
    this.longTermCareForm.controls.monthlyPayout.setValue(this.selectedMonthlyPayout);
  }

  summarizeDetails() {
    let sum_string = '';
    sum_string += '$' + this.selectedMonthlyPayout + ' / mth';
    return sum_string;
  }

  save() {
    const form = this.longTermCareForm;
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
    form.value.monthlyPayout = this.selectedMonthlyPayout;
    this.directService.setLongTermCareForm(form.value);
    return true;
  }

}
