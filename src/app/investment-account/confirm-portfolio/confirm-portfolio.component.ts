import { PortfolioService } from 'src/app/portfolio/portfolio.service';

import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';
import { ProfileIcons } from '../../portfolio/risk-profile/profileIcons';
import {
  BreakdownAccordionComponent
} from '../../shared/components/breakdown-accordion/breakdown-accordion.component';
import {
  BreakdownBarComponent
} from '../../shared/components/breakdown-bar/breakdown-bar.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HeaderService } from '../../shared/header/header.service';
import {
  EditInvestmentModalComponent
} from '../../shared/modal/edit-investment-modal/edit-investment-modal.component';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { FundDetails } from '../../topup-and-withdraw/fund-your-account/fund-details';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
import {
  AccountCreationErrorModalComponent
} from '../account-creation-error-modal/account-creation-error-modal.component';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

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
  showLoader;
  loaderTitle;
  loaderDesc;
  formData: FormData = new FormData();
  portfolio;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  userInputSubtext;
  //riskProfileImage: any;

  breakdownSelectionindex: number = null;
  isAllocationOpen = false;

  legendColors: string[] = ['#3cdacb', '#ec681c', '#76328e'];

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public portfolioService: PortfolioService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public investmentAccountService: InvestmentAccountService) {
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
    this.navbarService.setNavbarMode(2);
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const params = this.constructgetPortfolioParams();
    const mockData = {
      "exception": null,
      "objectList": {
        "investmentPeriod": 65,
        "projectedValue": 0.0,
        "portfolioId": "PORTFOLIO00050",
        "portfolioName": "Balanced",
        "tenure": "65",
        "projectedReturnsHighEnd": 1286079.0,
        "projectedReturnsMedian": 1263385.0,
        "projectedReturnsLowEnd": 1240987.0,
        "portfolioType": null,
        "portfolioStatus": "RECOMMENDED",
        "portfolioMaturityYear": "2083",
        "initialInvestment": 111.0,
        "monthlyInvestment": 111.0,
        "riskProfile": {
          "id": 3,
          "type": "Balanced",
          "order": 1
        },
        "feeDetails": [{
          "id": 9,
          "feeName": "Advisory Fee",
          "percentage": "0.65%",
          "comments": null,
          "listing_order": 1
        }, {
          "id": 10,
          "feeName": "Platform Fee",
          "percentage": "0.18%",
          "comments": "Paid to iFAST",
          "listing_order": 2
        }, {
          "id": 11,
          "feeName": "Fund Management Expenses",
          "percentage": "0.35%",
          "comments": "Paid to DFA",
          "listing_order": 3
        }, {
          "id": 12,
          "feeName": "Total Fee",
          "percentage": "1.18%",
          "comments": null,
          "listing_order": 4
        }],
        "sectorAllocations": [{
          "id": 3,
          "name": "Global Equities",
          "sectorId": "SECTOR00014",
          "type": {
            "id": 3,
            "type": "Global Equity"
          },
          "riskRating": 9.0,
          "groupedAllocationDetails": {
            "Class Allocation": [{
              "id": 29,
              "sectorTitle": "Class Allocation",
              "sectorRegion": "Developed Markets",
              "percentage": 88.5
            }, {
              "id": 30,
              "sectorTitle": "Class Allocation",
              "sectorRegion": "Emerging Markets",
              "percentage": 11.5
            }],
            "Sector Allocation": [{
              "id": 38,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Industrials",
              "percentage": 16.4
            }, {
              "id": 46,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Other",
              "percentage": 6.0
            }, {
              "id": 43,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Energy",
              "percentage": 7.0
            }, {
              "id": 39,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Consumer Disc",
              "percentage": 13.3
            }, {
              "id": 40,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Info Technology",
              "percentage": 12.9
            }, {
              "id": 42,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Materials",
              "percentage": 7.0
            }, {
              "id": 37,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Financials",
              "percentage": 17.8
            }, {
              "id": 44,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Consumer Staples",
              "percentage": 6.7
            }, {
              "id": 45,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "REITs",
              "percentage": 3.4
            }, {
              "id": 41,
              "sectorTitle": "Sector Allocation",
              "sectorRegion": "Health Care",
              "percentage": 9.6
            }],
            "Regional Allocation": [{
              "id": 32,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Asia Pacific",
              "percentage": 21.3
            }, {
              "id": 31,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "North America",
              "percentage": 57.4
            }, {
              "id": 35,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Africa",
              "percentage": 0.7
            }, {
              "id": 36,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Middle East",
              "percentage": 0.3
            }, {
              "id": 33,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Europe",
              "percentage": 18.8
            }, {
              "id": 34,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Latin America",
              "percentage": 1.5
            }]
          },
          "allocationPercentage": 60.0
        }, {
          "id": 2,
          "name": "Global Bonds",
          "sectorId": "SECTOR00013",
          "type": {
            "id": 2,
            "type": "Bonds"
          },
          "riskRating": 9.0,
          "groupedAllocationDetails": {
            "Credit Rating Allocation": [{
              "id": 24,
              "sectorTitle": "Credit Rating Allocation",
              "sectorRegion": "A",
              "percentage": 21.7
            }, {
              "id": 22,
              "sectorTitle": "Credit Rating Allocation",
              "sectorRegion": "AAA",
              "percentage": 21.0
            }, {
              "id": 23,
              "sectorTitle": "Credit Rating Allocation",
              "sectorRegion": "AA",
              "percentage": 57.3
            }],
            "Regional Allocation": [{
              "id": 28,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Asia Pacific",
              "percentage": 9.3
            }, {
              "id": 25,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Europe",
              "percentage": 48.7
            }, {
              "id": 27,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "Supranational",
              "percentage": 11.3
            }, {
              "id": 26,
              "sectorTitle": "Regional Allocation",
              "sectorRegion": "North America",
              "percentage": 30.8
            }]
          },
          "allocationPercentage": 40.0
        }],
        "funds": [{
          "id": "DIM035",
          "name": "Dimensional Global Short Fixed Inc ACC-H SGD",
          "type": "UT",
          "sectorName": "Global Bonds",
          "prospectusLink": null,
          "percentage": 20,
          "factSheetLink": "DIM035-FS.pdf|DIM035-P.pdf",
          "htmlDesc": null
        }, {
          "id": "DIM036",
          "name": "Dimensional Global Short Term Inv Gr Fixed Inc ACC-H SGD ",
          "type": "UT",
          "sectorName": "Global Bonds",
          "prospectusLink": null,
          "percentage": 20,
          "factSheetLink": "DIM036-FS.pdf|DIM036-P.pdf",
          "htmlDesc": null
        }, {
          "id": "DIM034",
          "name": "Dimensional Global Core Equity ACC SGD",
          "type": "UT",
          "sectorName": "Global Equities",
          "prospectusLink": null,
          "percentage": 45,
          "factSheetLink": "DIM034-FS.pdf|DIM034-P.pdf",
          "htmlDesc": null
        }, {
          "id": "DIM037",
          "name": "Dimensional Global Targeted Value ACC SGD",
          "type": "UT",
          "sectorName": "Global Equities",
          "prospectusLink": null,
          "percentage": 10,
          "factSheetLink": "DIM037-FS.pdf|DIM037-P.pdf",
          "htmlDesc": null
        }, {
          "id": "DIM033",
          "name": "Dimensional EM Large Cap Core Equity ACC SGD",
          "type": "UT",
          "sectorName": "Global Equities",
          "prospectusLink": null,
          "percentage": 5,
          "factSheetLink": "DIM033-FS.pdf|DIM033-P.pdf",
          "htmlDesc": null
        }]
      },
      "responseMessage": {
        "responseCode": 6000,
        "responseDescription": "Successful response"
      }
    };
    this.investmentAccountService.getPortfolioAllocationDetails(params).subscribe((data) => {
      this.portfolio = mockData.objectList;
      const fundingParams = this.constructFundingParams(mockData.objectList);
      this.topupAndWithDrawService.setFundingDetails(fundingParams);
      this.userInputSubtext = {
        onetime: this.currencyPipe.transform(this.portfolio.initialInvestment, 'USD', 'symbol-narrow', '1.0-2'),
        monthly: this.currencyPipe.transform(this.portfolio.monthlyInvestment, 'USD', 'symbol-narrow', '1.0-2'),
        period: this.portfolio.investmentPeriod
      };
    });

  }

  constructFundingParams(data) {
    const topupValues = {
      source: 'FUNDING',
      portfolio: {
        productName: data.portfolioName,
        riskProfile: data.riskProfile
      },
      oneTimeInvestment: data.initialInvestment,
      monthlyInvestment: data.monthlyInvestment,
      fundingType: '', // todo
      isAmountExceedBalance: 0,
      exceededAmount: 0
    };
    return topupValues;
  }

  constructgetPortfolioParams() {
    return {
    };
  }

  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
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

  showPortfolioAssetModal() {
    const errorTitle = this.translate.instant('CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.TITLE');
    const errorMessage = this.translate.instant('CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.MESSAGE');
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
    });
  }

  constructUpdateInvestmentParams(data) {
    return {
      initialInvestment: data.oneTimeInvestment,
      monthlyInvestment: data.monthlyInvestment
    };
  }

  goToWhatsTheRisk() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  showInvestmentAccountErrorModal(errorList) {
    const errorTitle = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.ACCOUNT_CREATION_ERROR_MODAL.TITLE');
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

  viewFundDetails(fund) {
    this.portfolioService.setFundDetails(fund);
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.FUND_DETAILS]);
  }

  verifyAML() {
    const pepData = this.investmentAccountService.getPepData();
    this.investmentAccountService.verifyAML().subscribe((response) => {
      this.investmentAccountService.setAccountCreationStatus(response.objectList.status);
      if (response.responseMessage.responseCode < 6000) { // ERROR SCENARIO
        if (response.responseMessage.responseCode === 5018
          || response.responseMessage.responseCode === 5019) {
          const errorResponse = response.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          const errorResponse = response.objectList[response.objectList.length - 1];
          const errorList = errorResponse.serverStatus.errors;
          this.showInvestmentAccountErrorModal(errorList);
        }
      } else if (response.objectList.status === INVESTMENT_ACCOUNT_CONFIG.status.aml_cleared && !pepData) {
        this.createInvestmentAccount();
      } else {
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION]);
      }
    },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.TITLE');
        ref.componentInstance.errorMessage = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.DESCRIPTION');
      });
  }

  createInvestmentAccount() {
    const pepData = this.investmentAccountService.getPepData();
    if (pepData) {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION]);
    } else {
      // CREATE INVESTMENT ACCOUNT
      console.log('Attempting to create ifast account');
      this.investmentAccountService.createInvestmentAccount().subscribe((response) => {
        if (response.responseMessage.responseCode < 6000) { // ERROR SCENARIO
          if (response.responseMessage.responseCode === 5018
            || response.responseMessage.responseCode === 5019) {
            const errorResponse = response.responseMessage.responseDescription;
            this.showCustomErrorModal('Error!', errorResponse);
          } else {
            const errorResponse = response.objectList[response.objectList.length - 1];
            const errorList = errorResponse.serverStatus.errors;
            this.showInvestmentAccountErrorModal(errorList);
          }
        } else { // SUCCESS SCENARIO
          if (response.objectList[response.objectList.length - 1]) {
            if (response.objectList[response.objectList.length - 1].data.status === 'confirmed') {
              this.investmentAccountService.setAccountSuccussModalCounter(0);
              this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FUND_INTRO]);
            } else {
              this.investmentAccountService.setAccountCreationStatus(INVESTMENT_ACCOUNT_CONFIG.status.account_creation_pending);
              this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SETUP_PENDING]);
            }
          }
        }
      },
        (err) => {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.TITLE');
          ref.componentInstance.errorMessage = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.DESCRIPTION');
        });
    }
  }
}
