import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { ToolTipModalComponent } from '../shared/modal/tooltip-modal/tooltip-modal.component';
import { SignUpService } from './../sign-up/sign-up.service';
import { WillWritingFormData } from './will-writing-form-data';
import { WillWritingFormError } from './will-writing-form-error';
import {
  IAboutMe, IBeneficiary, IChild, IEligibility,
  IExecTrustee, IGuardian, IPromoCode, ISpouse
} from './will-writing-types';
import { WILL_WRITING_CONFIG } from './will-writing.constants';

const SESSION_STORAGE_KEY = 'app_will_writing_session';
const FROM_CONFIRMATION_PAGE = 'from_confirmation_page';
const IS_WILL_CREATED = 'is_will_created';

@Injectable({
  providedIn: 'root'
})
export class WillWritingService {
  private willWritingFormData: WillWritingFormData = new WillWritingFormData();
  private willWritingFormError: any = new WillWritingFormError();
  fromConfirmationPage;
  isWillCreated;
  constructor(
    private http: HttpClient,
    private modal: NgbModal,
    private signUpService: SignUpService,
  ) {
    // get data from session storage
    this.getWillWritingFormData();
    this.getFromConfirmPage();
    this.getIsWillCreated();
  }

  /**
   * set will writing form data from session storage when reload happens.
   */
  getWillWritingFormData(): WillWritingFormData {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.willWritingFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.willWritingFormData;
  }

