import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import {
  EditInvestmentModalComponent
} from '../../../shared/modal/edit-investment-modal/edit-investment-modal.component';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SIGN_UP_CONFIG } from '../../../sign-up/sign-up.constant';
import { SignUpService } from '../../../sign-up/sign-up.service';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../investment-account/investment-account.constant';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import {
  InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { AddPortfolioNameComponent } from '../add-portfolio-name/add-portfolio-name.component';
import {
  AddPortfolioStatusComponent
} from '../add-portfolio-status/add-portfolio-status.component';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';
import {
  AccountCreationErrorModalComponent
} from './account-creation-error-modal/account-creation-error-modal.component';

@Component({
  selector: 'app-confirm-portfolio',
  templateUrl: './confirm-portfolio.component.html',
  styleUrls: ['./confirm-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmPortfolioComponent implements OnInit {
  uploadForm: FormGroup;
  pageTitle: string;
  formValues;
  countries;
  isUserNationalitySingapore;
  defaultThumb;
  formData: FormData = new FormData();
  portfolio;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  userInputSubtext;
  iconImage;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;
  legendColors: string[] = ['#3cdacb', '#ec681c', '#76328e'];
  isRequestSubmitted = false;

  defaultPortfolioName;
  portfolioNameStatus;
  confirmPortfolioValue;
  portfolioName;
  showErrorMessage = false;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public manageInvestmentsService: ManageInvestmentsService,
    public investmentAccountService: InvestmentAccountService,
    public investmentCommonService: InvestmentCommonService,
    private signUpService: SignUpService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const data = {
      "exception": null,
      "objectList": {
        "investmentPeriod": 11,
        "projectedValue": null,
        "portfolioId": "PORTFOLIO00054",
        "portfolioName": "Balanced",
        "tenure": "11",
        "projectedReturnsHighEnd": 414958.6541425717,
        "projectedReturnsMedian": 352049.9803641115,
        "reviewedProjectedReturnsMedian": "5.15%",
        "projectedReturnsLowEnd": 300785.8908365605,
        "portfolioType": null,
        "portfolioStatus": "PROPOSED",
        "portfolioMaturityYear": "2030",
        "initialInvestment": 1994,
        "monthlyInvestment": 1994,
        "riskProfile": {
          "id": 3,
          "type": "Balanced",
          "order": 1
        },
        "feeDetails": [
          {
            "id": 9,
            "feeName": "MoneyOwl Advisory Fee",
            "percentage": "0.65%*",
            "comments": "*Or your special promo rate",
            "listing_order": 1
          },
          {
            "id": 10,
            "feeName": "Platform Fee",
            "percentage": "0.18%",
            "comments": "Paid to iFAST",
            "listing_order": 2
          },
          {
            "id": 11,
            "feeName": "Fund Expense Ratio",
            "percentage": "0.34%",
            "comments": "Paid to DFA",
            "listing_order": 3
          },
          {
            "id": 12,
            "feeName": "Total Fee",
            "percentage": "1.17%",
            "comments": null,
            "listing_order": 4
          }
        ],
        "capitalInvested": 263208,
        "sectorAllocations": [
          {
            "id": 1,
            "name": "Emerging Markets Equity",
            "sectorId": "SECTOR00012",
            "type": {
              "id": 1,
              "type": "Equities",
              "holdingsCount": 8554
            },
            "riskRating": 9,
            "groupedAllocationDetails": {
              "Class Allocation": [
                {
                  "id": 4,
                  "sectorTitle": "Class Allocation",
                  "sectorRegion": "Developed Markets",
                  "percentage": 88
                },
                {
                  "id": 5,
                  "sectorTitle": "Class Allocation",
                  "sectorRegion": "Emerging Markets",
                  "percentage": 12
                }
              ],
              "Sector Allocation": [
                {
                  "id": 14,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Consumer Disc",
                  "percentage": 13.3
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
                },
                {
                  "id": 12,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Financials",
                  "percentage": 17.8
                },
                {
                  "id": 17,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Materials",
                  "percentage": 7
                },
                {
                  "id": 21,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Other",
                  "percentage": 6
                },
                {
                  "id": 16,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Health Care",
                  "percentage": 9.6
                },
                {
                  "id": 13,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Industrials",
                  "percentage": 16.4
                },
                {
                  "id": 18,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Energy",
                  "percentage": 7
                },
                {
                  "id": 15,
                  "sectorTitle": "Sector Allocation",
                  "sectorRegion": "Info Technology",
                  "percentage": 12.9
                }
              ],
              "Regional Allocation": [
                {
                  "id": 8,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Europe",
                  "percentage": 18.8
                },
                {
                  "id": 10,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Africa",
                  "percentage": 0.7
                },
                {
                  "id": 7,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Asia Pacific",
                  "percentage": 21.3
                },
                {
                  "id": 6,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "North America",
                  "percentage": 57.4
                },
                {
                  "id": 11,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Middle East",
                  "percentage": 0.3
                },
                {
                  "id": 9,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Latin America",
                  "percentage": 1.5
                }
              ]
            },
            "allocationPercentage": 60,
            "holdingsCount": null
          },
          {
            "id": 2,
            "name": "Fixed Income",
            "sectorId": "SECTOR00002",
            "type": {
              "id": 2,
              "type": "Fixed Income",
              "holdingsCount": 202
            },
            "riskRating": 4,
            "groupedAllocationDetails": {
              "Credit Rating Allocation": [
                {
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
              ],
              "Regional Allocation": [
                {
                  "id": 26,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "North America",
                  "percentage": 30.8
                },
                {
                  "id": 27,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Supranational",
                  "percentage": 11.3
                },
                {
                  "id": 28,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Asia Pacific",
                  "percentage": 9.3
                },
                {
                  "id": 25,
                  "sectorTitle": "Regional Allocation",
                  "sectorRegion": "Europe",
                  "percentage": 48.7
                }
              ]
            },
            "allocationPercentage": 40,
            "holdingsCount": null
          }
        ],
        "funds": [
          {
            "id": "DIM033",
            "name": "Dimensional Emerging Markets Large Cap Core Equity Acc SGD",
            "type": "UT",
            "sectorName": "Emerging Markets Equity",
            "prospectusLink": null,
            "percentage": 7,
            "factSheetLink": "DIM033-FS.pdf|DIM033-P.pdf",
            "htmlDesc": "The fund is managed on a discretionary basis and invests in shares, both ordinary shares and preference shares, as well as depositary receipts (financial certificates representing the shares of these companies and which are bought and sold globally), of larger sized companies which are associated with emerging markets countries, including countries which are in the early stages of economic development. The fund does not focus on any particular industry or market sector.",
            "description": "The fund is managed on a discretionary basis and invests in shares, both ordinary shares and preference shares, as well as depositary receipts (financial certificates representing the shares of these companies and which are bought and sold globally), of larger sized companies which are associated with emerging markets countries, including countries which are in the early stages of economic development. The fund does not focus on any particular industry or market sector."
          },
          {
            "id": "DIM035",
            "name": "Dimensional Global Short Fixed Income Acc SGD-H",
            "type": "UT",
            "sectorName": "Fixed Income",
            "prospectusLink": null,
            "percentage": 40,
            "factSheetLink": "DIM035-FS.pdf|DIM035-P.pdf",
            "htmlDesc": "The fund is managed on a discretionary basis and invests in high quality debt such as bonds, commercial paper, bank and corporate debt with a maturity of five years or less. The fund will generally maintain an average maturity of its investments to five years or less. This debt is issued by governments, other public bodies and companies from developed countries and, at the time of purchase, this debt is generally rated at least AA- or Aa3 long term by the major rating agencies. If the investments are downgraded below this level, they may be sold if in the best interests of the Fund.",
            "description": "The fund is managed on a discretionary basis and invests in high quality debt such as bonds, commercial paper, bank and corporate debt with a maturity of five years or less. The fund will generally maintain an average maturity of its investments to five years or less. This debt is issued by governments, other public bodies and companies from developed countries and, at the time of purchase, this debt is generally rated at least AA- or Aa3 long term by the major rating agencies. If the investments are downgraded below this level, they may be sold if in the best interests of the Fund."
          },
          {
            "id": "DIM034",
            "name": "Dimensional Global Core Equity Acc SGD",
            "type": "UT",
            "sectorName": "Global Equity",
            "prospectusLink": null,
            "percentage": 53,
            "factSheetLink": "DIM034-FS.pdf|DIM034-P.pdf",
            "htmlDesc": "The fund is managed on a discretionary basis and primarily invests in shares of companies listed on the principal stock exchanges in developed countries around the world. The fund has a general exposure to the market with a greater allocation to shares of smaller sized companies and value companies. Value companies are defined as companies where, at the time of purchase, the share price is low compared to the accounting value of the company.",
            "description": "The fund is managed on a discretionary basis and primarily invests in shares of companies listed on the principal stock exchanges in developed countries around the world. The fund has a general exposure to the market with a greater allocation to shares of smaller sized companies and value companies. Value companies are defined as companies where, at the time of purchase, the share price is low compared to the accounting value of the company."
          }
        ]
      },
      "responseMessage": {
        "responseCode": 6000,
        "responseDescription": "Successful response"
      }
    };
    this.portfolio = data.objectList;
    this.iconImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
    const fundingParams = this.constructFundingParams(data.objectList);
    this.manageInvestmentsService.setFundingDetails(fundingParams);
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

  }

  constructFundingParams(data) {
    return {
      source: 'FUNDING',
      redirectTo: 'DASHBOARD',
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
  }

  constructgetPortfolioParams() {
    return {};
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  setNestedDropDownValue(key, value, nestedKey) {
    this.uploadForm.controls[nestedKey]['controls'][key].setValue(value);
  }

  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
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

  showPortfolioAssetModal() {
    const errorTitle = this.translate.instant(
      'CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.TITLE'
    );
    const errorMessage = this.translate.instant(
      'CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.MESSAGE'
    );
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessageHTML = errorMessage;
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
      this.getPortfolioDetails();
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  constructUpdateInvestmentParams(data) {
    return {
      initialInvestment: data.oneTimeInvestment,
      monthlyInvestment: data.monthlyInvestment
    };
  }

  goToWhatsTheRisk() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  showInvestmentAccountErrorModal(errorList) {
    const errorTitle = this.translate.instant(
      'INVESTMENT_ACCOUNT_COMMON.ACCOUNT_CREATION_ERROR_MODAL.TITLE'
    );
    const ref = this.modal.open(AccountCreationErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorList = errorList;
  }

  showCustomErrorModal(title, desc) {
    const errorTitle = title;
    const errorMessage = desc;
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessage = errorMessage;
  }

  verifyCustomer() {
    this.confirmPortfolio(this.portfolio.portfolioId);
  }

 confirmPortfolio(param) {
     this.investmentCommonService.confirmPortfolio(param).subscribe((data) => {  // confirm portfolio api calling
      if (data.responseMessage.responseCode === 6000) {
        this.showAddPortfolioName(data.objectList);
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    });
  }

  showAddPortfolioName(defaultPortfolioName,userPortfolioName?) {
    const ref = this.modal.open(AddPortfolioNameComponent, {
      centered: true,
      backdropClass: 'portfolio-naming-backdrop',
      windowClass: 'portfolio-naming',
    });
    ref.componentInstance.riskProfileId = this.portfolio.riskProfile.id;
    ref.componentInstance.defaultPortfolioName = defaultPortfolioName;
  //  ref.componentInstance.userPortfolioName = userPortfolioName ? userPortfolioName : '';
    ref.componentInstance.showErrorMessage = this.showErrorMessage;
    ref.componentInstance.userPortfolioName =this.investmentAccountService.getConfirmPortfolioName();
    ref.componentInstance.addPortfolioBtn.subscribe((portfolioName) => {
      this.investmentAccountService.setConfirmPortfolioName(portfolioName);
      this.addPortfolioName(portfolioName);
    });
  }

  addPortfolioName(portfolioName) {
    this.investmentCommonService.addPortfolioName(portfolioName).subscribe((response) => { // sending portfolio name
      if (response.responseMessage.responseCode === 6000) {
        this.portfolioNameStatus = response.objectList;
        this.AddPortfolioNameStatus(portfolioName);
        this.showErrorMessage = false;
      } else if (response.responseMessage.responseCode === 5000) {
        this.showAddPortfolioName(portfolioName);
        this.showErrorMessage = true;
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
      });
  }

  AddPortfolioNameStatus(portfolioName) {
    const reference = this.modal.open(AddPortfolioStatusComponent, {
      centered: true,
      backdropClass: 'portfolio-naming-backdrop',
      windowClass: 'portfolio-naming',
    });
    reference.componentInstance.riskProfileId = this.portfolio.riskProfile.id;
    reference.componentInstance.portfolioName = portfolioName;
    reference.componentInstance.createdNameSuccessfully.subscribe(() => {
      this.reDirectToNextScreen();
    });
  }

  reDirectToNextScreen() {
    const investStatus = this.signUpService.getInvestmentStatus();
    if (investStatus && investStatus === SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATION_FAILED) {
      const pepData = this.investmentAccountService.getPepData();
      const OldPepData = this.investmentAccountService.getOldPepData();
      if (pepData && !OldPepData) {
        this.goToAdditionalDeclaration();
      } else {
        this.createInvestmentAccount();
      }
    } else {
      this.verifyAML();
    }
  }

  verifyAML() {
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant(
          'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.TITLE'
        ),
        desc: this.translate.instant(
          'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.DESCRIPTION'
        )
      });
      const pepData = this.investmentAccountService.getPepData();
      this.investmentAccountService.verifyAML().subscribe(
        (response) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          if (response.objectList && response.objectList.status) {
            this.investmentAccountService.setAccountCreationStatus(
              response.objectList.status
            );
          }
          if (response.responseMessage.responseCode < 6000) {
            // ERROR SCENARIO
            if (
              response.objectList &&
              response.objectList.length &&
              response.objectList[response.objectList.length - 1].serverStatus &&
              response.objectList[response.objectList.length - 1].serverStatus.errors &&
              response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              const errorResponse = response.objectList[response.objectList.length - 1];
              const errorList = errorResponse.serverStatus.errors;
              this.showInvestmentAccountErrorModal(errorList);
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal('Error!', errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else if (
            response.objectList.status.toUpperCase() === INVESTMENT_ACCOUNT_CONSTANTS.status.aml_cleared.toUpperCase() &&
            !pepData
          ) {
            this.createInvestmentAccount();
          } else {
            this.goToAdditionalDeclaration();
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }

  goToAdditionalDeclaration() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION]);
  }

  // tslint:disable-next-line:cognitive-complexity
  createInvestmentAccount() {
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant(
          'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.TITLE'
        ),
        desc: this.translate.instant(
          'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.DESCRIPTION'
        )
      });
      this.investmentAccountService.createInvestmentAccount().subscribe(
        (response) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          if (response.responseMessage.responseCode < 6000) {
            // ERROR SCENARIO
            if (
              response.objectList &&
              response.objectList.length &&
              response.objectList[response.objectList.length - 1].serverStatus &&
              response.objectList[response.objectList.length - 1].serverStatus.errors &&
              response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              const errorResponse = response.objectList[response.objectList.length - 1];
              const errorList = errorResponse.serverStatus.errors;
              this.showInvestmentAccountErrorModal(errorList);
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal('Error!', errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else {
            // SUCCESS SCENARIO
            if (response.objectList[response.objectList.length - 1]) {
              if (
                response.objectList[response.objectList.length - 1].data.status.toUpperCase() ===
                INVESTMENT_ACCOUNT_CONSTANTS.status.account_creation_confirmed.toUpperCase()
              ) {
                this.investmentAccountService.setAccountSuccussModalCounter(0);
                this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUND_INTRO]);
              } else {
                this.investmentAccountService.setAccountCreationStatus(
                  INVESTMENT_ACCOUNT_CONSTANTS.status.account_creation_pending
                );
                this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SETUP_PENDING]);
              }
            }
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }
}
