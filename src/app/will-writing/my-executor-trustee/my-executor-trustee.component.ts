import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IChild, IMyFamily, ISpouse, IExecTrustee } from '../will-writing-types';
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
    private router: Router,
    private translate: TranslateService,
    private willWritingService: WillWritingService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_3');
      this.pageTitle = this.translate.instant('WILL_WRITING.My_EXECUTOR_TRUSTEE.TITLE');
    });
  }

  ngOnInit() {
    this.showSpouseDeatils = this.willWritingService.getAboutMeInfo().maritalStatus === 'married';
    this.buildAddExecTrusteeForm();
  }

  /**
   * build about me form.
   */
  buildAddExeTrusteeForm() {
    this.execTrusteeFormValues = this.willWritingService.getExecTrusteeInfo();
    this.addExeTrusteeForm = this.formBuilder.group({
      spouse: this.formBuilder.array([this.buildSpouseForm()]),
      childrens: this.formBuilder.array([this.buildChildrenForm(0)]),
    });
    if (this.showChildDetails) {
      for (let i = 1; i <= this.childrenCount - 1 ; i++) {
        this.addChildrenForm(i);
      }
    }
  }

  buildSpouseForm(): FormGroup {
    if (this.showSpouseDeatils) {
      return this.formBuilder.group({
        name: [this.familyFormValues.spouse.name, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
        nricNumber: [this.familyFormValues.spouse.nricNumber, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      });
    }
    return this.formBuilder.group({});
  }

  buildChildrenForm(index: number): FormGroup {
    if (this.showChildDetails) {
      return this.formBuilder.group({
          name: [this.childrenFormValues.length > index ?
            this.childrenFormValues[index].name : '', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
          nricNumber: [this.childrenFormValues.length > index ?
            this.childrenFormValues[index].nricNumber : '', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
          dob: [this.childrenFormValues.length > index ? this.childrenFormValues[index].dob : '', [Validators.required]]
      });
    }
    return this.formBuilder.group({});
  }

  addChildrenForm(index: number): void {
    const items: FormArray = this.myFamilyForm.get('childrens') as FormArray;
    items.push(this.buildChildrenForm(index));
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
      if (this.showSpouseDeatils) {
        this.willWritingService.setSpouseInfo(form.value.spouse[0]);
      }
      if (this.showChildDetails) {
        this.willWritingService.clearChildrenInfo();
        for (const children of form.value.childrens) {
          this.willWritingService.setChildrenInfo(children);
        }
      }
      return true;
    }
  }

  checkChildrenAge(childrens: IChild[]): boolean {
    for (const children of childrens) {
      const dob = children.dob;
      const today = new Date();
      const birthDate = new Date(dob['year'], dob['month'], dob['day']);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      if (age < 21) {
        return true;
      }
    }
    return false;
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.save(form)) {
      if (!this.showSpouseDeatils && this.showChildDetails && this.checkChildrenAge(form.value.childrens)) {
          this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_CHILD_GUARDIAN]);
      } else {
        if (this.showSpouseDeatils && this.showChildDetails && this.checkChildrenAge(form.value.childrens)) {
          const spouse = Object.assign({}, form.value.spouse[0]);
          spouse.relationship = 'parent';
          this.willWritingService.setGuardianInfo(spouse);
        } else {
          this.willWritingService.clearGuardianInfo();
        }
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE]);
      }
    }
  }

}
