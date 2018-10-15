import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { DirectService } from './../../direct/direct.service';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-check-eligibility',
  templateUrl: './check-eligibility.component.html',
  styleUrls: ['./check-eligibility.component.scss']
})
export class CheckEligibilityComponent implements OnInit {
  private pageTitle: string;

  formValues: any;
  eligibilityForm: FormGroup;
  religion = '';
  religionList;
  constructor(
    private formBuilder: FormBuilder,
    private willWritingService: WillWritingService,
    private router: Router,
    private directService: DirectService,
    private translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.religionList = this.translate.instant('WILL_WRITING.ELIGIBILITY.RELIGION_LIST');
      this.pageTitle = this.translate.instant('WILL_WRITING.ELIGIBILITY.TITLE');
    });
  }

  ngOnInit() {
    this.formValues = this.willWritingService.getEligibilityDetails();
    this.eligibilityForm = this.formBuilder.group({
      singaporean: [this.formValues.singaporean, Validators.required],
      assets: [this.formValues.assets, Validators.required],
      religion : [this.formValues.religion, Validators.required]
    });
    setTimeout(() => {
      if (this.formValues.religion !== undefined) {
        this.selectReligion(this.formValues.religion);
      }
    }, 100);
  }

  selectReligion(religion) {
    religion = religion ? religion : {text: '', value: ''};
    this.religion = religion.text;
    this.eligibilityForm.controls['religion'].setValue(religion.value);
  }

  save(form: any) {
    if (!form.valid) {
      return false;
    } else if (form.value.religion === 'muslim') {
      this.openErrorModal();
      return false;
    }
    this.willWritingService.setEligibilityDetails(form.value);
    return true;
  }

  openToolTipModal() {
    const title = 'Assets to be Distributed';
    const message = `

    Do note that only the following assets can be distributed via your will.

    - Bank Accounts (Non-joint)
    - Investments (Non-joint)
    - Insurance (Without nominations nor trusts)
    - Property (Tenancy-In-Common)

    To distribute your CPF, you should make a separate CPF nomination.`;
    this.willWritingService.openToolTipModal(title, message);
  }

  openErrorModal() {
    const title = 'Assets to be Distributed';
    const message = '';
    this.willWritingService.openErrorModal(title, message, false);
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.TELL_US_ABOUT_YOURSELF]);
    }
  }

}
