import { CurrencyPipe } from '@angular/common';
import { Token } from '@angular/compiler';
import {
    AfterContentInit, Component, HostListener, OnInit, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpService } from '../../sign-up/sign-up.service';

import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';

import { PortfolioService } from '../../portfolio/portfolio.service';

// import { RiskProfile } from '../../portfolio/risk-profile/riskprofile';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';

@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.scss']
})
export class AssetAllocationComponent implements OnInit {

  pageTitle: string;
  portfolio;
  // selectedRiskProfile: RiskProfile;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  helpDate: any;
  editPortfolio: any;
  buttonTitle: any;
  event1 = true;
  event2 = true;
  userInputSubtext;

  constructor(
    private appService: AppService,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private currencyPipe: CurrencyPipe,
    public authService: AuthenticationService,
    public modal: NgbModal,
    private signUpService: SignUpService,
    private portfolioService: PortfolioService) {
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
    this.navbarService.setNavbarMode(2);
    this.getPortfolioAllocationDetails();
    this.selectedRiskProfile = this.portfolioService.getRiskProfile();
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

  showEditModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.editPortfolio.modalTitle;
    ref.componentInstance.errorMessage = this.editPortfolio.modalMessage;
    ref.componentInstance.primaryActionLabel = this.buttonTitle;
    ref.componentInstance.primaryAction.subscribe(() => {
      this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_ASSESSMENT]);
    });
  }

  showWhatTheRisk() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  showWhatFubdDetails() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  getPortfolioAllocationDetails() {
    const params = this.constructgetAllocationParams();
    this.portfolioService.getPortfolioAllocationDetails(params).subscribe((data) => {
      // this.portfolio = data.objectList;
    });
    
    const mockResponse = {
      "exception": null,
      "objectList": {
        "investmentPeriod": 60,
        "projectedValue": 0,
        "portfolioId": "PORTFOLIO00057",
        "portfolioName": "Test BFA DPMS",
        "tenure": "60",
        "projectedReturnsHighEnd": 1286079,
        "projectedReturnsMedian": 1263385,
        "projectedReturnsLowEnd": 1240987,
        "portfolioType": null,
        "portfolioStatus": "RECOMMENDED",
        "portfolioMaturityYear": "2078",
        "initialInvestment": 100,
        "monthlyInvestment": 500,
        "riskProfile": {
          "id": 1,
          "type": "Conservative",
          "order": 1
        },
        "feeDetails": [
          {
              "id": 4,
              "feeName": "Advisory Fees",
              "percentage": "0.65%",
              "comments": null,
              "listing_order": 1
          },
          {
              "id": 5,
              "feeName": "Platform Fees",
              "percentage": "0.15%",
              "comments": "Paid to iFast",
              "listing_order": 2
          },
          {
              "id": 6,
              "feeName": "Fund Expense Ratio",
              "percentage": "0.2% to 0.4%",
              "comments": "Paid to DFA",
              "listing_order": 3
          },
          {
              "id": 7,
              "feeName": "Total",
              "percentage": "1% to 1.2%",
              "comments": null,
              "listing_order": 4
          }
      ],
        "sectorAllocations": [{
            "id": 1,
            "name": "Emerging Markets Equity",
            "allocationPercentage": 50,
            "sectorId": "SECTOR00012",
            "type": {
              "id": 1,
              "type": "Equities"
            },
            "riskRating": 9,
            "groupedAllocationDetails": {
              "Class Allocation": [{
                  "id": 5,
                  "sectorTitle": "Class Allocation",
                  "sectorRegion": "Emerging Markets",
                  "percentage": 11.5
                },
                {
                  "id": 4,
                  "sectorTitle": "Class Allocation",
                  "sectorRegion": "Developed Markets",
                  "percentage": 88.5
                }
              ],
              "Sector Allocation": [{
                  "id": 18,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Energy",
                  "percentage": 7
                },
                {
                  "id": 12,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Financials",
                  "percentage": 17.8
                },
                {
                  "id": 21,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Other",
                  "percentage": 6
                },
                {
                  "id": 15,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Info Technology",
                  "percentage": 12.9
                },
                {
                  "id": 14,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Consumer Disc",
                  "percentage": 13.3
                },
                {
                  "id": 16,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Health Care",
                  "percentage": 9.6
                },
                {
                  "id": 17,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Materials",
                  "percentage": 7
                },
                {
                  "id": 13,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Industrials",
                  "percentage": 16.4
                },
                {
                  "id": 19,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Consumer Staples",
                  "percentage": 6.7
                },
                {
                  "id": 20,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "REITs",
                  "percentage": 3.4
                }
              ],
              "Regional Allocation": [{
                  "id": 9,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Latin America",
                  "percentage": 1.5
                },
                {
                  "id": 11,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Middle East",
                  "percentage": 0.3
                },
                {
                  "id": 7,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Asia Pacific",
                  "percentage": 21.3
                },
                {
                  "id": 10,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Africa",
                  "percentage": 0.7
                },
                {
                  "id": 6,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "North America",
                  "percentage": 57.4
                },
                {
                  "id": 8,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Europe",
                  "percentage": 18.8
                }
              ]
            }
          },
          {
            "id": 2,
            "name": "Global Bonds",
            "allocationPercentage": 50,
            "sectorId": "SECTOR00013",
            "type": {
              "id": 2,
              "type": "Bonds"
            },
            "riskRating": 9,
            "groupedAllocationDetails": {
              "Credit Rating Allocation": [{
                  "id": 24,
                  "sectorTitle": "Credit Rating Allocation",
                  "sectorRegion": "A",
                  "percentage": 21.7
                },
                {
                  "id": 22,
                  "sectorTitle": "Credit Rating Allocation",
                  "sectorRegion": "AAA",
                  "percentage": 21
                },
                {
                  "id": 23,
                  "sectorTitle": "Credit Rating Allocation",
                  "sectorRegion": "AA",
                  "percentage": 57.3
                }
              ]
            }
          }
        ],
        "funds": [{
            "id": "FI3018",
            "name": "Fidelity ASEAN A SGD",
            "type": "UT",
            "sectorName": "Emerging Markets Equity",
            "prospectusLink": null,
            "percentage": 60,
            "factSheetLink": "http://",
            "htmlDesc": null
          },
          {
            "id": "FI3018",
            "name": "Fidelity ASEAN A SGD",
            "type": "UT",
            "sectorName": "Global Bonds",
            "prospectusLink": null,
            "percentage": 20,
            "factSheetLink": "http://",
            "htmlDesc": null
          },
          {
            "id": "FI3018",
            "name": "Fidelity ASEAN A SGD",
            "type": "UT",
            "sectorName": "Global Bonds",
            "prospectusLink": null,
            "percentage": 20,
            "factSheetLink": "http://",
            "htmlDesc": null
          }
        ]
      },
      "responseMessage": {
        "responseCode": 6000,
        "responseDescription": "Successful response"
      }
    };
    this.portfolio = mockResponse.objectList;
    this.userInputSubtext = {
      onetime: this.currencyPipe.transform(this.portfolio.initialInvestment, 'USD', 'symbol-narrow', '1.0-2'),
      monthly: this.currencyPipe.transform(this.portfolio.monthlyInvestment, 'USD', 'symbol-narrow', '1.0-2'),
      period: this.portfolio.investmentPeriod
    };
  }

  constructgetAllocationParams() {
    const formData = this.portfolioService.getRiskProfile();
    const enqId = this.authService.getEnquiryId();
    return {
      riskProfileId: formData.riskProfileId,
      enquiryId: enqId
    };
  }

  selectAllocation(event) {
    if ((!this.isAllocationOpen)) {
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
 
  viewFundDetails(fund) {
    this.portfolioService.setFund(fund);
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.FUND_DETAILS]);
  }

  showLoginOrSignupModal() {
    const errorMessage = this.translate.instant('PRELOGIN_MODAL.DESC');
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorMessageHTML = errorMessage;
    ref.componentInstance.primaryActionLabel = this.translate.instant('PRELOGIN_MODAL.LOG_IN');
    ref.componentInstance.secondaryActionLabel = this.translate.instant('PRELOGIN_MODAL.CREATE_ACCOUNT');
    ref.componentInstance.secondaryActionDim = true;
    ref.componentInstance.primaryAction.subscribe(() => {
      // Login
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.ROOT);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    });
    ref.componentInstance.secondaryAction.subscribe(() => {
      // Sign up
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.POSTLOGIN);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
    });
  }

  goToNext() {
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    this.showLoginOrSignupModal();
  }
}

