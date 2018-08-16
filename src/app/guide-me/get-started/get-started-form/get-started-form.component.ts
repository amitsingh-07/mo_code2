import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GUIDE_ME_ROUTE_PATHS } from '../../guide-me-routes.constants';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { GuideMeService } from '../../guide-me.service';

@Component({
  selector: 'app-get-started-form',
  templateUrl: './get-started-form.component.html',
  styleUrls: ['./get-started-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedFormComponent implements OnInit {
  // @ViewChild('usrFrmDp') usrFrmDp: ElementRef;

  dobValue;
  userInfoForm: FormGroup;
  formValues: any;
  dependents = 0;
  dependentItems = Array(6).fill(0).map((x, i) => i);

  constructor(
    private router: Router,
    private modal: NgbModal,
    private guideMeService: GuideMeService,
    private parserFormatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder,
    private config: NgbDatepickerConfig) {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
  }

  ngOnInit() {
    this.formValues = this.guideMeService.getUserInfo();
    this.formValues.gender = this.formValues.gender ? this.formValues.gender : 'male';
    this.formValues.smoker = this.formValues.smoker ? this.formValues.smoker : 'non-smoker';
    if (this.formValues.dependent !== undefined ) {
      this.selectDependentsCount(this.formValues.dependent);
    }
    this.userInfoForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      smoker: [this.formValues.smoker, Validators.required]
    });
  }

  selectDependentsCount(count) {
    this.dependents = count;
  }

  save(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.guideMeService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.guideMeService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.customDob = this.parserFormatter.format(form.value.dob);
    form.value.dependent = this.dependents;
    this.guideMeService.setUserInfo(form.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.PROTECTION_NEEDS]);
    }
  }
}
