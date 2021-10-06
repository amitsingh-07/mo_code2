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
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { Util } from '../../../shared/utils/util';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { PromoCodeService } from '../../../promo-code/promo-code.service';

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
  portfolioDisplayName: any;
  bankDetails: any;
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
    private loaderService: LoaderService,
    public modal: NgbModal,
    private promoCodeService: PromoCodeService
  ) {
    this.secondaryHolderMinorFormValues = investmentEngagementJourneyService.getMinorSecondaryHolderData();
    this.secondaryHolderMajorFormValues = investmentEngagementJourneyService.getMajorSecondaryHolderData();
    if (Util.isEmptyOrNull(this.secondaryHolderMinorFormValues) && Util.isEmptyOrNull(this.secondaryHolderMajorFormValues)) {
      router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
    }
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO_SUMMARY.TITLE');
      this.taxPrecedenceTitles = this.translate.instant('PORTFOLIO_SUMMARY.SECONDARY_HOLDER_MINOR.TAX_FORM_PRECENDENCE');
      this.setPageTitle(this.pageTitle);
    });

  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getPortFolioSummaryDetails(this.investmentAccountService.getCustomerPortfolioId());
    this.setPromoCode();
  }

  setPromoCode() {
    const promo: any = this.promoCodeService.usedPromo.getValue();
    if (Util.isEmptyOrNull(promo)) {
      this.promoCode = INVESTMENT_COMMON_CONSTANTS.PROMO_CODE.NOT_APPLIED;
    } else {
      this.promoCode = promo.code;
    }
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  editWithdrawDetails() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.EDIT_WITHDRAWAL]);
  }

  changePortfolio() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
  }

  goToNext() {
    const customerPortfolioId = this.investmentAccountService.getCustomerPortfolioId();
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
    const promo = this.promoCodeService.usedPromo.getValue();
    this.manageInvestmentsService.submitJAPortfolio(customerPortfolioId, INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.SUBMISSION, promo['id'])
      .subscribe(resp => {
        this.loaderService.hideLoaderForced();
        this.clearData();
        this.onPortfolioSubmission();
      });
  }

  onPortfolioSubmission() {
    if (this.isMinor) {
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
        this.taxDetails = this.summaryDetails.minorSecondaryHolderSummary?.taxDetails;
        if (this.taxDetails && this.taxDetails.length > 1) {
          this.getTaxPrecendence();
        }
        const portFolio = this.summaryDetails.portfolio;
        const portfolioList = INVESTMENT_COMMON_CONSTANTS.PORTFOLIO;
        const portfolioIndex = portfolioList.findIndex(x => (portFolio && x.KEY.toUpperCase().replace(/\s/g, '') == portFolio.toUpperCase().replace(/\s/g, '')));
        if (portfolioIndex >= 0) {
          this.portfolioDisplayName = portfolioList[portfolioIndex].VALUE;
        } else {
          this.portfolioDisplayName = portFolio;
        }
        this.bankDetails = {
          bank: this.summaryDetails?.bankName,
          accountNo: this.summaryDetails?.accountNo,
          nameOnAccount: this.summaryDetails?.accountName
        }
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
    if (this.summaryDetails && this.summaryDetails.minorSecondaryHolderSummary
      && this.summaryDetails.minorSecondaryHolderSummary.nationality
      && [INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_NAME, INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_CODE]
        .indexOf(this.summaryDetails.minorSecondaryHolderSummary.nationality.toUpperCase()) < 0) {
      return !this.summaryDetails.minorSecondaryHolderSummary.singaporePR;
    } else {
      return false;
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
