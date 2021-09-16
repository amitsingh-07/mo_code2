import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment-engagement-journey/investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';

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
  withdrawalBankDetails: any;
  summaryDetails: any;
  constructor(
    public readonly translate: TranslateService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    private router: Router,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO_SUMMARY.TITLE');
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
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  editWithdrawDetails() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CONFIRM_WITHDRAWAL, { navigationType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NAVIGATION_TYPE.EDIT }]);
  }

  goToNext() {

  }

  ediMajorHolderDetails() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.ADD_SECONDARY_HOLDER_DETAILS, { navigationType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NAVIGATION_TYPE.EDIT }]);
  }

  editMinorHolderDetails() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.ADD_SECONDARY_HOLDER_DETAILS, { navigationType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NAVIGATION_TYPE.EDIT }]);
  }

  editPortfolioName() {

  }  

  editPromoCode() {

  }

  editFundingMethod() {
    
  }

  // GET THE PORTFOLIO SUMMARY DETAILS FOR PORTFOLIO SUMMARY PAGE
  getPortFolioSummaryDetails(customerPortfolioId) {
    this.investmentCommonService.getPortFolioSummaryDetails(customerPortfolioId).subscribe(response => {
      if(response.responseMessage.responseCode === 6000) {
        this.summaryDetails = response.objectList;
        this.withdrawalBankDetails.bankName = this.summaryDetails.bankName;
        this.withdrawalBankDetails.accountNo = this.summaryDetails.accountNo;
        // this.withdrawalBankDetails.bankName = this.summaryDetails.bankName;
      }
    });
  }
}
