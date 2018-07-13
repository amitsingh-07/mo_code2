import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { ErrorModalComponent } from './../../error-modal/error-modal.component';
import { GuideMeService } from './../../guide-me.service';

@Component({
  selector: 'app-get-started-form',
  templateUrl: './get-started-form.component.html',
  styleUrls: ['./get-started-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}]
})
export class GetStartedFormComponent implements OnInit {
  userInfos: FormGroup;
  formValues: any;
  pageTitle: string;

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
    this.userInfos = new FormGroup({
      gender: new FormControl(this.formValues.gender, Validators.required),
      dob: new FormControl(this.formValues.dob, Validators.required),
      smoker: new FormControl(this.formValues.smoker, Validators.required),
      dependent: new FormControl(this.formValues.dependent, Validators.required)
    });
  }

  save(form: any) {
    if (!form.valid) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.guideMeService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.guideMeService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.customDob = this.parserFormatter.format(form.value.dob);
    this.guideMeService.setUserInfo(form.value);
    return true;
  }

  goToNeed(form) {
    if (this.save(form)) {
      this.router.navigate(['/financial']);
    }
  }
}
