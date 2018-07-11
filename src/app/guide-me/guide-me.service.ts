import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GuideMeFormData } from './guide-me-form-data';
import { Profile } from './profile/profile';

@Injectable({
  providedIn: 'root'
})
export class GuideMeService {
  private guideMeFormData: GuideMeFormData = new GuideMeFormData();
  private isProfileFormValid: boolean ;
  private url = '../assets/profile.json';
  constructor(private http: HttpClient) { }
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
  getProfileList(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
