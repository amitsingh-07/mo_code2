import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAccountComponent implements OnInit {
  private pageTitle: string;
  private description: string;
  private countryCode = 65;
  private countryCodeOptions = [65, 63, 104];
  createAccountForm: FormGroup;
  signUpFormData: any;
  phoneNumber: number;
  firstName: string;
  lastName: string;

  constructor( private formBuilder: FormBuilder, private signUpService: SignUpService,
               private router: Router, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CREATE_ACCOUNT.TITLE');
      this.description = this.translate.instant('CREATE_ACCOUNT.DESCRIPTION');
     });
  }

  ngOnInit() {
    this.signUpFormData = this.signUpService.getRegDetails();
    this.createAccountForm = new FormGroup({
      countryCode: new FormControl(this.signUpFormData.countryCode),
      mobileNumber: new FormControl(this.signUpFormData.mobileNumber),
      firstName: new FormControl(this.signUpFormData.firstName),
      lastName: new FormControl(this.signUpFormData.lastName),
      email: new FormControl(this.signUpFormData.email)
    });
  }

  setCountryCode(value, i) {
    this.countryCode = value;
  }
}
