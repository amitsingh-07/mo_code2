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
  private errorModal = {};
  private loading = {};

  verifyMobileForm: FormGroup;
  mobileNumber: any;
  mobileNumberVerifiedMessage: string;
  showCodeSentText: boolean;
  mobileNumberVerified: boolean;
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
    this.translate.get('VERIFY_MOBILE').subscribe((result: any) => {
      this.errorModal['title'] = result.ERROR_MODAL.ERROR_TITLE;
      this.errorModal['message'] = result.ERROR_MODAL.ERROR_MESSAGE;
      this.loading['verifying'] = result.LOADING.VERIFYING;
      this.loading['verified'] = result.LOADING.VERIFIED;
      this.loading['sending'] = result.LOADING.SENDING;
    });
  }

  ngOnInit() {
    this.progressModal = false;
    this.showCodeSentText = false;
    this.mobileNumberVerified = false;
    this.mobileNumber = this.signUpService.getMobileNumber();
    this.headerService.setHeaderVisibility(false);
    this.buildVerifyMobileForm();
  }

  /**
   * build verify mobile number form.
   */
  buildVerifyMobileForm() {
    this.verifyMobileForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.pattern(RegexConstants.OTP)]],
      otp2: ['', [Validators.required, Validators.pattern(RegexConstants.OTP)]],
      otp3: ['', [Validators.required, Validators.pattern(RegexConstants.OTP)]],
      otp4: ['', [Validators.required, Validators.pattern(RegexConstants.OTP)]],
      otp5: ['', [Validators.required, Validators.pattern(RegexConstants.OTP)]],
      otp6: ['', [Validators.required, Validators.pattern(RegexConstants.OTP)]]
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
    this.mobileNumberVerifiedMessage = this.loading['verifying'];
    this.signUpApiService.verifyOTP(otp).subscribe((data: any) => {
      if (data.responseMessage.responseCode === 6003) {
        this.mobileNumberVerified = true;
        this.mobileNumberVerifiedMessage = this.loading['verified'];
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
    this.mobileNumberVerifiedMessage = this.loading['sending'];
    this.signUpApiService.requestNewOTP().subscribe((data) => {
      this.progressModal = false;
      this.showCodeSentText = true;
    });
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
    if (currentElement.value && (nextElement !== undefined || nextElement !== 'undefined')) {
      nextElement.focus();
    }
  }

  /**
   * open invalid otp error modal.
   */
  openErrorModal() {
      this.progressModal = false;
      const error = {
        errorTitle : this.errorModal['title'],
        errorMessage: this.errorModal['message']
      };
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      ref.componentInstance.showErrorButton = true;
  }
}
