import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorModalComponent } from './../../error-modal/error-modal.component';
import { GuideMeService } from './../../guide-me.service';

@Component({
  selector: 'app-get-started-form',
  templateUrl: './get-started-form.component.html',
  styleUrls: ['./get-started-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedFormComponent implements OnInit {
  userInfos: FormGroup;
  formValues: any;
  pageTitle: string;

  constructor(
    private router: Router,
    private modal: NgbModal,
    private guideMeService: GuideMeService) { }

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
    this.guideMeService.setUserInfo(form.value);
    return true;
  }

  goToNeed(form) {
    if (this.save(form)) {
      this.router.navigate(['/financial']);
    }
  }
}
