import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { SignUpApiService } from 'src/app/sign-up/sign-up.api.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';
import { ProfileIcons } from '../../portfolio/risk-profile/profileIcons';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpService } from '../../sign-up/sign-up.service';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';
@Component({
  selector: 'app-your-investment',
  templateUrl: './your-investment.component.html',
  styleUrls: ['./your-investment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourInvestmentComponent implements OnInit {
  totalPortfolio;
  welcomeInfo;
  investmentoverviewlist: any;
  portfolioList;
  totalReturns: any;
  cashAccountBalance: any;
  totalValue: any;
  selectedDropDown;
  pageTitle: string;
  moreList: any;
  PortfolioValues;
  portfolios;
  userProfileInfo;
  showAlretPopUp = false;
  selected;
  riskProfileImg: any;
  portfolio;
  productCode;
  entitlements: any;

  // transfer instructions
  bankDetails;
  paynowDetails;
  transferInstructionModal;
  isToastMessageShown;
  toastMsg;

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
    public signUpService: SignUpService,
    public activeModal: NgbActiveModal,
    public topupAndWithDrawService: TopupAndWithDrawService,
    private investmentAccountService: InvestmentAccountService,
    private signUpApiService: SignUpApiService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('YOUR_INVESTMENT.TITLE');
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
    this.getInvestmentOverview();
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.getTransferDetails();

  }
  getMoreList() {
    this.moreList = TOPUPANDWITHDRAW_CONFIG.INVESTMENT_OVERVIEW.MORE_LIST;
  }
  addPortfolio() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
  }
  yourPortfolio(portfolio) {
    if (portfolio.portfolioStatus !== 'EXPIRED') {
      this.topupAndWithDrawService.setPortfolioValues(portfolio);
      if (portfolio.currentValue) {
        this.topupAndWithDrawService.setHoldingValues(portfolio.dpmsDetailsDisplay);
      }
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.YOUR_PORTFOLIO]);
    }
  }
  getInvestmentOverview() {
    this.topupAndWithDrawService.getInvestmentOverview().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        this.investmentoverviewlist = data.objectList;
        this.totalReturns = this.investmentoverviewlist.data.totalReturns
          ? this.investmentoverviewlist.data.totalReturns
          : 0;
        this.cashAccountBalance = this.investmentoverviewlist.data.cashAccountDetails.availableBalance
          ? this.investmentoverviewlist.data.cashAccountDetails.availableBalance
          : 0;
        this.totalValue = this.investmentoverviewlist.data.totalValue
          ? this.investmentoverviewlist.data.totalValue
          : 0;
        this.portfolioList = this.investmentoverviewlist.data.portfolios;
        this.totalPortfolio = this.portfolioList.length;
        this.welcomeInfo = {
          name: this.userProfileInfo.firstName,
          total: this.totalPortfolio
        };
        this.topupAndWithDrawService.setUserPortfolioList(this.portfolioList);
        if (this.investmentoverviewlist.data.cashAccountDetails) {
          this.topupAndWithDrawService.setUserCashBalance(
            this.investmentoverviewlist.data.cashAccountDetails.availableBalance
          );
        }
        /* First portfolio's entitlement is considered for now as global entitlement,
            need to change when multiple portfolio logic is implemented */
        this.entitlements = this.topupAndWithDrawService.getEntitlementsFromPortfolio(this.portfolioList[0]);
      } else if (
        data.objectList &&
        data.objectList.length &&
        data.objectList[data.objectList.length - 1].serverStatus &&
        data.objectList[data.objectList.length - 1].serverStatus.errors &&
        data.objectList[data.objectList.length - 1].serverStatus.errors.length
      ) {
        this.showCustomErrorModal(
          'Error!',
          data.objectList[data.objectList.length - 1].serverStatus.errors[0].msg
        );
      } else if (data.responseMessage && data.responseMessage.responseDescription) {
        const errorResponse = data.responseMessage.responseDescription;
        this.showCustomErrorModal('Error!', errorResponse);
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
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
  ViewTransferInst(productCode) {
    this.productCode = productCode;
    this.getPortfolioHoldingList(productCode);   // SET PORTFOLIO CODE
  }

  getPortfolioHoldingList(portfolioid) {   // CALLING THE API
    this.topupAndWithDrawService
      .getIndividualPortfolioDetails(portfolioid)
      .subscribe((data) => {
        this.portfolio = data.objectList;
        const fundingParams = this.constructFundingParams(data.objectList);
        this.topupAndWithDrawService.setFundingDetails(fundingParams);
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
      },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  constructFundingParams(data) {   // SET FUND DETAILS VAlUES
    return {
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
  }
  // tslint:disable-next-line
  showCashAccountPopUp() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.CASH_ACCOUNT_BALANCE.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.CASH_ACCOUNT_BALANCE.MESSAGE'
    );
  }

  getImg(i) {
    const riskProfileImg = ProfileIcons[i - 1]['icon'];
    return riskProfileImg;
  }

  alertPopUp(i) {
    this.selected = i;
    this.showAlretPopUp = true;
  }
  ClosedPopup() {
    this.showAlretPopUp = false;
  }
  deletePortfolio(portfolio) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_INVESTMENT.DELETE');
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_INVESTMENT.DELETE_TXT'
    );
    ref.componentInstance.yesOrNoButton = 'Yes';
    ref.componentInstance.yesClickAction.subscribe(() => {
      this.topupAndWithDrawService.deletePortfolio(portfolio).subscribe((data) => {
        if (data.responseMessage.responseCode === 6000) {
          this.authService.saveEnquiryId(null);
          const translateParams = {
            portfolioName: portfolio.riskProfile.type
          };
          const toastMsg = this.translate.instant('YOUR_INVESTMENT.PORTFOLIO_DELETE_MESSAGE', translateParams);
          this.showToastMessage(toastMsg);
          this.getInvestmentOverview();
          this.getUserProfileInfo();
        } else {
          this.investmentAccountService.showGenericErrorModal();
        }
      },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
    });
    ref.componentInstance.noClickAction.subscribe(() => { });
  }

  selectOption(option) {
    this.topupAndWithDrawService.showMenu(option);
  }
  formatReturns(value) {
    return this.investmentAccountService.formatReturns(value);
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

/*
* Method to get transfer details
*/
 getTransferDetails() {
  this.topupAndWithDrawService.getTransferDetails().subscribe((data) => {
    this.topupAndWithDrawService.setBankPayNowDetails(data.objectList[0]);
  },
  (err) => {
    this.investmentAccountService.showGenericErrorModal();
  });
 }

/*
* Method to show transfer instruction steps modal
*/
showTransferInstructionModal() {
  this.topupAndWithDrawService.showTransferInstructionModal();
}

/*
* Method to show recipients/entity name instructions modal
*/
showPopUp() {
  this.topupAndWithDrawService.showPopUp();
}

  showToastMessage(msg) {
    this.isToastMessageShown = true;
    this.toastMsg = msg;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
    setTimeout(() => {
      this.isToastMessageShown = false;
    }, 3000);
  }

  investAgain(portfolio) {
    this.topupAndWithDrawService.setPortfolioValues(portfolio);
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP]);
  }

  startPortfolio() {
    this.authService.saveEnquiryId(null);
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
  }
  gotoTopUp() {  // GO TO TOP-UP
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP]);
      }

  getUserProfileInfo() {
    this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
      if (userInfo.responseMessage.responseCode < 6000) {
        // ERROR SCENARIO
        if (
          userInfo.objectList &&
          userInfo.objectList.length &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors[0].msg
          );
        } else if (userInfo.responseMessage && userInfo.responseMessage.responseDescription) {
          const errorResponse = userInfo.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.investmentAccountService.showGenericErrorModal();
        }
      } else {
        this.signUpService.setUserProfileInfo(userInfo.objectList);
        /* First portfolio's entitlement is considered for now as global entitlement, 
            need to change when multiple portfolio logic is implemented */
        this.entitlements = this.topupAndWithDrawService.getEntitlementsFromPortfolio(this.portfolioList[0]);
      }
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  getEntitlementsFromPortfolio(portfolio) {
    return this.topupAndWithDrawService.getEntitlementsFromPortfolio(portfolio);
  }
}
