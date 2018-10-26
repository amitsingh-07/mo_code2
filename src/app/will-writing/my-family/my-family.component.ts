import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IChild, ISpouse } from '../will-writing-types';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-family',
  templateUrl: './my-family.component.html',
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  styleUrls: ['./my-family.component.scss']
})
export class MyFamilyComponent implements OnInit {
  private pageTitle: string;
  private step: string;

  myFamilyForm: FormGroup;
  childrenFormValues: IChild[];
  hasSpouse: boolean;
  hasChild: boolean;
  submitted: boolean;

  constructor(
    private config: NgbDatepickerConfig,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private router: Router,
    private translate: TranslateService,
    private willWritingService: WillWritingService
  ) {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_1');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_FAMILY.TITLE');
    });
  }

  ngOnInit() {
    this.hasSpouse = this.willWritingService.getAboutMeInfo().maritalStatus === 'married';
    this.hasChild = this.willWritingService.getAboutMeInfo().noOfChildren > 0;
    this.childrenFormValues = this.willWritingService.getChildrenInfo();
    this.buildMyFamilyForm();
  }

  /**
   * build about me form.
   */
  buildMyFamilyForm() {
    this.myFamilyForm = this.formBuilder.group({
      spouse: this.formBuilder.array([this.buildSpouseForm()]),
      childrens: this.formBuilder.array([this.buildChildrenForm(0)]),
    });
    if (this.hasChild) {
      const childrenCount: number = this.willWritingService.getAboutMeInfo().noOfChildren;
      for (let i = 1; i <= childrenCount - 1; i++) {
        this.addChildrenForm(i);
      }
    }
  }

  buildSpouseForm(): FormGroup {
    if (this.hasSpouse) {
      const spouseFormValues: ISpouse = this.willWritingService.getSpouseInfo()[0];
      return this.formBuilder.group({
        name: [spouseFormValues ? spouseFormValues.name : '', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
        uin: [spouseFormValues ? spouseFormValues.uin : '',
        [Validators.required, Validators.pattern(RegexConstants.UIN)]],
      });
    }
    return this.formBuilder.group({});
  }

  buildChildrenForm(index: number): FormGroup {
    if (this.hasChild) {
      return this.formBuilder.group({
        name: [this.childrenFormValues.length > index ?
          this.childrenFormValues[index].name : '', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
        uin: [this.childrenFormValues.length > index ?
          this.childrenFormValues[index].uin : '', [Validators.required, Validators.pattern(RegexConstants.UIN)]],
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
      return false;
    } else {
      if (this.hasSpouse) {
        this.willWritingService.setSpouseInfo(form.value.spouse[0]);
      }
      if (this.hasChild) {
        this.willWritingService.setChildrenInfo(form.value.childrens);
      }
      return true;
    }
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.save(form)) {
      if (this.hasChild && this.willWritingService.checkChildrenAge(form.value.childrens)) {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_CHILD_GUARDIAN]);
      } else {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE]);
      }
    }
  }

}
