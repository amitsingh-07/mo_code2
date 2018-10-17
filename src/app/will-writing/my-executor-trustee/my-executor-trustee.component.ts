import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { RegexConstants } from '../../../app/shared/utils/api.regex.constants';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IExecTrustee, ISpouse } from '../will-writing-types';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-executor-trustee',
  templateUrl: './my-executor-trustee.component.html',
  styleUrls: ['./my-executor-trustee.component.scss']
})
export class MyExecutorTrusteeComponent implements OnInit {
  private pageTitle: string;
  private step: string;
  private tooltip = {};

  hasGuardian: boolean;
  hasSpouse: boolean;

  addExeTrusteeForm: FormGroup;
  execTrusteeList: IExecTrustee[] = [];
  relationship = '';
  relationshipList;
  showAddExeTrusteeForm: boolean;
  showAddExeTrusteeBtn: boolean;
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
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_EXECUTOR_TRUSTEE.TITLE');
      this.relationshipList = this.translate.instant('WILL_WRITING.COMMON.RELATIONSHIP_LIST');
      this.tooltip['title'] = this.translate.instant('WILL_WRITING.MY_EXECUTOR_TRUSTEE.TOOLTIP_TITLE');
      this.tooltip['message'] = this.translate.instant('WILL_WRITING.MY_EXECUTOR_TRUSTEE.TOOLTIP_MESSAGE');
    });
  }

  ngOnInit() {
    this.hasSpouse = this.willWritingService.getAboutMeInfo().maritalStatus === 'married';
    this.hasGuardian = this.willWritingService.getGuardianInfo.length > 0;
    if (this.willWritingService.getExecTrusteeInfo.length > 0 ) {
      this.execTrusteeList = this.willWritingService.getExecTrusteeInfo();
    } else if (this.hasSpouse) {
      this.execTrusteeList.push(this.willWritingService.getSpouseInfo());
    }
    this.buildExecTrusteeForm();
  }

  /**
   * build about me form.
   */
  buildExecTrusteeForm() {
    this.addExeTrusteeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      relationship: ['', [Validators.required]],
      nricNumber: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
    });
  }

  get execTrustee() { return this.addExeTrusteeForm.controls; }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectRelationship(relationship) {
    relationship = relationship ? relationship : {text: '', value: ''};
    this.relationship = relationship.text;
    this.addExeTrusteeForm.controls['relationship'].setValue(relationship.value);
  }

  addExecTrustee(form) {
    if (this.save(form)) {
      this.showAddExeTrusteeForm = false;
    }
  }

  showHideForm() {
    this.submitted = false;
    this.addExeTrusteeForm.reset();
    this.showAddExeTrusteeForm = !this.showAddExeTrusteeForm;
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
      const error = this.willWritingService.getFormError(form, 'addExecTrusteeForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, false);
    } else {
      this.execTrusteeList.push(form.value);
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
