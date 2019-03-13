import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { FooterService } from './../../shared/footer/footer.service';
import { CustomErrorHandlerService } from './../../shared/http/custom-error-handler.service';
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
  isRetryEnabled: boolean;
  retryDuration = 30; // in seconds
  retrySecondsLeft;
  editProfile: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    private modal: NgbModal,
    public footerService: FooterService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private router: Router,
    private translate: TranslateService, private errorHandler: CustomErrorHandlerService) {
    this.translate.use('en');
    this.translate.get('VERIFY_MOBILE').subscribe((result: any) => {
      this.errorModal['title'] = result.ERROR_MODAL.ERROR_TITLE;
      this.errorModal['message'] = result.ERROR_MODAL.ERROR_MESSAGE;
      this.errorModal['expiredMessage'] = result.EXPIRED_ERROR_MODAL.ERROR_MESSAGE;
      this.loading['verifying'] = result.LOADING.VERIFYING;
      this.loading['verified'] = result.LOADING.VERIFIED;
      this.loading['sending'] = result.LOADING.SENDING;
    });
  }

  ngOnInit() {
    this.progressModal = false;
    this.showCodeSentText = false;
    this.mobileNumberVerified = false;
    this.editProfile = this.signUpService.getAccountInfo().editContact;
    this.mobileNumber = this.signUpService.getMobileNumber();
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.buildVerifyMobileForm();
    this.startRetryCounter();
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
      const otpArr = [];
      for (const value of Object.keys(form.value)) {
        otpArr.push(form.value[value]);
        if (value === 'otp6') {
          const otp = otpArr.join('');
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
    this.signUpApiService.verifyOTP(otp, this.editProfile).subscribe((data: any) => {
      if (data.responseMessage.responseCode === 6003) {
        this.mobileNumberVerified = true;
        this.mobileNumberVerifiedMessage = this.loading['verified'];
        this.signUpService.setResetCode(data.objectList[0].resetCode);
      } else if (data.responseMessage.responseCode === 5007 || data.responseMessage.responseCode === 5009) {
        const title = data.responseMessage.responseCode === 5007 ? this.errorModal['title'] : '';
        const message = data.responseMessage.responseCode === 5007 ? this.errorModal['message'] : this.errorModal['expiredMessage'];
        const showErrorButton = data.responseMessage.responseCode === 5007 ? true : false;
        this.openErrorModal(title, message, showErrorButton);
      } else {
        this.progressModal = false;
        this.errorHandler.handleCustomError(data, true);
        this.startRetryCounter();
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
      this.verifyMobileForm.reset();
      this.progressModal = false;
      this.showCodeSentText = true;
      this.startRetryCounter();
    });
  }

  /**
   * redirect to password creation page.
   */
  redirectToPasswordPage() {
    const redirect_url = this.signUpService.getRedirectUrl();
    if (redirect_url && redirect_url === SIGN_UP_ROUTE_PATHS.EDIT_PROFILE) {
      this.signUpService.clearRedirectUrl();
      this.router.navigate([SIGN_UP_ROUTE_PATHS.ACCOUNT_UPDATED]);
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.PASSWORD]);
    }
  }

  /**
   * redirect to create account page.
   */
  editNumber() {
    if (this.editProfile) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_USER_ID]);
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT, { editNumber: true }]);
    }
  }

  /**
   * restrict to enter numeric value.
   * @param currentElement - current element to check numeric value.
   * @param nextElement - next elemet to focus.
   */
  onlyNumber(currentElement, nextElement) {
    const elementName = currentElement.getAttribute('formcontrolname');
    currentElement.value = currentElement.value.replace(RegexConstants.OnlyNumeric, '');
    if (currentElement.value.length > 1) {
      currentElement.value = currentElement.value.charAt(0);
    }
    this.verifyMobileForm.controls[elementName].setValue(currentElement.value);
    if (currentElement.value && nextElement !== undefined && nextElement !== 'undefined') {
      nextElement.focus();
    }
  }

  /**
   * open invalid otp error modal.
   * @param title - title for error modal.
   * @param message - error description for error modal time password.
   * @param showErrorButton - show try again button or not.
   */
  openErrorModal(title, message, showErrorButton) {
    this.progressModal = false;
    const error = {
      errorTitle: title,
      errorMessage: message
    };
    const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'otp-error-modal' });
    ref.componentInstance.errorTitle = error.errorTitle;
    ref.componentInstance.errorMessage = error.errorMessage;
    ref.componentInstance.showErrorButton = showErrorButton;
    ref.result.then(() => {
      this.verifyMobileForm.reset();
    }).catch((e) => {
      this.verifyMobileForm.reset();
    });
  }

  /**
   * Run Animated counter for 30s.
   */
  startRetryCounter() {
    this.isRetryEnabled = false;
    this.retrySecondsLeft = this.retryDuration;
    const self = this;
    const downloadTimer = setInterval(() => {
      --self.retrySecondsLeft;
      if (self.retrySecondsLeft <= 0) {
        clearInterval(downloadTimer);
        this.isRetryEnabled = true;
      }
    }, 1000);
  }

}
