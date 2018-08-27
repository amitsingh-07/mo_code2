import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.scss']
})
export class VerifyMobileComponent implements OnInit {
  pageTitle: string;
  subTitle: string;
  countryCode: number;
  phoneNumber: number;
  verifyCode = [0, 0, 0, 0, 0, 0];
  verifyCodeArray: FormArray;
  verifyMobileForm: FormGroup;
  signUpFormData: any;

  constructor(private formBuilder: FormBuilder, private signUpService: SignUpService,
              private router: Router, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('VERIFY_MOBILE.TITLE');
      this.subTitle = this.translate.instant('VERIFY_MOBILE.SUB_TITLE');
     });
    this.getPhoneNumberSum();
  }

  ngOnInit() {
    this.signUpFormData = this.signUpService.getRegDetails();
    this.verifyMobileForm = new FormGroup({
      verifyMobile: new FormControl(this.signUpFormData.verifyMobile),
    });
  }

  getPhoneNumberSum() {
    // this.countryCode = this.signUpService.getCountryCode().toString();
    // this.phoneNumber = this.signUpService.getPhoneNumber().toString();
    this.countryCode = 65;
    this.phoneNumber = 86065841;
  }
  
}
