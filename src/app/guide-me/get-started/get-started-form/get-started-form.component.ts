import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPageComponent } from '../../../shared/interfaces/page-component.interface';
import { HeaderService } from './../../../shared/header/header.service';
import { ErrorModalComponent } from './../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { GuideMeService } from './../../guide-me.service';

@Component({
  selector: 'app-get-started-form',
  templateUrl: './get-started-form.component.html',
  styleUrls: ['./get-started-form.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}]
})
export class GetStartedFormComponent implements OnInit {
  pageTitle: string;
  userInfoForm: FormGroup;
  formValues: any;
  dependents = 0;
  dependentItems = Array(5).fill(0).map((x, i) => i);

  constructor(
    private router: Router,
    private modal: NgbModal,
    private guideMeService: GuideMeService,
    private parserFormatter: NgbDateParserFormatter,
    private config: NgbDatepickerConfig) {
      const today: Date = new Date();
      config.minDate = {year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate()};
      config.maxDate = {year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate()};
    }

  ngOnInit() {
    this.formValues = this.guideMeService.getGuideMeFormData();
    this.formValues.gender = 'male';
    this.formValues.smoker = 'Non - Smoker';
    this.userInfoForm = new FormGroup({
      gender: new FormControl(this.formValues.gender, Validators.required),
      dob: new FormControl(this.formValues.dob, Validators.required),
      smoker: new FormControl(this.formValues.smoker, Validators.required),
      //dependent: new FormControl(this.formValues.dependent, Validators.required)
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
    this.guideMeService.setUserInfo(form.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate(['/financial']);
    }
  }
}
