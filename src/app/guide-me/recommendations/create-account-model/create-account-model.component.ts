import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { GuideMeService } from '../../guide-me.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { GuideMeApiService } from '../../guide-me.api.service';
import { SelectedPlansService } from '../../../shared/Services/selected-plans.service';

@Component({
  selector: 'app-create-account-model',
  templateUrl: './create-account-model.component.html',
  styleUrls: ['./create-account-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountModelComponent implements OnInit, AfterViewInit {
  @Input() data;
  @ViewChild("mobileNumber") _el: ElementRef;
  enquiryForm: FormGroup;
  formSubmitted = false;
  invalidEmail = false;
  invalidCaptcha = false;
  captchaSrc: any = '';
  showCaptcha: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    public signUpService: SignUpService,
    public guideMeService: GuideMeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public authService: AuthenticationService,
    public guideMeApiService: GuideMeApiService,
    public selectedPlansService: SelectedPlansService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeModal.dismiss();
      }
    });
  }

  ngOnInit() {
    this.enquiryForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
      lastName: ['', [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.pattern(RegexConstants.MobileNumber)],
      confirmEmail: [''],
      acceptMarketingEmails: [''],
      contactViaMobile: [''],
      captchaValue: ['']
    }, { validator: this.validateMatchEmail() });
    this.setValidatorMobileNumber();
    setTimeout(() => {
      this.enquiryForm.get('contactViaMobile').setValue(false);
    }, 300);
  }

  next(page) {
    this.activeModal.close();
    if (page === 'signup') {
      this.signUpService.clearData();
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
    }
    if (page === 'login') {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    }
  }

  ngAfterViewInit() {
    if (this.signUpService.getCaptchaShown()) {
      this.setCaptchaValidator();
    }
  }

  setCaptchaValidator() {
    this.showCaptcha = true;
    this.enquiryForm.controls['captchaValue'].setValidators([Validators.required]);
    this.refreshCaptcha();
  }

  refreshCaptcha() {
    this.captchaSrc = this.authService.getCaptchaUrl();
    this.changeDetectorRef.detectChanges();
  }

  resetEnquiryForm() {
    this.enquiryForm.controls['captchaValue'].reset();
    this.refreshCaptcha();
  }

  sendEnquiry(form: any) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
    this.formSubmitted = true;
    this.invalidEmail = false;
    this.invalidCaptcha = false;
    this.guideMeApiService.enquiryByEmail(form.value).subscribe((data) => {
      this.formSubmitted = false;
      if (data.responseMessage.responseCode === 6000) {
        this.selectedPlansService.clearData();
        this.signUpService.removeCaptchaSessionId();
        this.authService.clearAuthDetails();
        this.router.navigate(['email-enquiry/success']);
      } else if (data.responseMessage.responseCode === 5006) {
        this.invalidEmail = true;
        this.signUpService.setCaptchaCount();
        this.enquiryForm.controls['captchaValue'].reset();
        if (this.signUpService.getCaptchaCount() >= 2) {
          this.signUpService.setCaptchaShown();
          this.setCaptchaValidator();
        }
      } else if (data.responseMessage.responseCode === 5016) {
        this.invalidCaptcha = true;
        this.resetEnquiryForm();
      }
    });
  }

  /**
   * validate confirm email.
   */
  private validateMatchEmail() {
    return (group: FormGroup) => {
      const emailInput = group.controls['email'];
      const emailConfirmationInput = group.controls['confirmEmail'];

      // Confirm E-mail
      if (!emailConfirmationInput.value) {
        emailConfirmationInput.setErrors({ required: true });
      } else if (emailInput.value && emailInput.value.toLowerCase() !== emailConfirmationInput.value.toLowerCase()) {
        emailConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        emailConfirmationInput.setErrors(null);
      }
    };
  }

  setValidatorMobileNumber() {
    const mobileNumberControl = this.enquiryForm.get('mobileNumber');
    const contactViaMobileCtrl = this.enquiryForm.get('contactViaMobile');
    contactViaMobileCtrl.valueChanges
      .subscribe((checked) => {
        if (checked) {
          mobileNumberControl.setValidators([Validators.required, Validators.pattern(RegexConstants.MobileNumber)]);
          this._el.nativeElement.focus();
        } else {
          mobileNumberControl.setValidators([Validators.pattern(RegexConstants.MobileNumber)]);
        }
        mobileNumberControl.updateValueAndValidity();
      });
  }

}
