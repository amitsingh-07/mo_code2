import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from '../../shared/http/api.service';
import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up.service';
import { WillWritingService } from '../../will-writing/will-writing.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment/investment-account/investment-account-routes.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { COMPREHENSIVE_ROUTE_PATHS } from 'src/app/comprehensive/comprehensive-routes.constants';
import { WILL_WRITING_ROUTE_PATHS } from 'src/app/will-writing/will-writing-routes.constants';
import { InvestmentAccountService } from './../../investment/investment-account/investment-account-service';
import { SignUpApiService } from '../sign-up.api.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { InvestmentCommonService } from '../../investment/investment-common/investment-common.service';
import { HubspotService } from './../../shared/analytics/hubspot.service';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { IEnquiryUpdate } from '../signup-types';
import { Formatter } from '../../shared/utils/formatter.util';
import { StateStoreService } from './../../shared/Services/state-store.service';
import { ModelWithButtonComponent } from './../../shared/modal/model-with-button/model-with-button.component';
import { SingpassApiService } from './../../singpass/singpass.api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService,
    private appService: AppService,
    private signUpService: SignUpService,
    private willWritingService: WillWritingService,
    private router: Router,
    private modal: NgbModal,
    private signUpApiService: SignUpApiService,
    private investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService,
    private hubspotService: HubspotService,
    private selectedPlansService: SelectedPlansService,
    private stateStoreService: StateStoreService,
    private translate: TranslateService,
    private singpassApiService: SingpassApiService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {});
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
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
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
          this.loaderService.showLoader({ title: 'Loading', autoHide: false });
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.ROOT], { skipLocationChange: true });
        } else if (journeyType === appConstants.JOURNEY_TYPE_INVESTMENT) {
          this.investmentCommonService.redirectToInvestmentFromLogin(this.authService.getEnquiryId());
        } else if (journeyType === appConstants.JOURNEY_TYPE_WILL_WRITING) {
          this.router.navigate([WILL_WRITING_ROUTE_PATHS.VALIDATE_YOUR_WILL]);
        } else {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
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

  hubspotLogin() {
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
  }

  onSuccessLogin(data) {
    this.hubspotLogin();
    this.investmentCommonService.clearAccountCreationActions();
    if (data.objectList[0].customerId) {
      this.appService.setCustomerId(data.objectList[0].customerId);
    }
    this.signUpService.removeCaptchaSessionId();
    const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
    if (this.checkInsuranceEnquiry(insuranceEnquiry)) {
      this.updateInsuranceEnquiry(insuranceEnquiry, data);
    } else {
      this.goToNext();
    }
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
        this.router.navigate(['email-enquiry/success']);
    });
  }

  // Test login method
  loginBySingpass(code, state) {
    // Pass in code & state get back the authenticate response
    this.singpassApiService.loginSingpass(code, state).subscribe((data)=>{
      if (data) {
        console.log("UIN = " + data.objectList[0]);
      }
    }, (error)=> {
      console.log("DISPLAY ERROR = " + error);
    });
    // this.signUpApiService.verifyLogin("97320546", "Money@123", "", false, "", "", null).subscribe((data) => {
    //     // if (data) {
    //     //   this.onSuccessLogin(data);
    //     // } else {
    //       this.router.navigate['/accounts/login'];
    //       this.openSingpassModal(window.event, 'Fail');
    //     // }
    // });
  }
  
  openSingpassModal(event, type?) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    if (type) {
      ref.componentInstance.errorTitle = this.translate.instant('LOGIN.SINGPASS_LOGIN_FAIL_MODAL.TITLE');
      ref.componentInstance.errorMessageHTML = this.translate.instant('LOGIN.SINGPASS_LOGIN_FAIL_MODAL.MESSAGE');
      ref.componentInstance.primaryActionLabel = this.translate.instant('LOGIN.SINGPASS_LOGIN_FAIL_MODAL.BACK_BTN');
      ref.componentInstance.primaryAction.subscribe(() => {
        this.modal.dismissAll();
      });
    } else {
      ref.componentInstance.errorTitle = this.translate.instant('LOGIN.SINGPASS_ACTIVATE_MODAL.TITLE');
      ref.componentInstance.errorMessageHTML = this.translate.instant('LOGIN.SINGPASS_ACTIVATE_MODAL.MESSAGE');
    }
    event.stopPropagation();
    event.preventDefault();
  }
}
