import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { DirectService } from '../../direct.service';

@Component({
  selector: 'app-long-term-care-form',
  templateUrl: './long-term-care-form.component.html',
  styleUrls: ['./long-term-care-form.component.scss']
})
export class LongTermCareFormComponent implements OnInit , OnDestroy {
  categorySub: any;
  formValues: any;
  longTermCareForm: FormGroup;
  monthlyPayoutList = Array(26).fill(500).map((x, i) => x += i * 100);
  selectedMonthlyPayout = 500;

  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private config: NgbDatepickerConfig ) {
    this.translate.use('en');
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
     }

  ngOnInit() {
    this.directService.setProdCategoryIndex(4);
    this.formValues = this.directService.getLongTermCareForm();
    this.formValues.gender = this.formValues.gender ? this.formValues.gender : 'male';
    this.longTermCareForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      monthlyPayout: [this.formValues.monthlyPayout]
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

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectMonthlyPayout(selectedMonthlyPayout) {
    this.selectedMonthlyPayout = selectedMonthlyPayout;
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