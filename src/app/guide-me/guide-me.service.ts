import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApiService } from './../shared/http/api.service';
import { GuideMeFormData } from './guide-me-form-data';
import { Profile } from './profile/profile';

@Injectable({
  providedIn: 'root'
})
export class GuideMeService {
  private guideMeFormData: GuideMeFormData = new GuideMeFormData();
  private isProfileFormValid: boolean ;

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

  getGuideMeFormData(): GuideMeFormData {
    // Return the entire GuideMe Form Data
    return this.guideMeFormData;
  }

  getProfileList() {
    return this.apiService.getProfileList();
  }
}
