import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpApiService } from './../sign-up.api.service';
import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VerifyMobileComponent implements OnInit {
  private pageTitle: string;
  private subTitle: string;

  verifyMobileForm: FormGroup;
  showCodeSentText: boolean;
  mobileNumber: any;
  mobileNumberVerified: boolean;
  mobileNumberVerifiedMessage: string;
  progressModal: boolean;
  newCodeRequested: boolean;

  constructor(private formBuilder: FormBuilder,
              public headerService: HeaderService,
              private modal: NgbModal,
              private signUpApiService: SignUpApiService,
              private signUpService: SignUpService,
              private router: Router,
              private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.progressModal = false;
    this.showCodeSentText = false;
    this.mobileNumberVerified = false;
    this.mobileNumberVerifiedMessage = 'Verifying...';
    this.mobileNumber = this.signUpService.getMobileNumber();
    this.headerService.setHeaderVisibility(false);
    this.buildVerifyMobileForm();
  }

  /**
   * build verify mobile number form.
   */
  buildVerifyMobileForm() {
    this.verifyMobileForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.pattern('(?:[0-9])')]],
      otp2: ['', [Validators.required, Validators.pattern('(?:[0-9])')]],
      otp3: ['', [Validators.required, Validators.pattern('(?:[0-9])')]],
      otp4: ['', [Validators.required, Validators.pattern('(?:[0-9])')]],
      otp5: ['', [Validators.required, Validators.pattern('(?:[0-9])')]],
      otp6: ['', [Validators.required, Validators.pattern('(?:[0-9])')]]
    });
  }

  /**
   * verify user mobile number.
   */
  save(form: any) {
    if (form.valid) {
      let otp = '';
      for (const value of Object.keys(form.value)) {
        otp += form.value[value];
        if (value === 'otp6') {
          this.verifyOTP(otp);
        }
      }
    }
  }

  /**
   * verify user mobile number.
   * @param code - one time password.
   */
  verifyOTP(otp) {
    this.progressModal = true;
    this.signUpApiService.verifyOTP(otp).subscribe((data: any) => {
      if (data.responseMessage.responseCode === 6003) {
        this.mobileNumberVerified = true;
        this.mobileNumberVerifiedMessage = 'Mobile Verified!';
        this.signUpService.setResetCode(data.objectList[0].resetCode);
      } else {
        this.openErrorModal();
      }
    });
  }

  /**
   * request a new OTP.
   */
  requestNewCode() {
    this.progressModal = true;
    if (!this.newCodeRequested) {
      this.newCodeRequested = true;
      this.mobileNumberVerifiedMessage = 'Sending New OTP';
      this.signUpApiService.requestNewOTP().subscribe((data) => {
        this.progressModal = false;
        this.showCodeSentText = true;
        this.newCodeRequested = false;
      });
    }
  }

  /**
   * redirect to password creation page.
   */
  redirectToPasswordPage() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.PASSWORD]);
  }

  /**
   * redirect to create account page.
   */
  editNumber() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT, { editNumber: true}]);
  }

  /**
   * restrict to enter numeric value.
   * @param currentElement - current element to check numeric value.
   * @param nextElement - next elemet to focus.
   */
  onlyNumber(currentElement, nextElement) {
    const elementName = currentElement.getAttribute('formcontrolname');
    currentElement.value = currentElement.value.replace(RegexConstants.OnlyNumeric, '');
    this.verifyMobileForm.controls[elementName].setValue(currentElement.value);
    if (currentElement.value && nextElement) {
      nextElement.focus();
    }
  }

  /**
   * open invalid otp error modal.
   */
  openErrorModal() {
      this.progressModal = false;
      const error = {
        errorTitle : 'Incorrect OTP Code',
        errorMessage: 'You have keyed in an invalid OTP Code'
      };
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      ref.componentInstance.showErrorButton = true;
  }
}
