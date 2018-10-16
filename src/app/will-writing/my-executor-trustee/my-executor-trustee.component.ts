import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { RegexConstants } from '../../../app/shared/utils/api.regex.constants';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IExecTrustee } from '../will-writing-types';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-executor-trustee',
  templateUrl: './my-executor-trustee.component.html',
  styleUrls: ['./my-executor-trustee.component.scss']
})
export class MyExecutorTrusteeComponent implements OnInit {
  private pageTitle: string;
  private step: string;

  addExeTrusteeForm: FormGroup;
  execTrusteeFormValues: IExecTrustee[];
  showSpouseDeatils: boolean;
  submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private willWritingService: WillWritingService,
    private router: Router,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_3');
      this.pageTitle = this.translate.instant('WILL_WRITING.My_EXECUTOR_TRUSTEE.TITLE');
    });
  }

  ngOnInit() {
    this.showSpouseDeatils = this.willWritingService.getAboutMeInfo().maritalStatus === 'married';
    this.buildExecTrusteeForm();
  }

  /**
   * build about me form.
   */
  buildExecTrusteeForm() {
    this.execTrusteeFormValues = this.willWritingService.getExecTrusteeInfo();
    this.addExeTrusteeForm = this.formBuilder.group({
      execTrustee: this.formBuilder.array([this.buildAddExecTrusteeForm(0)]),
    });
    if (this.execTrusteeFormValues.length) {
      for (let i = 1; i <= this.execTrusteeFormValues.length - 1 ; i++) {
        this.addExecTrusteeForm(i);
      }
    }
  }

  buildAddExecTrusteeForm(index: number): FormGroup {
      return this.formBuilder.group({
          name: [this.execTrusteeFormValues.length > index ?
            this.execTrusteeFormValues[index].name : '', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
          relationship: [this.execTrusteeFormValues.length > index ? this.execTrusteeFormValues[index].relationship : '',
          [Validators.required]],
          nricNumber: [this.execTrusteeFormValues.length > index ?
            this.execTrusteeFormValues[index].nricNumber : '', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      });
  }

  addExecTrusteeForm(index: number): void {
    const items: FormArray = this.addExeTrusteeForm.get('execTrustee') as FormArray;
    items.push(this.buildAddExecTrusteeForm(index));
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  save(form: any) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getMultipleFormError(form, 'myFamilyForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, true);
    } else {
      /*if (this.showSpouseDeatils) {
        this.willWritingService.setSpouseInfo(form.value.spouse[0]);
      }
      if (this.showChildDetails) {
        this.willWritingService.clearChildrenInfo();
        for (const children of form.value.childrens) {
          this.willWritingService.setChildrenInfo(children);
        }
      }*/
      return true;
    }
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE]);
    }
  }
}
