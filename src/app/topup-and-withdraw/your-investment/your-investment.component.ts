import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import {
    PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES
} from '../../portfolio/portfolio-routes.constants';
import { ProfileIcons } from '../../portfolio/risk-profile/profileIcons';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ConsoleLoggerService } from '../../shared/logger/console-logger.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { TopUpAndWithdrawFormData } from '../topup-and-withdraw-form-data';
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
    public topupAndWithDrawService: TopupAndWithDrawService
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
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getMoreList();
    this.getInvestmentOverview();
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
  }
  getMoreList() {
    this.moreList = TOPUPANDWITHDRAW_CONFIG.INVESTMENT_OVERVIEW.MORE_LIST;
  }
  addPortfolio() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
  }
  yourPortfolio(portfolio) {
    this.PortfolioValues = this.topupAndWithDrawService.setPortfolioValues(portfolio);
    if (portfolio.currentValue) {
      this.topupAndWithDrawService.setHoldingValues(portfolio.dpmsDetailsDisplay);
    }
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.YOUR_PORTFOLIO]);
  }
  selectSource(option) {}
  getInvestmentOverview() {
    this.topupAndWithDrawService.getInvestmentOverview().subscribe((data) => {
      this.investmentoverviewlist = data.objectList;
      this.totalReturns = this.investmentoverviewlist.data.totalReturns
        ? this.investmentoverviewlist.data.totalReturns
        : 0;
      this.cashAccountBalance = this.investmentoverviewlist.data.cashAccountDetails
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
    });
  }

  fundYourAccount() {
    //this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
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
    const riskProfileImg = ProfileIcons[i]['icon'];
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
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_INVESTMENT.TITLE');
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_INVESTMENT.DELETE_TXT'
    );
    ref.componentInstance.yesOrNoButton = 'Yes';
    ref.componentInstance.yesClickAction.subscribe(() => {
      this.topupAndWithDrawService.deletePortfolio(portfolio).subscribe((data) => {
        if (data.responseMessage.responseCode === 6000) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
        }
      });
    });
    ref.componentInstance.noClickAction.subscribe(() => {});
  }
  selectOption(option) {
    if (option.id === 1) {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TRANSACTION]);
    } else {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL]);
    }
  }
}
