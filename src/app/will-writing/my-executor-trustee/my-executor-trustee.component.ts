import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RegexConstants } from '../../../app/shared/utils/api.regex.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PageTitleComponent } from '../page-title/page-title.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IExecTrustee } from '../will-writing-types';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-executor-trustee',
  templateUrl: './my-executor-trustee.component.html',
  styleUrls: ['./my-executor-trustee.component.scss']
})
export class MyExecutorTrusteeComponent implements OnInit, OnDestroy {
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;
  pageTitle: string;
  step: string;
  tooltip = {};
  private formTitleMsg = {};
  isEdit: boolean;
  private selectedIndex: number;
  private subscription: Subscription;
  private confirmModal = {};

  addExeTrusteeForm: FormGroup;
  execTrusteeList: IExecTrustee[] = [];
  relationship = '';
  relationshipList;
  submitted: boolean;
  isFormAltered = false;
  formTitle: any = [];
  errorMsg;

  hasSpouse: boolean;
  hasChild: boolean;
  willWritingConfig = WILL_WRITING_CONFIG;
  maxExecTrustee = WILL_WRITING_CONFIG.MAX_EXECUTOR_TRUSTEE;
  unsavedMsg: string;
  toolTip;
  formName: string[] = [];

  fromConfirmationPage = this.willWritingService.fromConfirmationPage;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private willWritingService: WillWritingService,
    public footerService: FooterService,
    public navbarService: NavbarService,
    private _location: Location,
    private modal: NgbModal,
    private router: Router
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_3');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_EXECUTOR_TRUSTEE.TITLE');
      this.relationshipList = this.translate.instant('WILL_WRITING.COMMON.RELATIONSHIP_LIST_EXEC');
      this.tooltip['title'] = this.translate.instant('WILL_WRITING.MY_EXECUTOR_TRUSTEE.TOOLTIP_TITLE');
      this.tooltip['message'] = this.translate.instant('WILL_WRITING.MY_EXECUTOR_TRUSTEE.TOOLTIP_MESSAGE');
      this.confirmModal['hasNoImpact'] = this.translate.instant('WILL_WRITING.COMMON.CONFIRM');
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
      this.toolTip = this.translate.instant('WILL_WRITING.COMMON.ID_TOOLTIP');
      this.errorMsg = this.translate.instant('WILL_WRITING.MY_EXECUTOR_TRUSTEE.ERROR_MSG');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.hasSpouse = this.willWritingService.getAboutMeInfo().maritalStatus === WILL_WRITING_CONFIG.MARRIED;
    this.hasChild = this.willWritingService.getAboutMeInfo().noOfChildren > 0;
    const execTrusteeList = this.willWritingService.getExecTrusteeInfo();
    if (execTrusteeList.length > 0) {
      this.execTrusteeList = JSON.parse(JSON.stringify(execTrusteeList));
    }
    this.buildMainForm();
    this.headerSubscription();
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.addExeTrusteeForm.dirty) {
          this.pageTitleComponent.goBack();
        } else {
          this._location.back();
        }
        return false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
  }

  get execTrustee() { return this.addExeTrusteeForm.controls; }

  /**
   * build about me form.
   */
  // tslint:disable-next-line:cognitive-complexity
  buildMainForm() {
    this.addExeTrusteeForm = this.formBuilder.group({
      executorTrustee: this.formBuilder.array([this.buildExecTrusteeForm()]),
    });
    if (this.execTrusteeList.length !== this.maxExecTrustee) {
      for (let i = 1; i < this.maxExecTrustee; i++) {
        this.addExecTrusteeForm();
      }
    }
    if (this.execTrusteeList.length !== this.maxExecTrustee) {
      this.formTitle.push({ isAlt: false, relationship: '' });
      this.formTitle.push({ isAlt: true, relationship: '' });
      this.formName.push('Main Executor & Trustee');
      this.formName.push('Alternative Executor & Trustee');
    }
  }

  buildExecTrusteeForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100),
      Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: ['', [Validators.required]],
      uin: ['', [Validators.required]],
      isAlt: []
    });
  }

  addExecTrusteeForm() {
    const items: FormArray = this.addExeTrusteeForm.get('executorTrustee') as FormArray;
    items.push(this.buildExecTrusteeForm());
  }

  openToolTip() {
    this.willWritingService.openToolTipModal(this.toolTip.TITLE, this.toolTip.MESSAGE);
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
    this.addExeTrusteeForm.markAsDirty();
  }

  editExecTrustee(relation: string, index: number) {
    this.selectedIndex = index;
    this.isEdit = true;
    const execTrustee = this.execTrusteeList[index];
    this.formTitle[0] = {
      isAlt: execTrustee.isAlt,
      title: execTrustee.isAlt ? this.formTitleMsg['alt'] : this.formTitleMsg['main'],
      relationship: ''
    };
    this.formName[0] = execTrustee.isAlt ? 'Alternative Executor & Trustee' : 'Main Executor & Trustee';
    const execTrusteeForm = this.addExeTrusteeForm.get('executorTrustee')['controls'][0];
    execTrusteeForm.controls['name'].setValue(execTrustee.name);
    execTrusteeForm.controls['uin'].setValue(execTrustee.uin);
    const ExecRelationship = this.relationshipList.filter((relationship) => relationship.value === execTrustee.relationship);
    this.selectRelationship(ExecRelationship[0], 0);
  }

  resetForm() {
    this.isEdit = false;
    this.addExeTrusteeForm.reset();
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  validateExecTrusstee(form: any): boolean {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getMultipleFormError(form, 'addExecTrusteeForm', this.formName);
      this.willWritingService.openErrorModal(error.title, error.errorMessages, true);
      return false;
    }
    return true;
  }

  checkExecTrustee(form) {
    let execTrusteeList = [];
    execTrusteeList = this.execTrusteeList.length > 0 ? this.execTrusteeList : form.value.executorTrustee;
    const errors: any = {};
    errors.errorMessages = [];
    if ((execTrusteeList[0].uin).toLowerCase() === (execTrusteeList[1].uin).toLowerCase()) {
      errors.errorMessages.push({ formName: '', errors: [this.errorMsg.DUPLICATE_IDENTIFIER] });
    } else if (execTrusteeList[0].relationship === WILL_WRITING_CONFIG.SPOUSE &&
      execTrusteeList[1].relationship === WILL_WRITING_CONFIG.SPOUSE) {
      errors.errorMessages.push({ formName: '', errors: [this.errorMsg.MULTIPLE_SPOUSE] });
    } else {
      execTrusteeList.forEach((item, index) => {
        const errorMsg = { formName: '', errors: [] };
        const formName = index === 0 ? 'Main Executor & Trustee' : 'Alternative Executor & Trustee';
        if (item.relationship === WILL_WRITING_CONFIG.SPOUSE) {
          const spouseWithUin = this.checkNameUIN('uin', item.uin, 'spouse');
          if (!this.hasSpouse) {
            errorMsg.formName = formName;
            const maritalStatus = this.willWritingService.getAboutMeInfo().maritalStatus;
            const errorMessage = this.replaceStringValues('NO_SPOUSE', ['<Marital Status>'], [maritalStatus]);
            errorMsg.errors.push(errorMessage);
          } else if (spouseWithUin.length === 0) {
            errorMsg.formName = formName;
            const errorMessage = this.replaceStringValues('NO_MATCH',
              ['<Full Name>', '<Relationship>', '<ID>', '<Section>'],
              [item.name, item.relationship, item.uin, formName]);
            errorMsg.errors.push(errorMessage);
          } else {
            const spouse = this.checkNameUIN('name', item.name, 'spouse');
            if (spouse.length === 0) {
              errorMsg.formName = formName;
              const errorMessage = this.replaceStringValues('NO_MATCH',
                ['<Full Name>', '<Relationship>', '<ID>', '<Section>'],
                [item.name, item.relationship, item.uin, formName]);
              errorMsg.errors.push(errorMessage);
            }
          }
        } else if (item.relationship === WILL_WRITING_CONFIG.CHILD) {
          const childWithUin = this.checkNameUIN('uin', item.uin);
          if (!this.hasChild) {
            errorMsg.formName = formName;
            const errorMessage = this.replaceStringValues('NO_CHILD', ['<Full Name>', '<ID>'], [item.name, item.uin]);
            errorMsg.errors.push(errorMessage);
          } else if (childWithUin.length === 0) {
            errorMsg.formName = formName;
            const errorMessage = this.replaceStringValues('NO_MATCH',
              ['<Full Name>', '<Relationship>', '<ID>', '<Section>'],
              [item.name, item.relationship, item.uin, formName]);
            errorMsg.errors.push(errorMessage);
          } else {
            const child = this.checkNameWithUIN(item.name, item.uin);
            if (child.length === 0) {
              errorMsg.formName = formName;
              const errorMessage = this.replaceStringValues('NO_MATCH',
                ['<Full Name>', '<Relationship>', '<ID>', '<Section>'],
                [item.name, item.relationship, item.uin, formName]);
              errorMsg.errors.push(errorMessage);
            } else if (this.willWritingService.checkChildrenAge(this.checkNameUIN('uin', item.uin))) {
              errorMsg.formName = formName;
              const errorMessage = this.replaceStringValues('CHILD_AGE', ['<Full Name>', '<ID>'], [item.name, item.uin]);
              errorMsg.errors.push(errorMessage);
            }
          }
        }
        if (errorMsg.errors.length > 0) {
          errors.errorMessages.push(errorMsg);
        }
      });
    }
    if (errors.errorMessages.length > 0) {
      this.willWritingService.openErrorModal('Oops! Please take note of the following:', errors.errorMessages, true);
      return false;
    }
    return true;
  }

  replaceStringValues(error, stringToReplace, replaceValues) {
    let errorMessage = this.errorMsg[error];
    stringToReplace.forEach((item, index) => {
      errorMessage = errorMessage.replace(item, replaceValues[index]);
    });
    return errorMessage;
  }

  checkNameUIN(name, value, type = 'child') {
    if (type === 'spouse') {
      return this.willWritingService.getSpouseInfo().filter((spouse) => spouse[name].toLowerCase() === value.toLowerCase());
    }
    return this.willWritingService.getChildrenInfo().filter((child) => (child[name]).toLowerCase() === value.toLowerCase());
  }

  checkNameWithUIN(name, uin) {
    return this.willWritingService.getChildrenInfo().filter((child) => (child.name).toLowerCase() === name.toLowerCase() &&
      (child.uin).toLowerCase() === uin.toLowerCase());
  }

  updateExecTrustee(form) {
    if (this.validateExecTrusstee(form)) {
      this.execTrusteeList[this.selectedIndex].name = form.value.executorTrustee[0].name;
      this.execTrusteeList[this.selectedIndex].relationship = form.value.executorTrustee[0].relationship;
      this.execTrusteeList[this.selectedIndex].uin = form.value.executorTrustee[0].uin;
      this.addExeTrusteeForm.markAsDirty();
      this.resetForm();
      this.isFormAltered = true;
    }
  }

  save(form) {
    if (!this.isEdit && !this.isFormAltered) {
      let i = 0;
      for (const execTrustee of form.value.executorTrustee) {
        execTrustee.isAlt = this.formTitle[i].isAlt;
        this.execTrusteeList.push(execTrustee);
        i++;
      }
    }
    this.willWritingService.setExecTrusteeInfo(this.execTrusteeList);
    return true;
  }

  openToolTipModal() {
    const title = this.tooltip['title'];
    const message = this.tooltip['message'];
    this.willWritingService.openToolTipModal(title, message);
  }

  openConfirmationModal(url: string, form: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.hasImpact = this.confirmModal['hasNoImpact'];
    ref.componentInstance.unSaved = true;
    ref.result.then((data) => {
      if (data === 'yes') {
        this.save(form);
        this.router.navigate([url]);
      }
    });
    return false;
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    const url = this.fromConfirmationPage ? WILL_WRITING_ROUTE_PATHS.CONFIRMATION : WILL_WRITING_ROUTE_PATHS.REVIEW_YOUR_DETAILS;
    if (this.execTrusteeList.length !== this.maxExecTrustee) {
      if (this.validateExecTrusstee(form) && this.checkExecTrustee(form) && this.save(form)) {
        this.router.navigate([url]);
      }
    } else {
      if (this.isFormAltered) {
        if (this.checkExecTrustee(form)) {
          this.openConfirmationModal(url, form);
        }
      } else {
        this.router.navigate([url]);
      }
    }
  }
}
