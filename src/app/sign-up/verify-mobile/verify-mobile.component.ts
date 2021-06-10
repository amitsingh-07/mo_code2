
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { FooterService } from '../../shared/footer/footer.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { CustomErrorHandlerService } from '../../shared/http/custom-error-handler.service';
import {
  EditMobileNumberComponent
} from '../../shared/modal/edit-mobile-number/edit-mobile-number.component';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { Util } from '../../shared/utils/util';
import { WillWritingService } from '../../will-writing/will-writing.service';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { appConstants } from './../../../app/app.constants';
import { AppService } from './../../../app/app.service';
import { DirectService } from './../../direct/direct.service';
import { GuideMeService } from './../../guide-me/guide-me.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { IEnquiryUpdate } from '../signup-types';
import { COMPREHENSIVE_ROUTE_PATHS } from './../../comprehensive/comprehensive-routes.constants';
import { InvestmentAccountService } from './../../investment/investment-account/investment-account-service';
import { WILL_WRITING_ROUTE_PATHS } from '../../will-writing/will-writing-routes.constants';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { StateStoreService } from './../../shared/Services/state-store.service';
import { ApiService } from '../../shared/http/api.service';
import { Formatter } from '../../shared/utils/formatter.util';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment/investment-account/investment-account-routes.constants';
import { InvestmentCommonService } from '../../investment/investment-common/investment-common.service';
import { HubspotService } from './../../shared/analytics/hubspot.service';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class VerifyMobileComponent implements OnInit, OnDestroy {
  private errorModal = {};
  private loading = {};

  verifyMobileForm: FormGroup;
  mobileNumber: any;
  mobileNumberVerifiedMessage: string;
  showCodeSentText = false;
  mobileNumberVerified: boolean;
  progressModal: boolean;
  newCodeRequested: boolean;
  editProfile: boolean;
  two2faAuth: boolean;
  fromLoginPage: string;
  finlitEnabled = false;
  accountCreationPage = false;
  roleTwoFAEnabled: boolean;
  redirectAfterLogin = '';

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    private modal: NgbModal,
    public footerService: FooterService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private router: Router,
    private translate: TranslateService,
    private errorHandler: CustomErrorHandlerService,
    public authService: AuthenticationService,
    private selectedPlansService: SelectedPlansService,
    private willWritingService: WillWritingService,
    private directService: DirectService,
    private guidemeService: GuideMeService,
    private route: ActivatedRoute,
    private appService: AppService,
    private investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService,
    private stateStoreService: StateStoreService,
    private apiService: ApiService,
    private hubspotService: HubspotService) {    
    this.roleTwoFAEnabled = this.authService.isSignedUserWithRole(SIGN_UP_CONFIG.ROLE_2FA);
    this.translate.use('en');
    this.translate.get('VERIFY_MOBILE').subscribe((result: any) => {
      this.errorModal['title'] = result.ERROR_MODAL.ERROR_TITLE;
      this.errorModal['message'] = result.ERROR_MODAL.ERROR_MESSAGE;
      this.errorModal['expiredTitle'] = result.EXPIRED_ERROR_MODAL.ERROR_TITLE;
      this.errorModal['expiredMessage'] = result.EXPIRED_ERROR_MODAL.ERROR_MESSAGE;
      this.loading['verifying'] = result.LOADING.VERIFYING;
      this.loading['verified'] = result.LOADING.VERIFIED;
      this.loading['sending'] = result.LOADING.SENDING;
      this.loading['verified2fa'] = result.LOADING.VERIFIED2FA;
    });
    this.translate.get('ERROR').subscribe((results: any) => {
      this.authService.get2faSendErrorEvent.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
        if (data) {
          const error2fa = {
            title: results.SEND_2FA_FAILED.TITLE,
            subtitle: results.SEND_2FA_FAILED.SUB_TITLE,
            button: results.SEND_2FA_FAILED.BUTTON,
          };
          this.authService.openErrorModal(error2fa.title, error2fa.subtitle, error2fa.button);
          if(this.roleTwoFAEnabled) {
            if (this.signUpService.getUserType() === appConstants.USERTYPE.FINLIT) {
              this.router.navigate([SIGN_UP_ROUTE_PATHS.FINLIT_LOGIN]);
            } else {
              this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
            }
          } else {
            this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
          }
        }
      });
    });

  }

  ngOnInit() {
    this.progressModal = false;
    this.mobileNumberVerified = false;
    this.editProfile = this.signUpService.getAccountInfo().editContact;
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.buildVerifyMobileForm();
    this.fromLoginPage = this.signUpService.getFromLoginPage();
    if (this.fromLoginPage) {
      this.mobileNumber = {
        code: '+65',
        number: this.signUpService.getUserMobileNo()
      };
    } else {
      this.mobileNumber = this.signUpService.getMobileNumber();
    }
    this.two2faAuth = this.authService.get2faVerifyAllowed();
    if (this.route.snapshot.data[0]) {
      this.finlitEnabled = this.route.snapshot.data[0]['finlitEnabled'];
      this.accountCreationPage = (this.route.snapshot.data[0]['twoFactorEnabled'] === SIGN_UP_CONFIG.VERIFY_MOBILE.TWO_FA);
      if(!this.roleTwoFAEnabled) {
        this.appService.clearJourneys();
        this.appService.clearPromoCode();
      } else {
        this.signUpService.removeFromLoginPage();
        this.signUpService.removeFromMobileNumber();
      }
    }
  }

  ngOnDestroy() {
    if(this.authService.isSignedUserWithRole(SIGN_UP_CONFIG.ROLE_2FA)) {
      this.authService.clearTokenID();
      this.signUpService.removeFromLoginPage();
      this.signUpService.removeFromMobileNumber();
    }
    this.authService.set2faVerifyAllowed(false);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
          if (this.authService.get2faVerifyAllowed()) {
            if(this.roleTwoFAEnabled) {
              this.validate2faLogin(otp);
            } else if(this.authService.isSignedUser()){
              this.verify2FA(otp);
            }
          } else {
            this.verifyOTP(otp);
          }
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
      } else if (data.responseMessage.responseCode === 5007 || data.responseMessage.responseCode === 5009) {
        const title = data.responseMessage.responseCode === 5007 ? this.errorModal['title'] : this.errorModal['expiredTitle'];
        const message = data.responseMessage.responseCode === 5007 ? this.errorModal['message'] : this.errorModal['expiredMessage'];
        const showErrorButton = data.responseMessage.responseCode === 5007 ? true : false;
        this.openErrorModal(title, message, showErrorButton);
      } else {
        this.progressModal = false;
        this.errorHandler.handleCustomError(data, true);
      }
    });
  }

  /**
   * verify 2fa mobile number
   * @param code - 2fa otp.
   */
  verify2FA(otp) {
    this.progressModal = true;
    this.mobileNumberVerifiedMessage = this.loading['verifying'];
    this.authService.doValidate2fa(otp).subscribe((data: any) => {
      if (data.responseMessage.responseCode === 6011) {
        this.mobileNumberVerified = true;
        this.authService.set2FAToken(data.responseMessage.responseCode);
        this.mobileNumberVerifiedMessage = this.loading['verified2fa'];
        this.authService.setFromJourney(SIGN_UP_ROUTE_PATHS.EDIT_PROFILE, false);
      } else if (data.responseMessage.responseCode === 5123 || data.responseMessage.responseCode === 5009) {
        const title = data.responseMessage.responseCode === 5123 ? this.errorModal['title'] : this.errorModal['expiredTitle'];
        const message = data.responseMessage.responseCode === 5123 ? this.errorModal['message'] : this.errorModal['expiredMessage'];
        this.openErrorModal(title, message, false);
      } else {
        this.progressModal = false;
        this.errorHandler.handleCustomError(data, true);
      }
    });
  }

  /**
   * request a new OTP.
   */
  requestNewCode() {
    this.progressModal = true;
    if (this.authService.get2faVerifyAllowed()) {
      this.requestNew2faOTP();
    } else {
      this.requestNewVerifyOTP();
    }
  }

    /**
   * request a new OTP though Email. 
     */
    
  requestEmailOTP() {
    const getAccountInfo = this.signUpService.getAccountInfo();
    const journeyType = this.authService.get2faVerifyAllowed() ? SIGN_UP_CONFIG.VERIFY_MOBILE.TWO_FA : getAccountInfo.editContact ? SIGN_UP_CONFIG.VERIFY_MOBILE.UPDATE_CONTACT : SIGN_UP_CONFIG.VERIFY_MOBILE.SIGN_UP;
    this.signUpApiService.requestEmailOTP(journeyType, getAccountInfo).subscribe((data) => {
      this.verifyMobileForm.reset();
      this.progressModal = false;
      this.showCodeSentText = true;
    });
  }
 
  requestNewVerifyOTP() {
    this.signUpApiService.requestNewOTP(this.editProfile).subscribe((data) => {
      this.verifyMobileForm.reset();
      this.progressModal = false;
      this.showCodeSentText = true;
    });
  }
  /** 
   * request a new 2fa OTP
   */
  requestNew2faOTP() {
    this.progressModal = true;
    this.mobileNumberVerifiedMessage = this.loading['sending'];
    if(this.roleTwoFAEnabled) {
      this.authService.send2faRequestLogin().subscribe((data) => {
        this.verifyMobileForm.reset();
        this.progressModal = false;
        this.showCodeSentText = true;
      });
    } else if(this.authService.isSignedUser()){
      this.authService.send2faRequest().subscribe((data) => {
        this.verifyMobileForm.reset();
        this.progressModal = false;
        this.showCodeSentText = true;
      });
    }
  }

  /**
   * redirect to password creation page.
   */
  redirectToPasswordPage() {
    if(this.authService.get2faVerifyAllowed() && this.roleTwoFAEnabled) {
      if(this.redirectAfterLogin === appConstants.JOURNEY_TYPE_COMPREHENSIVE) {
        this.loaderService.showLoader({ title: 'Loading', autoHide: false });
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.ROOT], { skipLocationChange: true });
      } else if (this.redirectAfterLogin === appConstants.JOURNEY_TYPE_INVESTMENT) {
          this.investmentCommonService.redirectToInvestmentFromLogin(this.authService.getEnquiryId());
      } else {
        this.router.navigate([this.redirectAfterLogin]);
      }
    } else {
      const redirect_url = this.signUpService.getRedirectUrl();
      const journeyType = this.appService.getJourneyType();
      if (journeyType) {
        if (journeyType === appConstants.JOURNEY_TYPE_COMPREHENSIVE) {
          this.sendWelcomeEmail();
        }
        this.resendEmailVerification();
      } else if (redirect_url) {
        // Do a final redirect
        this.signUpService.clearRedirectUrl();
        const brokenRoute = Util.breakdownRoute(redirect_url);
        this.router.navigate([brokenRoute.base], {
          fragment: brokenRoute.fragments != null ? brokenRoute.fragments : null,
          preserveFragment: true,
          queryParams: brokenRoute.params != null ? brokenRoute.params : null,
          queryParamsHandling: 'merge',
        });
      } else {
        this.resendEmailVerification();
      }
    }
  }

  sendWelcomeEmail() {
    const mobileNo = this.mobileNumber.number.toString();
    this.signUpApiService.sendWelcomeEmail(mobileNo, false).subscribe((data) => { });
  }

  resendEmailVerification() {
    const mobileNo = this.mobileNumber.number.toString();
    this.signUpApiService.resendEmailVerification(mobileNo, false).subscribe((data) => {
      if (data.responseMessage.responseCode === 6007) {
        this.navbarService.logoutUser();
        this.signUpService.clearData();
        this.selectedPlansService.clearData();
        this.willWritingService.clearServiceData();
        this.directService.clearServiceData();
        this.guidemeService.clearServiceData();
        if (this.signUpService.getUserMobileNo() || this.fromLoginPage) {
          this.signUpService.removeFromLoginPage();
        }
        if (this.finlitEnabled) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.ACCOUNT_CREATED_FINLIT]);
        } else {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.ACCOUNT_CREATED]);
        }

      }
    });
  }

  /**
   * redirect to create account page.
   */
  editNumber() {
    if (this.editProfile) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_USER_ID]);
    } else {
      const ref = this.modal.open(EditMobileNumberComponent, {
        centered: true, backdrop: 'static',
        keyboard: false
      });
      ref.componentInstance.existingMobile = this.mobileNumber.number.toString();
      ref.componentInstance.updateMobileNumber.subscribe((mobileNo) => {
        this.signUpApiService.editMobileNumber(mobileNo).subscribe((data) => {
          ref.close();
          if (data.responseMessage.responseCode === 6000) {
            this.mobileNumber.number = mobileNo.toString();
            this.signUpService.updateMobileNumber(this.mobileNumber.code,
              mobileNo.toString());
            if (data.objectList[0] && data.objectList[0].customerRef) {
              this.signUpService.setCustomerRef(data.objectList[0].customerRef);
            }
          } else {
            const Modalref = this.modal.open(ErrorModalComponent, { centered: true });
            Modalref.componentInstance.errorMessage = data.responseMessage.responseDescription;
          }
        });
      });
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

  validate2faLogin(otp) {
    let enqId = -1;
    let journeyType = this.appService.getJourneyType();
    if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_WILL_WRITING &&
      this.willWritingService.getWillCreatedPrelogin()) {
      enqId = this.willWritingService.getEnquiryId();
    } else if (this.authService.getEnquiryId()) {
      enqId = Number(this.authService.getEnquiryId());
    } else if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT ||
      this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_GUIDED) {
      const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
      if (insuranceEnquiry && ( (insuranceEnquiry.plans && insuranceEnquiry.plans.length > 0) || (insuranceEnquiry.enquiryProtectionTypeData && insuranceEnquiry.enquiryProtectionTypeData.length > 0) )) {
        journeyType = (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT) ?
        appConstants.INSURANCE_JOURNEY_TYPE.DIRECT : appConstants.INSURANCE_JOURNEY_TYPE.GUIDED;
        enqId = insuranceEnquiry.enquiryId;
      }
    }
    
    // If the journeyType is not set, default it to 'direct'
    if (Util.isEmptyOrNull(journeyType)) {
      journeyType = appConstants.JOURNEY_TYPE_DIRECT;
    }

    journeyType = journeyType.toLowerCase();

    var userEmail = '';
    this.progressModal = true;
    this.mobileNumberVerifiedMessage = this.loading['verifying'];
    if (window.sessionStorage && sessionStorage.getItem('email')) {
      userEmail = sessionStorage.getItem('email');
    }
    this.authService.doValidate2faLogin(otp, userEmail, journeyType, enqId  ).subscribe((data: any) => {
      if (data.responseMessage.responseCode  >= 6000) {
        this.mobileNumberVerified = true;
        this.mobileNumberVerifiedMessage = this.loading['verified2fa'];
        
        this.progressModal = false;
        // Pulling Customer information to log on Hubspot
        this.signUpApiService.getUserProfileInfo().subscribe((data) => {
          let userInfo = data.objectList;
          this.hubspotService.registerEmail(userInfo.emailAddress);
          this.hubspotService.registerPhone(userInfo.mobileNumber);
          const hsPayload = [
            {
              name: "email",
              value: userInfo.emailAddress
            },
            {
              name: "phone",
              value: userInfo.mobileNumber
            },
            {
              name: "firstname",
              value: userInfo.firstName
            },
            {
              name: "lastname",
              value: userInfo.lastName
            }];
          this.hubspotService.submitLogin(hsPayload);
        });

        this.investmentCommonService.clearAccountCreationActions();
        try {
          if (data.objectList[0].customerId) {
            this.appService.setCustomerId(data.objectList[0].customerId);
          }
        } catch (e) {
          console.log(e);
        }
        const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
        if (this.checkInsuranceEnquiry(insuranceEnquiry)) {
          this.updateInsuranceEnquiry(insuranceEnquiry, data);
        } else {
          this.goToNext();
        }

      } else if (data.responseMessage.responseCode === 5123 || data.responseMessage.responseCode === 5009) {
        const title = data.responseMessage.responseCode === 5123 ? this.errorModal['title'] : this.errorModal['expiredTitle'];
        const message = data.responseMessage.responseCode === 5123 ? this.errorModal['message'] : this.errorModal['expiredMessage'];
        this.openErrorModal(title, message, false);
      } else {
        this.progressModal = false;
        this.errorHandler.handleCustomError(data, true);
      }
    });

  }

  checkInsuranceEnquiry(insuranceEnquiry): boolean {
    return ((this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT ||
      this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_GUIDED) &&
      ((insuranceEnquiry.plans && insuranceEnquiry.plans.length > 0)
        || (insuranceEnquiry.enquiryProtectionTypeData && insuranceEnquiry.enquiryProtectionTypeData.length > 0)));
  }

  updateInsuranceEnquiry(insuranceEnquiry, data) {
    const journeyType = (insuranceEnquiry.journeyType === appConstants.JOURNEY_TYPE_DIRECT) ?
      appConstants.INSURANCE_JOURNEY_TYPE.DIRECT : appConstants.INSURANCE_JOURNEY_TYPE.GUIDED;
    const payload: IEnquiryUpdate = {
      customerId: data.objectList[0].customerId || data.objectList[0].customerRef,
      enquiryId: Formatter.getIntValue(insuranceEnquiry.enquiryId),
      selectedProducts: insuranceEnquiry.plans,
      enquiryProtectionTypeData: insuranceEnquiry.enquiryProtectionTypeData,
      journeyType: journeyType
    };
    this.apiService.updateInsuranceEnquiry(payload).subscribe(() => {
        this.selectedPlansService.clearData();
        this.stateStoreService.clearAllStates();
        this.redirectAfterLogin = 'email-enquiry/success';
        this.progressModal = true;
        this.loaderService.hideLoader();
    });
  }

  goToNext() {
    const investmentRoutes = [INVESTMENT_ACCOUNT_ROUTE_PATHS.ROOT, INVESTMENT_ACCOUNT_ROUTE_PATHS.START];
    const redirect_url = this.signUpService.getRedirectUrl();
    const journeyType = this.appService.getJourneyType();
    if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_COMPREHENSIVE) {
      this.getUserProfileAndNavigate(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
    } else if (redirect_url && investmentRoutes.indexOf(redirect_url) >= 0) {
      this.signUpService.clearRedirectUrl();
      this.getUserProfileAndNavigate(appConstants.JOURNEY_TYPE_INVESTMENT);
    } else if (journeyType === appConstants.JOURNEY_TYPE_WILL_WRITING && this.willWritingService.getWillCreatedPrelogin()) {
      this.getUserProfileAndNavigate(appConstants.JOURNEY_TYPE_WILL_WRITING);
    } else {
      this.redirectAfterLogin = SIGN_UP_ROUTE_PATHS.DASHBOARD;
      this.progressModal = true;
      this.loaderService.hideLoader();
    }
  }

  getUserProfileAndNavigate(journeyType) {
    this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
      if (userInfo.responseMessage.responseCode < 6000) {
        if (
          userInfo.objectList &&
          userInfo.objectList.length &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors[0].msg
          );
        } else if (userInfo.responseMessage && userInfo.responseMessage.responseDescription) {
          const errorResponse = userInfo.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.investmentAccountService.showGenericErrorModal();
        }
      } else {
        this.signUpService.setUserProfileInfo(userInfo.objectList);
        if (journeyType === appConstants.JOURNEY_TYPE_COMPREHENSIVE) {
          this.redirectAfterLogin = appConstants.JOURNEY_TYPE_COMPREHENSIVE;
          this.progressModal = true;
          this.loaderService.hideLoader();
        } else if (journeyType === appConstants.JOURNEY_TYPE_INVESTMENT) {
          this.redirectAfterLogin = appConstants.JOURNEY_TYPE_INVESTMENT;
          this.progressModal = true;
          this.loaderService.hideLoader();
        } else if (journeyType === appConstants.JOURNEY_TYPE_WILL_WRITING) {
          this.redirectAfterLogin = WILL_WRITING_ROUTE_PATHS.VALIDATE_YOUR_WILL;
          this.progressModal = true;
          this.loaderService.hideLoader();
        } else {
          this.redirectAfterLogin = SIGN_UP_ROUTE_PATHS.DASHBOARD;
          this.progressModal = true;
          this.loaderService.hideLoader();
        }
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  
  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }
  
}
