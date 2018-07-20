import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiService } from './../shared/http/api.service';
import { FormError } from './get-started/get-started-form/form-error';
import { UserInfo } from './get-started/get-started-form/user-info';
import { GuideMeFormData } from './guide-me-form-data';
import { Profile } from './profile/profile';
import { ProtectionNeeds } from './protection-needs/protection-needs';

@Injectable({
  providedIn: 'root'
})
export class GuideMeService {
  private guideMeFormData: GuideMeFormData = new GuideMeFormData();
  private formError: any = new FormError();
  private isProfileFormValid: boolean ;
  private isprotectionNeedFormValid: boolean;

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getProfile(): Profile {
    const myProfile: Profile = {
      myProfile: this.guideMeFormData.myProfile
    };
    return myProfile;
  }

  setProfile(data: Profile) {
    this.isProfileFormValid = true;
    this.guideMeFormData.myProfile = data.myProfile;
  }
  getUserInfo(): UserInfo {
    const userInfoForm: UserInfo = {
      gender: this.guideMeFormData.gender,
      dob: this.guideMeFormData.dob,
      customDob: this.guideMeFormData.customDob,
      smoker: this.guideMeFormData.smoker,
      dependent: this.guideMeFormData.dependent
    };
    return userInfoForm;
  }

  setUserInfo(data: UserInfo) {
    this.isProfileFormValid = true;
    this.guideMeFormData.gender = data.gender;
    this.guideMeFormData.dob = data.dob;
    this.guideMeFormData.smoker = data.smoker;
    this.guideMeFormData.customDob = data.customDob;
    this.guideMeFormData.dependent = data.dependent;

  }

  getGuideMeFormData(): GuideMeFormData {
    // Return the entire GuideMe Form Data
    return this.guideMeFormData;
  }

  getProfileList() {
    return this.apiService.getProfileList();
  }

  getProtectionNeeds(): ProtectionNeeds {
    const protectionNeedData: ProtectionNeeds = {
      protectionNeedData: this.guideMeFormData.protectionNeedData
    };
    return protectionNeedData;
  }

  setProtectionNeeds(data) {
      this.isprotectionNeedFormValid = true;
      this.guideMeFormData.protectionNeedData = data;
  }
  getProtectionNeedsList() {
    const userInfoForm: any = {
      profileId: this.guideMeFormData.myProfile,
      birthDate: this.guideMeFormData.customDob
    };
    return this.apiService.getProtectionNeedsList(userInfoForm);
  }

  currentFormError(form) {
    const invalid = [];
    const invalidFormat = [];
    const controls = form.controls;
    for (const name in controls) {
         if (controls[name].invalid) {
           invalid.push(name);
           invalidFormat.push(Object.keys(controls[name]['errors']));
         }
       }
    return this.getFormError(invalid[0], invalidFormat[0][0]);
  }

  getFormError( formCtrlName: string, validation: string): string {
    return this.formError.formFieldErrors[formCtrlName][validation];
}
}
