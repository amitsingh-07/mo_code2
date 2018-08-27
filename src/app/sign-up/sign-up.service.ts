import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './../shared/http/api.service';

import { SignUpFormData } from './sign-up-form-data';

@Injectable({
  providedIn: 'root'
})

export class SignUpService {

  private signUpFormData: SignUpFormData = new SignUpFormData();

  constructor(private http: HttpClient, private apiService: ApiService) { }
  getCountryCode(): number {
    return this.signUpFormData.countryCode;
  }
  getPhoneNumber(): number {
    return this.signUpFormData.mobileNumber;
  }
  getRegDetails(): any {
    return this.signUpFormData;
  }

  getVerificationCode(): string {
    return this.apiService.requestVerifyMobile();
  }
}
