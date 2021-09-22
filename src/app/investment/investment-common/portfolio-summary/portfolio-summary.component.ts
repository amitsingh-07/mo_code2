import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { EditInvestmentModalComponent } from '../../../shared/modal/edit-investment-modal/edit-investment-modal.component';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment-engagement-journey/investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../manage-investments/manage-investments-routes.constants';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { IInvestmentCriteria } from '../investment-common-form-data';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';
import { IToastMessage } from '../../manage-investments/manage-investments-form-data';

@Component({
  selector: 'app-portfolio-summary',
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioSummaryComponent implements OnInit {

  pageTitle: string;
  secondaryHolderMinorFormValues: any;
  secondaryHolderMajorFormValues: any;
  summaryDetails: any;
  investmentCriteria: IInvestmentCriteria;
  isMinor: boolean;
  taxDetails: any;
  taxPrecedenceTitles: any;
  promoCode: any;
  constructor(
    public readonly translate: TranslateService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    private router: Router,
    public authService: AuthenticationService,
    public modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO_SUMMARY.TITLE');
      this.taxPrecedenceTitles = this.translate.instant('PORTFOLIO_SUMMARY.SECONDARY_HOLDER_MINOR.TAX_FORM_PRECENDENCE');
      this.setPageTitle(this.pageTitle);
    });
    this.secondaryHolderMinorFormValues = investmentEngagementJourneyService.getMinorSecondaryHolderData();
    this.secondaryHolderMajorFormValues = investmentEngagementJourneyService.getMajorSecondaryHolderData();
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getPortFolioSummaryDetails(this.investmentAccountService.getCustomerPortfolioId());
    // this.getPortFolioSummaryDetails(30879);
    this.promoCode = this.investmentEngagementJourneyService.getPromoCode();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  editWithdrawDetails() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.EDIT_WITHDRAWAL]);
  }

  goToNext() {
    this.clearData();
    if (this.summaryDetails.minor) {
      const toastMessage: IToastMessage = {
        isShown: true,
        desc: this.translate.instant('TOAST_MESSAGES.PORTFOLIO_SUBMITTED_TO_MINOR', { userGivenPortfolioName: this.summaryDetails.portfolioName }),
      };
      this.manageInvestmentsService.setToastMessage(toastMessage);
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
    } else {
      const toastMessage: IToastMessage = {
        isShown: true,
        desc: this.translate.instant('TOAST_MESSAGES.PORTFOLIO_SUBMITTED_TO_MAJOR', { secondaryHolderName: this.summaryDetails.secondaryHolderName }),
      };
      this.manageInvestmentsService.setToastMessage(toastMessage);
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
    }
  }

  ediSecondaryHolderDetails() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.EDIT_SECONDARY_HOLDER_DETAILS]);
  }

  editPortfolioName() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ADD_PORTFOLIO_NAME]);
  }

  editPromoCode() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.EDIT_FUNDING_ACCOUNT_DETAILS]);
  }

  clearData() {
    this.investmentAccountService.clearInvestmentAccountFormData();
    this.investmentCommonService.clearJourneyData();
    this.investmentCommonService.clearFundingDetails();
    this.investmentCommonService.clearAccountCreationActions();
  }

  editFundingMethod() {
    this.openEditInvestmentModal();
  }

  // GET THE PORTFOLIO SUMMARY DETAILS FOR PORTFOLIO SUMMARY PAGE
  getPortFolioSummaryDetails(customerPortfolioId) {
    this.investmentCommonService.getPortFolioSummaryDetails(customerPortfolioId).subscribe(response => {
      if (response.responseMessage.responseCode === 6000) {
        this.summaryDetails = response.objectList;
        this.isMinor = this.summaryDetails.minor;
        this.taxDetails = this.summaryDetails.minorSecondaryHolderSummary.taxDetails;
        if(this.taxDetails && this.taxDetails.length > 1) {
          this.getTaxPrecendence();
        }
        this.summaryDetails.formattedAccountNumber = this.manageInvestmentsService.srsAccountFormat(this.summaryDetails.accountNo, this.summaryDetails.bankName)
        this.getInvestmentCriteria(this.summaryDetails);
      }
    });
  }

  openEditInvestmentModal() {
    const ref = this.modal.open(EditInvestmentModalComponent, {
      centered: true
    });
    ref.componentInstance.investmentData = {
      oneTimeInvestment: this.summaryDetails?.oneTimeAmount,
      monthlyInvestment: this.summaryDetails?.monthlyAmount
    };
    ref.componentInstance.investmentCriteria = this.investmentCriteria;
    ref.componentInstance.modifiedInvestmentData.subscribe((emittedValue) => {
      // update form data
      ref.close();
      debugger;
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
    const customerPortfolioId = this.investmentAccountService.getCustomerPortfolioId();
    // const customerPortfolioId = 30879;
    this.investmentAccountService.updateInvestment(customerPortfolioId, params).subscribe((data) => {
      this.getPortFolioSummaryDetails(customerPortfolioId);
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

  getInvestmentCriteria(portfolioValues) {
    if (portfolioValues.portfolioType) {
      this.investmentCommonService.getInvestmentCriteria(portfolioValues.portfolioType).subscribe((data) => {
        this.investmentCriteria = data;
      });
    }
  }

  isForeignerCheck() {
    if (this.summaryDetails && this.summaryDetails.nationality && [INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_NAME, INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_CODE]
      .indexOf(this.summaryDetails.nationality) < 0) {
      return this.summaryDetails.singaporePR;
    } else {
      return true;
    }
  }

  getTaxPrecendence() {
    this.taxDetails.forEach((element, index) => {
      switch (index) {
        case 0:
          element.precedence = this.taxPrecedenceTitles.TAX_FIRST;
          break;
        case 1:
          element.precedence = this.taxPrecedenceTitles.TAX_SECOND;
          break;
        case 2:
          element.precedence = this.taxPrecedenceTitles.TAX_THIRD;
          break;
        case 3:
          element.precedence = this.taxPrecedenceTitles.TAX_FOURTH;
          break;
        case 4:
          element.precedence = this.taxPrecedenceTitles.TAX_FIFTH;
          break;
        default:
          element.precedence = '';
          break;
      }
    });
  }
}
