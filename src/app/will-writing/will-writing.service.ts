import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { WillWritingFormData } from './will-writing-form-data';
import { WillWritingFormError } from './will-writing-form-error';
import { IAboutMe, IChild, IGuardian, ISpouse } from './will-writing-types';

const SESSION_STORAGE_KEY = 'app_will_writing_session';

@Injectable({
  providedIn: 'root'
})
export class WillWritingService {
  private willWritingFormData: WillWritingFormData = new WillWritingFormData();
  private willWritingFormError: any = new WillWritingFormError();

  constructor(private http: HttpClient) {
    // get data from session storage
    this.getWillWritingFormData();
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
    this.willWritingFormData.aboutMe = data;
    this.commit();
  }

  /**
   * get spouse details.
   * @returns spouse details.
   */
  getSpouseInfo(): ISpouse {
    if (!this.willWritingFormData.spouse) {
      this.willWritingFormData.spouse = {} as ISpouse;
    }
    return this.willWritingFormData.spouse;
  }

  /**
   * set spouse details.
   * @param data - spouse details.
   */
  setSpouseInfo(data: ISpouse) {
    this.willWritingFormData.spouse = data;
    this.commit();
  }

  /**
   * get children details.
   * @returns children details.
   */
  getChildInfo(): IChild[] {
    if (!this.willWritingFormData.children) {
      this.willWritingFormData.children = [] as IChild[];
    }
    return this.willWritingFormData.children;
  }

  /**
   * set children details.
   * @param data - children details.
   */
  setChildInfo(data: IChild) {
    this.willWritingFormData.children.push(data);
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
  setGuardianInfo(data: IGuardian) {
    this.willWritingFormData.guardian.push(data);
    this.commit();
  }

}
