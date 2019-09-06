import 'rxjs/add/observable/timer';

import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../../../app.constants';
import { AppService } from '../../../app.service';
import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import {
    EditInvestmentModalComponent
} from '../../../shared/modal/edit-investment-modal/edit-investment-modal.component';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpApiService } from '../../../sign-up/sign-up.api.service';
import { SIGN_UP_CONFIG } from '../../../sign-up/sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import {
    MANAGE_INVESTMENTS_ROUTE_PATHS
} from '../../manage-investments/manage-investments-routes.constants';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { ProfileIcons } from '../recommendation/profileIcons';
import { RiskProfile } from '../recommendation/riskprofile';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioDetailsComponent implements OnInit {
  pageTitle: string;
  portfolio;
  selectedRiskProfile: any;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  helpDate: any;
  editPortfolio: any;
  buttonTitle: any;
  event1 = true;
  event2 = true;
  iconImage;
  userInputSubtext;

  constructor(
    private signUpApiService: SignUpApiService,
    private appService: AppService,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private translate: TranslateService,
    private currencyPipe: CurrencyPipe,
    public authService: AuthenticationService,
    public modal: NgbModal,
    private signUpService: SignUpService,
    public investmentAccountService: InvestmentAccountService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private manageInvestmentsService: ManageInvestmentsService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService
  ) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.TITLE');
      self.editPortfolio = this.translate.instant('PORTFOLIO_RECOMMENDATION.editModel');
      self.helpDate = this.translate.instant('PORTFOLIO_RECOMMENDATION.helpDate');
      self.buttonTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.CONTINUE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getPortfolioAllocationDetails();
    this.selectedRiskProfile = this.investmentEngagementJourneyService.getSelectedRiskProfileId();
    this.iconImage = ProfileIcons[this.selectedRiskProfile.riskProfileId - 1]['icon'];
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.helpDate.modalTitle;
    ref.componentInstance.errorMessage = this.helpDate.modalMessage;
    return false;
  }

  openEditInvestmentModal() {
    const ref = this.modal.open(EditInvestmentModalComponent, {
      centered: true
    });
    ref.componentInstance.investmentData = {
      oneTimeInvestment: this.portfolio.initialInvestment,
      monthlyInvestment: this.portfolio.monthlyInvestment
    };
    ref.componentInstance.modifiedInvestmentData.subscribe((emittedValue) => {
      // update form data
      ref.close();
      this.saveUpdatedInvestmentData(emittedValue);
    });
    this.dismissPopup(ref);
  }

  dismissPopup(ref: NgbModalRef) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ref.close();
      }
    });
  }

  saveUpdatedInvestmentData(updatedData) {
    const params = this.constructUpdateInvestmentParams(updatedData);
    this.investmentAccountService.updateInvestment(params).subscribe((data) => {
      this.getPortfolioAllocationDetails();
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  constructUpdateInvestmentParams(data) {
    return {
      initialInvestment: parseFloat(data.oneTimeInvestment),
      monthlyInvestment: parseFloat(data.monthlyInvestment),
      enquiryId: this.authService.getEnquiryId()
    };
  }

  showWhatTheRisk() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  showWhatFubdDetails() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  getPortfolioAllocationDetails() {
    const params = this.constructgetAllocationParams();
    this.investmentEngagementJourneyService.getPortfolioAllocationDetails(params).subscribe((data) => {
      this.portfolio = data.objectList;
      this.userInputSubtext = {
        onetime: this.currencyPipe.transform(
          this.portfolio.initialInvestment,
          'USD',
          'symbol-narrow',
          '1.0-2'
        ),
        monthly: this.currencyPipe.transform(
          this.portfolio.monthlyInvestment,
          'USD',
          'symbol-narrow',
          '1.0-2'
        ),
        period: this.portfolio.investmentPeriod
      };
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  constructgetAllocationParams() {
    return {
      enquiryId: this.authService.getEnquiryId()
    };
  }

  selectAllocation(event) {
    if (!this.isAllocationOpen) {
      this.breakdownSelectionindex = event;
      this.isAllocationOpen = true;
    } else {
      if (event !== this.breakdownSelectionindex) {
        // different tab
        this.breakdownSelectionindex = event;
        this.isAllocationOpen = true;
      } else {
        // same tab click
        this.breakdownSelectionindex = null;
        this.isAllocationOpen = false;
      }
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
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
    });
  }

  constructFundingParams(data) {
    return {
      source: 'FUNDING',
      redirectTo: 'DASHBOARD',
      portfolio: {
        productName: data.portfolioName,
        riskProfile: data.riskProfile,
        productCode: data.portfolioId,
      },
      oneTimeInvestment: data.initialInvestment,
      monthlyInvestment: data.monthlyInvestment,
      fundingType: '',
      isAmountExceedBalance: 0,
      exceededAmount: 0
    };
  }

  goToNext() {
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    if (this.authService.isSignedUser()) {
      this.investmentCommonService.getAccountCreationActions().subscribe((data) => {
        if (this.investmentCommonService.isUsersFirstPortfolio(data)) {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.START]);
        } else {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ACKNOWLEDGEMENT]);
        }
      });
    } else {
      this.showLoginOrSignupModal();
    }
  }

  topUpOneTime() {
    this.loaderService.showLoader({
      title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
      desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
    });
    const fundDetails = this.manageInvestmentsService.getFundingDetails();
    this.manageInvestmentsService.buyPortfolio(fundDetails).subscribe(
      (response) => {
        this.loaderService.hideLoader();
        if (response.responseMessage.responseCode < 6000) {
          if (
            response.objectList &&
            response.objectList.length &&
            response.objectList[response.objectList.length - 1].serverStatus &&
            response.objectList[response.objectList.length - 1].serverStatus.errors &&
            response.objectList[response.objectList.length - 1].serverStatus.errors.length
          ) {
            this.showCustomErrorModal(
              'Error!',
              response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg
            );
          } else if (response.responseMessage && response.responseMessage.responseDescription) {
            const errorResponse = response.responseMessage.responseDescription;
            this.showCustomErrorModal('Error!', errorResponse);
          } else {
            this.investmentAccountService.showGenericErrorModal();
          }
        } else {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUNDING_INSTRUCTIONS]);
        }
      },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      }
    );
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  investmentFAQ() {
    this.router.navigate(['/faq'], { fragment: 'investment' });
  }
}
