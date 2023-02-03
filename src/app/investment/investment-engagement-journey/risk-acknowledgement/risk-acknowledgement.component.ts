import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { AppService } from '../../../app.service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { appConstants } from '../../../app.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';

@Component({
  selector: 'app-risk-acknowledgement',
  templateUrl: './risk-acknowledgement.component.html',
  styleUrls: ['./risk-acknowledgement.component.scss']
})
export class RiskAcknowledgementComponent implements OnInit {

  loaderTitle: string;
  loaderDesc: string;
  userPortfolioType: any;

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    private appService: AppService,
    public modal: NgbModal,
    private signUpService: SignUpService,
    public investmentAccountService: InvestmentAccountService,
    private investmentCommonService: InvestmentCommonService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private loaderService: LoaderService
  ) {

    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.loaderTitle = this.translate.instant('FUNDING_METHOD.LOADER_TITLE');
      self.loaderDesc = this.translate.instant('FUNDING_METHOD.LOADER_DESC');
    });
    this.userPortfolioType = investmentEngagementJourneyService.getUserPortfolioType();
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    if (!this.authService.isAuthenticated()) {
      this.authService.authenticate().subscribe((token) => {
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
    }
    this.loaderService.showLoader({
      title: this.loaderTitle,
      desc: this.loaderDesc
    });
    this.getPortfolioAllocationDetails();
  }
  goBack() {
    this.navbarService.goBack();
  }
  getPortfolioAllocationDetails() {
    const params: any = this.constructParamsWithUserPortfolioType();
    if (params && params.jaAccountId) {
      this.investmentEngagementJourneyService.getJAPortfolioAllocationDetails(params).subscribe((data) => {
        let secondaryHolderMajorData = this.investmentEngagementJourneyService.getMajorSecondaryHolderData();
        let secondaryHolderMinorData = this.investmentEngagementJourneyService.getMinorSecondaryHolderData();
        if (secondaryHolderMajorData) {
          secondaryHolderMajorData.customerPortfolioId = data.objectList.customerPortfolioId;
          this.investmentEngagementJourneyService.setMajorSecondaryHolderData(secondaryHolderMajorData);
        }
        if (secondaryHolderMinorData) {
          secondaryHolderMinorData.customerPortfolioId = data.objectList.customerPortfolioId;
          this.investmentEngagementJourneyService.setMinorSecondaryHolderData(secondaryHolderMinorData);
        }
        this.loaderService.hideLoader();
      }, (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
    } else {
      this.investmentEngagementJourneyService.getPortfolioAllocationDetails(params).subscribe((data) => {
        this.loaderService.hideLoader();
      }, (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
    }
  }

  constructgetAllocationParams() {
    return {
      enquiryId: this.authService.getEnquiryId()
    };
  }

  constructGetAllocationParamsWithJAAccountId() {
    const majorHolderData = this.investmentEngagementJourneyService.getMajorSecondaryHolderData();
    const minorHolderData = this.investmentEngagementJourneyService.getMinorSecondaryHolderData();
    let jaAccountId;
    if (majorHolderData && majorHolderData.jaAccountId) {
      jaAccountId = majorHolderData.jaAccountId;
    } else if (minorHolderData && minorHolderData.jaAccountId) {
      jaAccountId = minorHolderData.jaAccountId;
    }
    return {
      enquiryId: this.authService.getEnquiryId(),
      jaAccountId: jaAccountId
    };
  }

  constructParamsWithUserPortfolioType() {
    if (this.checkIfJointAccount()) {
      return this.constructGetAllocationParamsWithJAAccountId();
    } else {
      return this.constructgetAllocationParams();
    }
  }

  checkIfJointAccount() {
    if (this.userPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT_ID) {
      return true;
    }
    return false;
  }

  goNext() {
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    if (this.authService.isSignedUser()) {
      this.investmentCommonService.getAccountCreationActions().subscribe((data) => {
        if (this.investmentCommonService.isUserNotAllowed(data)) {
          this.investmentCommonService.goToDashboard();
        } else if (this.investmentCommonService.isUsersFirstPortfolio(data)) {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.START]);
        } else {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CONFIRM_PORTFOLIO]);
        }
      });
    } else {
      this.showLoginOrSignupModal();
    }
  }
  showLoginOrSignupModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorMessageHTML = this.translate.instant('PRELOGIN_MODAL.DESC');
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'PRELOGIN_MODAL.LOG_IN'
    );
    ref.componentInstance.secondaryActionLabel = this.translate.instant(
      'PRELOGIN_MODAL.CREATE_ACCOUNT'
    );
    ref.componentInstance.secondaryActionDim = true;
    ref.componentInstance.primaryAction.subscribe(() => {
      // Login
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.ROOT);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    });
    ref.componentInstance.secondaryAction.subscribe(() => {
      // Sign up
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.START);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT_MY_INFO]);
    });
  }
}
