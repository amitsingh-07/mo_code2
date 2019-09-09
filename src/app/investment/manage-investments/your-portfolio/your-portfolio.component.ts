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
  portfolio;
  holdingValues;
  assetAllocationValues;
  yearlyReturns: any;
  totalReturnsPercentage: any;
  userProfileInfo: any;
  entitlements: any;
  monthlyInvestment: any;
  formValues: any;

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
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.moreList = MANAGE_INVESTMENTS_CONSTANTS.INVESTMENT_OVERVIEW.MORE_LIST;
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.getCustomerPortfolioDetailsById(this.formValues.selectedCustomerPortfolioId);
  }

  getCustomerPortfolioDetailsById(customerPortfolioId) {
    this.manageInvestmentsService.getCustomerPortfolioDetailsById(customerPortfolioId).subscribe((data: any) => {
      data = {
        "exception": null,
        "objectList": {
            "investmentPeriod": 10,
            "projectedValue": 200,
            "portfolioId": "Portfolio0054",
            "customerPortfolioId": 101,
            "portfolioName": "Test Portfolio",
            "tenure": "Ten",
            "projectedReturnsHighEnd": 100,
            "projectedReturnsMedian": 20,
            "reviewedProjectedReturnsMedian": "Test",
            "projectedReturnsLowEnd": 50,
            "portfolioType": "ONE_TIME",
            "portfolioStatus": "PURCHASED",
            "portfolioMaturityYear": "2020",
            "initialInvestment": 200,
            "monthlyInvestment": 200,
            "riskProfile": {"id":1,"type":"Conservative","order":1},
            "feeDetails": [{"id":17,"feeName":"MoneyOwl Advisory Fee","percentage":"0.65%*","comments":"*Or your special promo rate","listing_order":1},{"id":18,"feeName":"Platform Fee","percentage":"0.18%","comments":"Paid to iFAST","listing_order":2},{"id":19,"feeName":"Fund Expense Ratio","percentage":"0.31%","comments":"Paid to DFA","listing_order":3},{"id":20,"feeName":"Total Fee","percentage":"1.14%","comments":null,"listing_order":4}],
            "capitalInvested": 100,
            "pendingRequestDTO": {
                "numberOfPendingRequests": 3,
                "transactionDetailsDTO": [
                    {
                        "amount": 300,
                        "transactionStatus": "PROCESSING",
                        "createdDate": 1567768403088,
                        "expiryDate": 1567768403088,
                        "transactionFrequency": "ONE_TIME"
                    },
                    {
                        "amount": 300,
                        "transactionStatus": "AWAITING_FUND",
                        "createdDate": 1567768403096,
                        "expiryDate": 1567768403096,
                        "transactionFrequency": "ONE_TIME"
                    },
                    {
                        "amount": 300,
                        "transactionStatus": "PENDING",
                        "createdDate": 1567768403096,
                        "expiryDate": 1567768403096,
                        "transactionFrequency": "ONE_TIME"
                    }
                ]
            },
            "entitlements": {
                "portfolioStatus": "DEFAULT",
                "portfolioLoaded": false,
                "transactionStatus": false,
                "rspUserAccountLevel": false,
                "showDelete": true,
                "showInvest": true,
                "showTopup": true,
                "showWithdrawPvToBa": true,
                "showWithdrawPvToCa": true,
                "showWithdrawCaToBa": true,
                "processMonthly": false,
                "processAwaitingFundTransaction": false
            },
            "investmentAccountDTO": {
                "accountBalance": 5000,
                "referenceCode": "REF000089"
            },
            "sectorAllocations": [{"id":1,"name":"Emerging Markets Equity","sectorId":"SECTOR00012","type":{"id":1,"type":"Equities","holdingsCount":8554},"riskRating":9,"groupedAllocationDetails":{"Class Allocation":[{"id":4,"sectorTitle":"Class Allocation","sectorRegion":"Developed Markets","percentage":88},{"id":5,"sectorTitle":"Class Allocation","sectorRegion":"Emerging Markets","percentage":12}],"Sector Allocation":[{"id":15,"sectorTitle":"Sector Allocation","sectorRegion":"Info Technology","percentage":12.9},{"id":21,"sectorTitle":"Sector Allocation","sectorRegion":"Other","percentage":6},{"id":17,"sectorTitle":"Sector Allocation","sectorRegion":"Materials","percentage":7},{"id":12,"sectorTitle":"Sector Allocation","sectorRegion":"Financials","percentage":17.8},{"id":18,"sectorTitle":"Sector Allocation","sectorRegion":"Energy","percentage":7},{"id":20,"sectorTitle":"Sector Allocation","sectorRegion":"REITs","percentage":3.4},{"id":16,"sectorTitle":"Sector Allocation","sectorRegion":"Health Care","percentage":9.6},{"id":13,"sectorTitle":"Sector Allocation","sectorRegion":"Industrials","percentage":16.4},{"id":14,"sectorTitle":"Sector Allocation","sectorRegion":"Consumer Disc","percentage":13.3},{"id":19,"sectorTitle":"Sector Allocation","sectorRegion":"Consumer Staples","percentage":6.7}],"Regional Allocation":[{"id":10,"sectorTitle":"Regional Allocation","sectorRegion":"Africa","percentage":0.7},{"id":8,"sectorTitle":"Regional Allocation","sectorRegion":"Europe","percentage":18.8},{"id":11,"sectorTitle":"Regional Allocation","sectorRegion":"Middle East","percentage":0.3},{"id":6,"sectorTitle":"Regional Allocation","sectorRegion":"North America","percentage":57.4},{"id":7,"sectorTitle":"Regional Allocation","sectorRegion":"Asia Pacific","percentage":21.3},{"id":9,"sectorTitle":"Regional Allocation","sectorRegion":"Latin America","percentage":1.5}]},"allocationPercentage":20,"holdingsCount":null},{"id":2,"name":"Fixed Income","sectorId":"SECTOR00002","type":{"id":2,"type":"Fixed Income","holdingsCount":202},"riskRating":4,"groupedAllocationDetails":{"Credit Rating Allocation":[{"id":22,"sectorTitle":"Credit Rating Allocation","sectorRegion":"AAA","percentage":21},{"id":23,"sectorTitle":"Credit Rating Allocation","sectorRegion":"AA","percentage":57.3},{"id":24,"sectorTitle":"Credit Rating Allocation","sectorRegion":"A","percentage":21.7}],"Regional Allocation":[{"id":26,"sectorTitle":"Regional Allocation","sectorRegion":"North America","percentage":30.8},{"id":28,"sectorTitle":"Regional Allocation","sectorRegion":"Asia Pacific","percentage":9.3},{"id":25,"sectorTitle":"Regional Allocation","sectorRegion":"Europe","percentage":48.7},{"id":27,"sectorTitle":"Regional Allocation","sectorRegion":"Supranational","percentage":11.3}]},"allocationPercentage":80,"holdingsCount":null}],
            "funds": [{"id":"DIM033","name":"Dimensional Emerging Markets Large Cap Core Equity Acc SGD","type":"UT","sectorName":"Emerging Markets Equity","prospectusLink":null,"percentage":2,"factSheetLink":"DIM033-FS.pdf|DIM033-P.pdf","htmlDesc":"The fund is managed on a discretionary basis and invests in shares, both ordinary shares and preference shares, as well as depositary receipts (financial certificates representing the shares of these companies and which are bought and sold globally), of larger sized companies which are associated with emerging markets countries, including countries which are in the early stages of economic development. The fund does not focus on any particular industry or market sector.","description":"The fund is managed on a discretionary basis and invests in shares, both ordinary shares and preference shares, as well as depositary receipts (financial certificates representing the shares of these companies and which are bought and sold globally), of larger sized companies which are associated with emerging markets countries, including countries which are in the early stages of economic development. The fund does not focus on any particular industry or market sector."},{"id":"DIM034","name":"Dimensional Global Core Equity Acc SGD","type":"UT","sectorName":"Global Equity","prospectusLink":null,"percentage":18,"factSheetLink":"DIM034-FS.pdf|DIM034-P.pdf","htmlDesc":"The fund is managed on a discretionary basis and primarily invests in shares of companies listed on the principal stock exchanges in developed countries around the world. The fund has a general exposure to the market with a greater allocation to shares of smaller sized companies and value companies. Value companies are defined as companies where, at the time of purchase, the share price is low compared to the accounting value of the company.","description":"The fund is managed on a discretionary basis and primarily invests in shares of companies listed on the principal stock exchanges in developed countries around the world. The fund has a general exposure to the market with a greater allocation to shares of smaller sized companies and value companies. Value companies are defined as companies where, at the time of purchase, the share price is low compared to the accounting value of the company."},{"id":"DIM035","name":"Dimensional Global Short Fixed Income Acc SGD-H","type":"UT","sectorName":"Fixed Income","prospectusLink":null,"percentage":80,"factSheetLink":"DIM035-FS.pdf|DIM035-P.pdf","htmlDesc":"The fund is managed on a discretionary basis and invests in high quality debt such as bonds, commercial paper, bank and corporate debt with a maturity of five years or less. The fund will generally maintain an average maturity of its investments to five years or less. This debt is issued by governments, other public bodies and companies from developed countries and, at the time of purchase, this debt is generally rated at least AA- or Aa3 long term by the major rating agencies. If the investments are downgraded below this level, they may be sold if in the best interests of the Fund.","description":"The fund is managed on a discretionary basis and invests in high quality debt such as bonds, commercial paper, bank and corporate debt with a maturity of five years or less. The fund will generally maintain an average maturity of its investments to five years or less. This debt is issued by governments, other public bodies and companies from developed countries and, at the time of purchase, this debt is generally rated at least AA- or Aa3 long term by the major rating agencies. If the investments are downgraded below this level, they may be sold if in the best interests of the Fund."}]
        },
        "responseMessage": {
            "responseCode": 6000,
            "responseDescription": "Successful response"
        }
      };
      this.portfolio = data.objectList;
      this.holdingValues = this.portfolio.dpmsDetailsDisplay;
      this.constructFundingParams(this.portfolio);
      this.manageInvestmentsService.setSelectedCustomerPortfolio(this.portfolio);
      this.totalReturnsPercentage = this.portfolio.totalReturns ? this.portfolio.totalReturns : 0;
      this.yearlyReturns = this.portfolio.yearlyReturns ? this.portfolio.yearlyReturns : null;
      this.getTransferDetails(this.portfolio.customerPortfolioId);
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
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
      this.manageInvestmentsService.setBankPayNowDetails(data.objectList);
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  // This Method For Onetime expiry.
   goToInvestAgain() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
  }
}
