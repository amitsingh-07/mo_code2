import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
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

  constructor(private formBuilder: FormBuilder,
              private modal: NgbModal,
              private signUpService: SignUpService,
              private router: Router,
              private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('VERIFY_MOBILE.TITLE');
      this.subTitle = this.translate.instant('VERIFY_MOBILE.SUB_TITLE');
     });
  }

  ngOnInit() {
    this.progressModal = false;
    this.showCodeSentText = false;
    this.mobileNumberVerified = false;
    this.mobileNumberVerifiedMessage = 'Verifying...';
    this.mobileNumber = this.signUpService.getMobileNumber();
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
      let otp;
      for (const value of Object.keys(form.value)) {
        otp += form.value[value];
        if (value === 'otp6') {
          this.openErrorModal();
          //this.verifyMobileNumber(otp);
        }
      }
    }
  }

  /**
   * verify user mobile number.
   * @param code - one time password.
   */
  verifyMobileNumber(otp) {
    this.progressModal = true;
    this.signUpService.verifyOneTimePassword(otp).subscribe((data) => {
      this.mobileNumberVerified = true;
      this.mobileNumberVerifiedMessage = 'Mobile Verified!';
      this.openErrorModal();
    });
  }

  /**
   * request a new OTP.
   */
  requestNewCode(el) {
    el.preventDefault();
    this.signUpService.requestOneTimePassword().subscribe((data) => {
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
  editNumber(el) {
    el.preventDefault();
    this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
  }

  /**
   * restrict to enter numeric value.
   * @param currentElement - current element to check numeric value.
   * @param nextElement - next elemet to focus.
   */
  onlyNumber(currentElement, nextElement) {
    const elementName = currentElement.getAttribute('formcontrolname');
    currentElement.value = currentElement.value.replace(/[^0-9]/g, '');
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
