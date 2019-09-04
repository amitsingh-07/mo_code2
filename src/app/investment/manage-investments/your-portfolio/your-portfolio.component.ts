import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../manage-investments-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';

@Component({
  selector: 'app-your-portfolio',
  templateUrl: './your-portfolio.component.html',
  styleUrls: ['./your-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourPortfolioComponent implements OnInit {
  pageTitle: string;
  moreList: any;
  portfolioValues;
  portfolio;
  holdingValues;
  assetAllocationValues;
  yearlyReturns: any;
  totalReturnsPercentage: any;
  userProfileInfo: any;
  entitlements: any;
  monthlyInvestment: any;
  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    private modal: NgbModal,
    public footerService: FooterService,
    private currencyPipe: CurrencyPipe,
    public manageInvestmentsService: ManageInvestmentsService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('YOUR_PORTFOLIO.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(103);
    this.footerService.setFooterVisibility(false);
    this.getMoreList();
    this.portfolioValues = this.manageInvestmentsService.getPortfolioValues();
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.holdingValues = this.manageInvestmentsService.getHoldingValues();
    this.totalReturnsPercentage = this.portfolioValues.totalReturns
      ? this.portfolioValues.totalReturns
      : 0;
    this.yearlyReturns = this.portfolioValues.yearlyReturns
      ? this.portfolioValues.yearlyReturns
      : null;
    this.getPortfolioHoldingList(this.portfolioValues.portfolioId); // SET THE PORTFOLIO ID
    this.getTransferDetails(this.portfolioValues.customerPortfolioId);
    /* First portfolio's entitlement is considered for now as global entitlement,
        need to change when multiple portfolio logic is implemented */
    this.entitlements = this.manageInvestmentsService.getEntitlementsFromPortfolio(this.portfolioValues);
  }
  getMonthlyInvestValidity(index: number) {
    if (this.userProfileInfo && this.userProfileInfo.investementDetails
       && this.userProfileInfo.investementDetails.portfolios
       && this.userProfileInfo.investementDetails.portfolios[index]
       && this.userProfileInfo.investementDetails.portfolios[index].initialInvestment <= 0
       && this.userProfileInfo.investementDetails.portfolios[index].monthlyInvestment > 0) {
         this.monthlyInvestment = this.currencyPipe.transform(
          this.userProfileInfo.investementDetails.portfolios[index].monthlyInvestment,
          'USD',
          'symbol-narrow',
          '1.0-2'
        );
         return true;
       }
    return false;
  }
  getMoreList() {
    this.moreList = MANAGE_INVESTMENTS_CONSTANTS.INVESTMENT_OVERVIEW.MORE_LIST;
  }
  getPortfolioHoldingList(portfolioid) {
    this.manageInvestmentsService
      .getIndividualPortfolioDetails(portfolioid)
      .subscribe((data) => {
        this.portfolio = data.objectList;
        this.constructFundingParams(this.portfolio);
        this.manageInvestmentsService.setSelectedPortfolio(this.portfolio);
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
  }

  constructFundingParams(data) {
    const FundValues = {
      source: 'FUNDING',
      redirectTo: 'PORTFOLIO',
      portfolio: {
        productName: data.portfolioName,
        riskProfile: data.riskProfile
      },
      oneTimeInvestment: data.initialInvestment,
      monthlyInvestment: data.monthlyInvestment,
      fundingType: '',
      isAmountExceedBalance: 0,
      exceededAmount: 0
    };
    this.manageInvestmentsService.setFundingDetails(FundValues);
  }
  goToFundYourAccount() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUNDING_INSTRUCTIONS]);
  }
  gotoTopUp() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
  }
  showTotalReturnPopUp() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.TOTAL_RETURNS.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.TOTAL_RETURNS.MESSAGE'
    );
  }
  goToHoldings() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.HOLDINGS]);
  }
  goToAssetAllocation() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.ASSET_ALLOCATION]);
  }
  selectOption(option) {
    this.manageInvestmentsService.showMenu(option);
  }
  formatReturns(value) {
    return this.investmentAccountService.formatReturns(value);
  }

  /*
  * Method to get transfer details
  */
  getTransferDetails(customerPortfolioId) {
    this.manageInvestmentsService.getTransferDetails(customerPortfolioId).subscribe((data) => {
      this.manageInvestmentsService.setBankPayNowDetails(data.objectList[0]);
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  // This Method For Onetime expiry.
   goToInvestAgain(portfolioValues) {
    this.manageInvestmentsService.setPortfolioValues(portfolioValues);
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
  }
}
