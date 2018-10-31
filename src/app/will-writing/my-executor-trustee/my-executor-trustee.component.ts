import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { RegexConstants } from '../../../app/shared/utils/api.regex.constants';
import { PageTitleComponent } from '../page-title/page-title.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IExecTrustee, ISpouse } from '../will-writing-types';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-executor-trustee',
  templateUrl: './my-executor-trustee.component.html',
  styleUrls: ['./my-executor-trustee.component.scss']
})
export class MyExecutorTrusteeComponent implements OnInit {
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;
  pageTitle: string;
  step: string;
  tooltip = {};
  private formTitleMsg = {};
  isEdit: boolean;
  private selectedIndex: number;

  addExeTrusteeForm: FormGroup;
  execTrusteeList: IExecTrustee[] = [];
  relationship = '';
  relationshipList;
  submitted: boolean;
  formTitle: any = [];

  hasSpouse: boolean;
  hasChild: boolean;
  maxExecTrustee = WILL_WRITING_CONFIG.MAX_EXECUTOR_TRUSTEE;

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
    this.hasChild = this.willWritingService.getAboutMeInfo().noOfChildren > 0;
    if (this.willWritingService.getExecTrusteeInfo().length > 0) {
      this.execTrusteeList = this.willWritingService.getExecTrusteeInfo();
    } else if (this.hasSpouse) {
      const spouse: any = Object.assign({}, this.willWritingService.getSpouseInfo()[0]);
      spouse.isAlt = false;
      this.execTrusteeList.push(spouse);
    }
    this.buildMainForm();
  }

  get execTrustee() { return this.addExeTrusteeForm.controls; }

  /**
   * build about me form.
   */
  buildMainForm() {
    this.addExeTrusteeForm = this.formBuilder.group({
      executorTrustee: this.formBuilder.array([this.buildExecTrusteeForm()]),
    });
    if (!this.hasSpouse && this.execTrusteeList.length !== this.maxExecTrustee) {
      for (let i = 1; i < this.maxExecTrustee; i++) {
        this.addExecTrusteeForm();
      }
    }
    if (this.execTrusteeList.length !== this.maxExecTrustee) {
      if (this.hasChild && this.willWritingService.checkBeneficiaryAge()) {
        this.formTitle.push({ isAlt: false, relationship: '' });
        if (!this.hasSpouse) {
          this.formTitle.push({ isAlt: false, relationship: '' });
        }
      } else {
        this.formTitle.push({ isAlt: true, relationship: '' });
        if (!this.hasSpouse && !this.hasChild) {
          this.formTitle.push({ isAlt: false, relationship: '' });
        }
      }
    }
  }

  buildExecTrusteeForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: ['', [Validators.required]],
      uin: ['', [Validators.required, Validators.pattern(RegexConstants.UIN)]],
      isAlt: []
    });
  }

  addExecTrusteeForm() {
    const items: FormArray = this.addExeTrusteeForm.get('executorTrustee') as FormArray;
    items.push(this.buildExecTrusteeForm());
  }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectRelationship(relationship, index) {
    relationship = relationship ? relationship : { text: '', value: '' };
    this.formTitle[index].relationship = relationship.text;
    const relation = this.addExeTrusteeForm.get('executorTrustee');
    relation['controls'][index].controls['relationship'].setValue(relationship.value);
  }

  editExecTrustee(relation: string, index: number) {
    if (relation === 'spouse') {
      if (this.addExeTrusteeForm.dirty) {
        this.pageTitleComponent.goBack();
      } else {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_FAMILY]);
      }
    } else {
      this.selectedIndex = index;
      this.isEdit = true;
      const execTrustee = this.execTrusteeList[index];
      this.formTitle[0] = {
        isAlt: execTrustee.isAlt,
        title: execTrustee.isAlt ? this.formTitleMsg['alt'] : this.formTitleMsg['main'],
        relationship: ''
      };
      const execTrusteeForm = this.addExeTrusteeForm.get('executorTrustee')['controls'][0];
      execTrusteeForm.controls['name'].setValue(execTrustee.name);
      execTrusteeForm.controls['uin'].setValue(execTrustee.uin);
      const ExecRelationship = this.relationshipList.filter((relationship) => relationship.value === execTrustee.relationship);
      this.selectRelationship(ExecRelationship[0], 0);
    }
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  save(form: any): boolean {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getMultipleFormError(form, 'addExecTrusteeForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, true);
      return false;
    } else {
      if (!this.isEdit) {
        let i = 0;
        for (const execTrustee of form.value.executorTrustee) {
          execTrustee.isAlt = this.formTitle[i].isAlt;
          this.execTrusteeList.push(execTrustee);
          i++;
        }
      } else {
        this.execTrusteeList[this.selectedIndex].name = form.value.executorTrustee[0].name;
        this.execTrusteeList[this.selectedIndex].relationship = form.value.executorTrustee[0].relationship;
        this.execTrusteeList[this.selectedIndex].uin = form.value.executorTrustee[0].uin;
      }
      this.willWritingService.setExecTrusteeInfo(this.execTrusteeList);
      return true;
    }
  }

  openToolTipModal() {
    const title = this.tooltip['title'];
    const message = this.tooltip['message'];
    this.willWritingService.openToolTipModal(title, message);
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if ((this.isEdit && this.save(form)) || (!this.isEdit && (this.execTrusteeList.length === this.maxExecTrustee || this.save(form)))) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.REVIEW_YOUR_DETAILS]);
    }
  }
}