  /**
   * save data in session storage.
   */
  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.willWritingFormData));
    }
  }

  /**
   * clear session storage data.
   */
  clearData() {
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
  }

  isUserLoggedIn(): boolean {
    const userInfo = this.signUpService.getUserProfileInfo();
    return userInfo && userInfo.firstName;
  }

  clearWillWritingData(isMaritalStatusChanged) {
    if (isMaritalStatusChanged) {
      this.willWritingFormData.spouse = [];
    }
    this.willWritingFormData.guardian = [];
    this.willWritingFormData.beneficiary = [];
    this.willWritingFormData.execTrustee = [];
  }

  updateSpouseInfo(data) {
    // update spouse in guardian
    if (this.getGuardianInfo().length > 0) {
      const spouseGuardian = this.getGuardianInfo();
      spouseGuardian[0].name = data.name;
      spouseGuardian[0].uin = data.uin;
      this.setGuardianInfo(spouseGuardian);
    }

    // update spouse in beneficiary
    if (this.getBeneficiaryInfo().length > 0) {
      const spouseBeneficiary = this.getBeneficiaryInfo();
      spouseBeneficiary[0].name = data.name;
      spouseBeneficiary[0].uin = data.uin;
      this.setBeneficiaryInfo(spouseBeneficiary);
    }

    // update spouse in executor and trustee
    if (this.getExecTrusteeInfo().length > 0) {
      const spouseExecTrustee = this.getExecTrusteeInfo();
      spouseExecTrustee[0].name = data.name;
      spouseExecTrustee[0].uin = data.uin;
      this.setExecTrusteeInfo(spouseExecTrustee);
    }
  }

  updateChildrenInfo(data) {
    const childrenBeneficiary = this.getBeneficiaryInfo();
    const childrenList = this.getChildrenInfo();
    let i = this.getSpouseInfo().length > 0 ? 1 : 0;
    for (const children of data) {
      if (children.name !== childrenList[0].name || children.uin !== childrenList[0].uin || children.dob !== childrenList[0].dob) {
        childrenBeneficiary[i].name = children.name;
        childrenBeneficiary[i].uin = children.uin;
        childrenBeneficiary[i].dob = children.dob;
      }
      i++;
    }
    this.setBeneficiaryInfo(childrenBeneficiary);
  }

  /**
   * get form errors.
   * @param form - form details.
   * @returns first error of the form.
   */
  getFormError(form, formName) {
    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.willWritingFormError[formName].formFieldErrors.errorTitle;
    for (const name in controls) {
      if (controls[name].invalid) {
        errors.errorMessages.push(
          this.willWritingFormError[formName].formFieldErrors[name][Object.keys(controls[name]['errors'])[0]].errorMessage);
      }
    }
    return errors;
  }

  /**
   * get form errors.
   * @param form - form details.
   * @returns first error of the form.
   */
  getMultipleFormError(form, formName, formTitle) {
    const forms = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.willWritingFormError[formName].formFieldErrors.errorTitle;
    let index = 0;

    // tslint:disable-next-line:forin
    for (const field in forms) {
      for (const control of forms[field].controls) {
        const formGroup = { formName: '', errors: [] };
        // tslint:disable-next-line:forin
        for (const name in control.controls) {
          formGroup.formName = formTitle[index];
          if (control.controls[name].invalid) {
            formGroup.errors.push(
              this.willWritingFormError[formName].formFieldErrors[field][name][Object.keys(control.controls[name]['errors'])
              [0]].errorMessage);
          }
        }
        if (formGroup.errors.length > 0) {
          errors.errorMessages.push(formGroup);
        }
        index++;
      }
    }
    return errors;
  }

  /**
   * get about me details.
   * @returns about me details.
   */
  getAboutMeInfo(): IAboutMe {
    if (!this.willWritingFormData.aboutMe) {
      this.willWritingFormData.aboutMe = {} as IAboutMe;
    }
    return this.willWritingFormData.aboutMe;
  }

  /**
   * set about me details.
   * @param data - about me details.
   */
  setAboutMeInfo(data: IAboutMe) {
    if (Object.keys(this.getAboutMeInfo()).length !== 0) {
      const isMaritalStatusChanged = this.getAboutMeInfo().maritalStatus !== data.maritalStatus &&
        (this.getAboutMeInfo().maritalStatus === WILL_WRITING_CONFIG.MARRIED || data.maritalStatus === WILL_WRITING_CONFIG.MARRIED);
      const isNoOfChildrenChanged = this.getAboutMeInfo().noOfChildren !== data.noOfChildren;
      if (isMaritalStatusChanged || isNoOfChildrenChanged) {
        if (this.getAboutMeInfo().noOfChildren > data.noOfChildren) {
          this.willWritingFormData.children = this.willWritingFormData.children.slice(0, data.noOfChildren);
        }
        this.clearWillWritingData(isMaritalStatusChanged);
      }
    }
    this.willWritingFormData.aboutMe = data;
    this.commit();
  }

  /**
   * get spouse details.
   * @returns spouse details.
   */
  getSpouseInfo(): ISpouse[] {
    if (!this.willWritingFormData.spouse) {
      this.willWritingFormData.spouse = [] as ISpouse[];
    }
    return this.willWritingFormData.spouse;
  }

  /**
   * set spouse details.
   * @param data - spouse details.
   */
  setSpouseInfo(data: ISpouse) {
    if (this.getSpouseInfo().length > 0 && (this.getSpouseInfo()[0].name !== data.name || this.getSpouseInfo()[0].uin !== data.uin)) {
      this.updateSpouseInfo(data);
    }
    this.willWritingFormData.spouse = [];
    data.relationship = WILL_WRITING_CONFIG.SPOUSE;
    this.willWritingFormData.spouse.push(data);
    this.commit();
  }

  /**
   * get children details.
   * @returns children details.
   */
  getChildrenInfo(): IChild[] {
    if (!this.willWritingFormData.children) {
      this.willWritingFormData.children = [] as IChild[];
    }
    return this.willWritingFormData.children;
  }

  /**
   * set children details.
   * @param data - children details.
   */
  setChildrenInfo(data: IChild[]) {
    if (this.getChildrenInfo().length > 0) {
      if (this.getBeneficiaryInfo().length > 0) {
        this.updateChildrenInfo(data);
      }
      if (this.getGuardianInfo().length > 0 && !this.checkChildrenAge(data)) {
        this.willWritingFormData.guardian = [];
      }
    }
    this.willWritingFormData.children = [];
    let i = 1;
    for (const children of data) {
      children.relationship = WILL_WRITING_CONFIG.CHILD;
      children.pos = i;
      children.formatedDob = new Date(children.dob['year'] + '-' + children.dob['month'] + '-' + children.dob['day']);
      this.willWritingFormData.children.push(children);
      i++;
    }
    this.commit();
  }

  /**
   * get guardian details.
   * @returns guardian details.
   */
  getGuardianInfo(): IGuardian[] {
    if (!this.willWritingFormData.guardian) {
      this.willWritingFormData.guardian = [] as IGuardian[];
    }
    return this.willWritingFormData.guardian;
  }

  /**
   * set guardian details.
   * @param data - guardian details.
   */
  setGuardianInfo(data: IGuardian[]) {
    this.willWritingFormData.guardian = data;
    this.commit();
  }

  /**
   * get eligibility details.
   * @returns eligibility details.
   */
  getEligibilityDetails(): IEligibility {
    if (!this.willWritingFormData.eligibility) {
      this.willWritingFormData.eligibility = {} as IEligibility;
    }
    return this.willWritingFormData.eligibility;
  }

  /**
   * set eligibility details.
   * @param data - eligibility details.
   */
  setEligibilityDetails(data: IEligibility) {
    this.willWritingFormData.eligibility = data;
    this.commit();
  }

  /**
   * get PromoCode details.
   * @returns PromoCode details.
   */
  getPromoCode(): IPromoCode {
    if (!this.willWritingFormData.promoCode) {
      this.willWritingFormData.promoCode = {} as IPromoCode;
    }
    return this.willWritingFormData.promoCode;
  }

  /**
   * get guardian details.
   * @returns guardian details.
   */
  getExecTrusteeInfo(): IExecTrustee[] {
    if (!this.willWritingFormData.execTrustee) {
      this.willWritingFormData.execTrustee = [] as IExecTrustee[];
    }
    return this.willWritingFormData.execTrustee;
  }

  /**
   * set guardian details.
   * @param data - guardian details.
   */
  setExecTrusteeInfo(data: IExecTrustee[]) {
    this.willWritingFormData.execTrustee = data;
    this.commit();
  }

  /**
   * set PromoCode details.
   * @param data - PromoCode details.
   */
  setPromoCode(data: IPromoCode) {
    this.willWritingFormData.promoCode = data;
    this.commit();
  }

  /**
   * get Beneficiary details.
   * @returns Beneficiary details.
   */
  getBeneficiaryInfo(): IBeneficiary[] {
    if (!this.willWritingFormData.beneficiary) {
      this.willWritingFormData.beneficiary = [] as IBeneficiary[];
    }
    return this.willWritingFormData.beneficiary;
  }

  /**
   * set Beneficiary details.
   * @param data - Beneficiary details.
   */
  setBeneficiaryInfo(data: IBeneficiary[]) {
    this.willWritingFormData.beneficiary = data;
    this.commit();
  }

  checkBeneficiaryAge() {
    const beneficiaries = this.getBeneficiaryInfo().filter((beneficiary) =>
      beneficiary.relationship === 'child' && beneficiary.selected === true);
    return this.checkChildrenAge(beneficiaries);
  }

  checkChildrenAge(childrens): boolean {
    for (const children of childrens) {
      const dob = children.dob;
      const today = new Date();
      const birthDate = new Date(dob['year'], dob['month'], dob['day']);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < WILL_WRITING_CONFIG.CHILD_GUARDIAN_AGE) {
        return true;
      }
    }
    return false;
  }

  openToolTipModal(title: string, message: string) {
    const ref = this.modal.open(ToolTipModalComponent, { centered: true });
    ref.componentInstance.tooltipTitle = title;
    ref.componentInstance.tooltipMessage = message;
    return false;
  }

  openErrorModal(title: string, message: string, isMultipleForm: boolean, formName?: string) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    if (!isMultipleForm) {
      ref.componentInstance.formName = formName;
      ref.componentInstance.errorMessageList = message;
    } else {
      ref.componentInstance.multipleFormErrors = message;
    }
    return false;
  }

  setFromConfirmPage(flag) {
    if (window.sessionStorage) {
      sessionStorage.setItem(FROM_CONFIRMATION_PAGE, flag);
    }
    this.fromConfirmationPage = flag;
  }

  getFromConfirmPage() {
    if (window.sessionStorage && sessionStorage.getItem(FROM_CONFIRMATION_PAGE)) {
      this.fromConfirmationPage = JSON.parse(sessionStorage.getItem(FROM_CONFIRMATION_PAGE));
    }
    return this.fromConfirmationPage;
  }

  setIsWillCreated(flag) {
    if (window.sessionStorage) {
      sessionStorage.setItem(IS_WILL_CREATED, flag);
    }
    this.isWillCreated = flag;
  }

  getIsWillCreated() {
    if (window.sessionStorage && sessionStorage.getItem(IS_WILL_CREATED)) {
      this.isWillCreated = JSON.parse(sessionStorage.getItem(IS_WILL_CREATED));
    }
    return this.isWillCreated;
  }

  checkBeneficiary(uin) {
    return this.getBeneficiaryInfo().filter((data) => data.uin === uin && data.selected === true);
  }
}
